/** Türkçe kurallarına göre küçük harfe çevirir (İ → i, I → ı). */
export const trLower = (value: string) => value.toLocaleLowerCase("tr-TR");

/**
 * Aramada ve başlık eşleştirmede kullanılır: küçük harf + aksan/şapka temizliği.
 * "Üsküdar", "uskudar" ve "USKUDAR" aynı sonucu verir.
 */
export function fold(value: string): string {
  return trLower(value)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/g, "i")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value: string): string {
  return fold(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "İstanbul" → "İstanbul'da", "Gaziantep" → "Gaziantep'te", "İzmir" → "İzmir'de" */
export function locative(name: string): string {
  const lower = trLower(name);
  const lastVowel = [...lower].reverse().find((ch) => "aeıioöuü".includes(ch)) ?? "e";
  const hardConsonant = "çfhkpsşt".includes(lower.at(-1) ?? "");
  const suffix = (hardConsonant ? "t" : "d") + ("aıou".includes(lastVowel) ? "a" : "e");
  return `${name}'${suffix}`;
}

export const compareTr = (a: string, b: string) => a.localeCompare(b, "tr-TR");

/** Tamamı büyük ya da küçük yazılmış yer adlarını düzeltir: "İSTANBUL" / "istanbul" → "İstanbul". Karışık yazıma dokunmaz. */
export function titleTr(value: string): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text !== text.toLocaleUpperCase("tr-TR") && text !== trLower(text)) return text;
  return trLower(text).replace(/(^|[\s(/-])(\p{L})/gu, (_, before: string, letter: string) => before + letter.toLocaleUpperCase("tr-TR"));
}
