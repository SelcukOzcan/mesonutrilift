import { fold } from "./text";

/**
 * Google Sheet bağlantısı. İki yoldan biriyle tanımlanır:
 * - `url`: Sheet'te Dosya > Paylaş > Web'de yayınla ile alınan bağlantı (…/d/e/2PACX-…/pub?gid=…).
 *   Tarayıcıdaki adres çubuğundaki normal bağlantı (…/d/<id>/edit#gid=…) da yapıştırılabilir.
 * - `id` (+ `sheet` sekme adı ya da `gid` sekme numarası): Sheet "Bağlantıya sahip olan herkes
 *   görüntüleyebilir" olarak paylaşılır; docs.google.com/spreadsheets/d/<id>/edit adresindeki <id>.
 */
export type SheetSource = { url?: string; id?: string; sheet?: string; gid?: string };

/** Sütun başlıkları `fold` ile normalize edilmiş anahtarlar olarak tutulur: "Öne Çıkan" → "one cikan". */
export type SheetRow = Record<string, string>;

type GvizCell = { v?: unknown; f?: string | null } | null;
type GvizResponse = {
  status: "ok" | "warning" | "error";
  errors?: { detailed_message?: string; message?: string }[];
  table: { cols: { id: string; label: string; type: string }[]; rows: { c: GvizCell[] }[] };
};

export const isConfigured = (source?: SheetSource): source is SheetSource => Boolean(source?.url?.trim() || source?.id?.trim());

export function gvizUrl({ id = "", sheet, gid }: SheetSource): string {
  const params = new URLSearchParams({ tqx: "out:json", headers: "1" });
  if (gid) params.set("gid", gid);
  else if (sheet) params.set("sheet", sheet);
  return `https://docs.google.com/spreadsheets/d/${id.trim()}/gviz/tq?${params}`;
}

const PUBLISHED_LINK = /\/spreadsheets\/(?:u\/\d+\/)?d\/e\/([\w-]+)/;
const EDIT_LINK = /\/spreadsheets\/(?:u\/\d+\/)?d\/([\w-]+)/;

/** Yapıştırılan bağlantıdan okunacak adresi ve biçimi çıkarır. */
export function sheetEndpoint(source: SheetSource): { url: string; format: "csv" | "gviz" } {
  const link = source.url?.trim();
  if (!link) return { url: gvizUrl(source), format: "gviz" };

  const gid = source.gid || link.match(/[?&#]gid=(\d+)/)?.[1];
  const published = link.match(PUBLISHED_LINK);
  if (published) {
    const params = new URLSearchParams({ output: "csv" });
    if (gid) {
      params.set("gid", gid);
      params.set("single", "true");
    }
    return { url: `https://docs.google.com/spreadsheets/d/e/${published[1]}/pub?${params}`, format: "csv" };
  }
  const edit = link.match(EDIT_LINK);
  if (edit) return { url: gvizUrl({ id: edit[1], sheet: source.sheet, gid }), format: "gviz" };
  throw new Error("Sheet bağlantısı tanınmadı. Web'de yayınla bağlantısını ya da Sheet adresini kullanın.");
}

export const headerKey = (label: string) => fold(label);

/** Hücredeki satır sonlarını ve fazla boşlukları temizler. */
const clean = (value: string) => value.replace(/\s+/g, " ").trim();

/** Yedek JSON gibi ham başlıklı satırları Sheet satırı biçimine çevirir. */
export function toSheetRow(record: Record<string, unknown>): SheetRow {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [headerKey(key), clean(String(value ?? ""))]));
}

/** Satırdaki ilk dolu sütunu döner; Sheet'te başlık adı değişse de eşanlamlılar sayesinde çalışır. */
export function pick(row: SheetRow, aliases: readonly string[]): string {
  for (const alias of aliases) {
    const value = row[alias];
    if (value) return value;
  }
  return "";
}

const TRUTHY = new Set(["evet", "true", "1", "x", "var", "aktif", "yes", "✓", "✔"]);
const FALSY = new Set(["hayir", "false", "0", "yok", "pasif", "no"]);
export const isYes = (value: string) => TRUTHY.has(fold(value));
export const isNo = (value: string) => FALSY.has(fold(value));

function cellText(cell: GvizCell, type: string): string {
  if (!cell || cell.v === null || cell.v === undefined) return clean(cell?.f ?? "");
  if ((type === "date" || type === "datetime") && typeof cell.v === "string") {
    // gviz tarihleri "Date(2020,1,2)" biçiminde, ay 0'dan başlar
    const m = cell.v.match(/^Date\((\d+),(\d+),(\d+)/);
    if (m) return `${m[1]}-${String(+m[2] + 1).padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  }
  if (typeof cell.v === "boolean") return cell.v ? "evet" : "hayır";
  return clean(String(cell.f ?? cell.v));
}

export function parseGviz(text: string): SheetRow[] {
  const match = text.match(/setResponse\(([\s\S]*)\);?\s*$/);
  if (!match) throw new Error("Sheet yanıtı okunamadı. Paylaşım ayarını kontrol edin.");
  const data = JSON.parse(match[1]) as GvizResponse;
  if (data.status === "error") {
    throw new Error(data.errors?.[0]?.detailed_message ?? data.errors?.[0]?.message ?? "Sheet hata döndürdü");
  }
  const cols = data.table.cols.map((col) => ({ key: headerKey(col.label || col.id), type: col.type }));
  return data.table.rows
    .map((row) => Object.fromEntries(cols.map((col, i) => [col.key, cellText(row.c?.[i] ?? null, col.type)])))
    .filter((row) => Object.values(row).some(Boolean));
}

/** RFC 4180 CSV: tırnaklı alanlar, kaçışlı tırnaklar ("") ve hücre içi satır sonları desteklenir. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch !== '"') field += ch;
      else if (text[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = false;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function parseCsvRows(text: string): SheetRow[] {
  if (/^\s*</.test(text)) throw new Error("Sheet CSV yerine sayfa döndürdü. Web'de yayınla ayarını kontrol edin.");
  const [header = [], ...body] = parseCsv(text.replace(/^﻿/, ""));
  const keys = header.map((label, i) => headerKey(label) || `sutun ${i + 1}`);
  return body
    .map((cells) => Object.fromEntries(keys.map((key, i) => [key, clean(cells[i] ?? "")])))
    .filter((row) => Object.values(row).some(Boolean));
}

const inflight = new Map<string, Promise<SheetRow[]>>();

/**
 * Sheet satırlarını çeker. Build sırasında (sunucu) ve tarayıcıda aynı kod çalışır.
 * Tarayıcıda `init` ile `{ cache: "no-store" }` verilir; build'de verilmez (statik export'u bozmamak için).
 */
export function fetchSheetRows(source: SheetSource, init?: RequestInit): Promise<SheetRow[]> {
  const { url, format } = sheetEndpoint(source);
  const load = () =>
    fetch(url, init).then(async (res) => {
      if (!res.ok) throw new Error(`Sheet isteği başarısız (${res.status})`);
      const text = await res.text();
      return format === "csv" ? parseCsvRows(text) : parseGviz(text);
    });
  if (typeof window === "undefined") return load();

  // Tarayıcıda aynı sayfadaki bileşenler tek isteği paylaşır.
  const cached = inflight.get(url);
  if (cached) return cached;
  const request = load().catch((error) => {
    inflight.delete(url);
    throw error;
  });
  inflight.set(url, request);
  return request;
}
