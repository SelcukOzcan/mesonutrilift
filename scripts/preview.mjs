// `npm run build` çıktısını (out/) cPanel'deki gibi sunar: /klinikler/ → out/klinikler/index.html
// Kullanım: npm run preview  (varsayılan port 4173)
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
const port = Number(process.env.PORT) || 4173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

if (!existsSync(root)) {
  console.error("out/ klasörü yok. Önce `npm run build` çalıştırın.");
  process.exit(1);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let path = normalize(join(root, decodeURIComponent(url.pathname)));
  if (!path.startsWith(root)) return res.writeHead(403).end();

  if (existsSync(path) && statSync(path).isDirectory()) {
    if (!url.pathname.endsWith("/")) return res.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
    path = join(path, "index.html");
  }

  const found = existsSync(path) && statSync(path).isFile();
  const file = found ? path : join(root, "404.html");
  res.writeHead(found ? 200 : 404, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Önizleme: http://localhost:${port}`));
