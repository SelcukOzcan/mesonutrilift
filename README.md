# MesoNutrilift Web

Next.js 16 (App Router) + Tailwind CSS 4 ile geliştirilen, **statik çıktı** üreten site. Build sonrası oluşan `out/` klasörü standart cPanel hostinge yüklenir; sunucuda Node.js gerekmez.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm install` | Bağımlılıkları kurar (ilk seferde) |
| `npm run dev` | Geliştirme sunucusu → http://localhost:3000 |
| `npm run build` | Yayın paketini `out/` klasörüne üretir |
| `npm run preview` | `out/` klasörünü cPanel'deki gibi sunar → http://localhost:4173 |

> Bu Mac'te `~/.npm` klasörü root'a ait olduğu için `npm install` hata verebilir. Bir kez şu komutu çalıştırmanız yeterli: `sudo chown -R $(whoami) ~/.npm`

## Klasör yapısı

```
src/
  app/                 Sayfalar (/, /klinikler, /klinikler/[il], /tv-yayinlari, /blog) + sitemap, robots, llms.txt
  components/          Arayüz bileşenleri (home/, clinics/, videos/, layout/)
  content/             TÜM İÇERİK — metinler, görsel referansları, SSS, site ayarları, blog yazıları
    site.json          Marka, iletişim, Google Sheet bağlantıları
    home.json          Anasayfa metinleri
    faq.json           Sıkça sorulan sorular
    media.json         Görsel adresleri (gerçek görseller gelince sadece burası değişir)
    posts/*.md         Blog yazıları
  data/                Sheet'e ulaşılamazsa kullanılan yedek veriler
  lib/                 Veri katmanı (Sheet okuma, klinik/video modelleri, schema.org)
sheet-sablonlari/      Google Sheet'e içe aktarılacak hazır CSV'ler
public/.htaccess       cPanel ayarları (yönlendirmeler, önbellek, güvenlik başlıkları)
```

İçerik yalnızca `src/content/` altında durur ve bileşenler ona `src/lib/content.ts` üzerinden erişir. İleride ajans CMS'ine geçildiğinde yalnızca bu dosyanın veri kaynağı değişir.

## Google Sheet kurulumu (klinikler ve videolar)

1. Google Sheets'te yeni bir dosya açın. İki sekme oluşturun: **Klinikler** ve **Videolar**. Sekme adları birebir aynı olmalı. Yanlış yazılırsa Google hata vermez, sessizce ilk sekmeyi döndürür.
2. Her sekmeye `sheet-sablonlari/` içindeki ilgili CSV'yi içe aktarın: *Dosya → İçe aktar → Yükle → "Mevcut sayfayı değiştir"*.
3. Tüm sütunları seçip *Biçim → Sayı → Düz metin* yapın. Google, aynı sütunda sayı ve metin karışınca bazı hücreleri boş döndürebiliyor; düz metin bunu önler.
4. *Paylaş → Genel erişim → "Bağlantıya sahip olan herkes" → Görüntüleyen* olarak ayarlayın.
5. Sheet adresindeki kimliği (`docs.google.com/spreadsheets/d/`**`KIMLIK`**`/edit`) `src/content/site.json` içindeki `sheets.clinics.id` ve `sheets.videos.id` alanlarına yazın. Ardından build alıp yükleyin.

Bundan sonra **Sheet'te yapılan her değişiklik sitede anında görünür**. Ziyaretçi sayfayı açtığında güncel veri Sheet'ten çekilir, yeni build gerekmez. Build sırasında okunan veri de HTML'e gömülür; böylece sayfa anında açılır, arama motorları ve yapay zeka botları listeyi görür. Sheet'e ulaşılamazsa gömülü veri gösterilir, ziyaretçi hiçbir zaman boş liste görmez.

**Klinikler sütunları:** `Klinik / Doktor` · `İl` · `İlçe` · `Adres` · `Telefon` · `Web` · `Instagram` · `WhatsApp` · `Öne Çıkan` · `Aktif`
- `Aktif` = "Hayır" yazılırsa klinik gizlenir. `Öne Çıkan` = "Evet" yazılırsa klinik listenin başına gelir. Diğer klinikler Sheet'teki sırayla listelenir.
- Telefon her biçimde yazılabilir; site `0212 425 23 93` biçimine çevirir.

**Videolar sütunları:** `Video Linki` · `Başlık` · `Doktor` · `Kanal` · `Tarih` · `Öne Çıkan` · `Aktif`
- Yalnızca **YouTube linki zorunlu**. `Başlık` boş bırakılırsa YouTube'daki başlık otomatik gelir, kapak görseli videodan alınır.
- `Kanal` doldurulursa TV yayınları sayfasında kanal filtresi oluşur. `Tarih` (gg.aa.yyyy) Google video zengin sonuçları için gereklidir.

**Şehir sayfaları** (`/klinikler/istanbul/` gibi) build sırasında Sheet'teki illerden üretilir. Yeni bir il eklendiğinde klinik ana listede hemen görünür; o ilin ayrı sayfası bir sonraki build'de oluşur.

## cPanel'e yayın

1. `npm run build`
2. `out/` klasörünün **içindekileri** (gizli `.htaccess` dosyası dahil) cPanel → Dosya Yöneticisi → `public_html` içine yükleyin. Önce zip'leyip yükleyip sunucuda açmak daha hızlıdır.
3. İçerik veya blog değiştiğinde 1–2. adımları tekrarlayın. Klinik ve video değişiklikleri için bu gerekmez.

## Yayın öncesi kontrol listesi

- [ ] Gerçek görseller `public/images/` altına konup `src/content/media.json` güncellendi. Şu an görseller eski WordPress sitesinden çekiliyor ve eski site kapanınca kırılacaklar.
- [ ] Görseller yerelleşince `.htaccess` içindeki `wp-content` kuralı açıldı.
- [ ] Gilroy web lisansı alındı ve `src/app/fonts.ts` Gilroy'a çevrildi (şu an geçici olarak Plus Jakarta Sans kullanılıyor).
- [ ] `site.json` içindeki Sheet kimlikleri girildi.
- [ ] Metinler (özellikle sağlık iddiaları ve SSS yanıtları) hukuk/tıbbi incelemeden geçti.
- [ ] Ölçümleme (GTM) eklendi. Klinik butonlarında `data-event="Clinic_Phone_Click"` / `"Clinic_Click"` ve `data-clinic-*` nitelikleri hazır.

## Blog

`src/content/posts/` altına `yazi-adresi.md` dosyası eklenir; dosya adı URL olur (`/blog/yazi-adresi/`). Örnek için `ornek-yazi.md` dosyasına bakın. `draft: true` olan yazılar yalnızca `npm run dev` ile görünür. İlk yazı yayınlanınca menüde Blog bağlantısı kendiliğinden belirir.
