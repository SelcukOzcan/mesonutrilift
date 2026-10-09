# MesoNutrilift Web

Next.js 16 (App Router) + Tailwind CSS 4 ile geliştirilen, **statik çıktı** üreten site. Build sonrası oluşan `out/` klasörü standart cPanel hostinge yüklenir; sunucuda Node.js gerekmez.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm install` | Bağımlılıkları kurar (ilk seferde) |
| `npm run dev` | Geliştirme sunucusu → http://localhost:3000 |
| `npm run build` | Yayın paketini `out/` klasörüne üretir |
| `npm run images` | `assets/images/` altındaki kaynak görsellerden WebP boyut varyantlarını üretir |
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
    media.json         Görsel adresleri ve alternatif metinleri
    images.json        Görsel boyut listesi (`npm run images` yazar, elle düzenlenmez)
    posts/*.md         Blog yazıları
  data/                Sheet'e ulaşılamazsa kullanılan yedek veriler
  lib/                 Veri katmanı (Sheet okuma, klinik/video modelleri, schema.org)
assets/images/        Görsellerin kaynak (yüksek çözünürlüklü) halleri
public/images/         Sitede kullanılan WebP varyantları, logo (SVG) ve paylaşım görseli (og.jpg)
scripts/images.mjs     Görsel hazırlama betiği
sheet-sablonlari/      Google Sheet'e içe aktarılacak hazır CSV'ler (isteğe bağlı ek sütunlarla)
public/.htaccess       cPanel ayarları (yönlendirmeler, önbellek, güvenlik başlıkları)
```

İçerik yalnızca `src/content/` altında durur ve bileşenler ona `src/lib/content.ts` üzerinden erişir. İleride ajans CMS'ine geçildiğinde yalnızca bu dosyanın veri kaynağı değişir.

## Google Sheet bağlantısı (klinikler ve videolar)

**Klinikler bağlı.** `src/content/site.json` → `sheets.clinics.url` alanında Sheet'in "Web'de yayınla" bağlantısı duruyor.

Yeni bir sekme bağlamak için (ör. **Videolar**):

1. Sekmeyi oluşturun ve `sheet-sablonlari/videolar.csv` dosyasını içe aktarın: *Dosya → İçe aktar → Yükle → "Mevcut sayfayı değiştir"*.
2. *Dosya → Paylaş → Web'de yayınla* → sekmeyi seçin → **Yayınla**. Çıkan bağlantıyı kopyalayın.
3. Bağlantıyı `site.json` içinde ilgili `url` alanına yapıştırın (ör. `sheets.videos.url`), build alıp yükleyin.

Tarayıcının adres çubuğundaki normal Sheet bağlantısı da (`…/d/KIMLIK/edit#gid=…`) kullanılabilir. Bu durumda Sheet *Paylaş → "Bağlantıya sahip olan herkes" → Görüntüleyen* olmalıdır.

Bundan sonra **Sheet'te yapılan değişiklikler sitede yeni build gerekmeden görünür**. Google yayınlanan sayfaları birkaç dakika önbellekte tuttuğu için değişikliğin yansıması ~5 dakika sürebilir. Ziyaretçi sayfayı açtığında güncel veri Sheet'ten çekilir, yeni build gerekmez. Build sırasında okunan veri de HTML'e gömülür; böylece sayfa anında açılır, arama motorları ve yapay zeka botları listeyi görür. Sheet'e ulaşılamazsa gömülü veri gösterilir, ziyaretçi hiçbir zaman boş liste görmez.

**Klinikler sütunları:** Mevcut Sheet'teki `Klinik / Doktor / Hastane` · `İl` · `İlçe` · `Adres` · `Tel` · `Web` sütunları okunuyor. Başlıklar büyük/küçük harf ve Türkçe karakter farkına duyarsızdır.
- İsteğe bağlı sütunlar eklenebilir: `Instagram` · `WhatsApp` · `Öne Çıkan` · `Aktif` · `Tür` · `Yaka`. `Aktif` = "Hayır" yazılırsa klinik gizlenir; `Öne Çıkan` = "Evet" yazılırsa listenin başına gelir. Diğer klinikler Sheet'teki sırayla listelenir.
- `İstanbul_Avrupa` / `İstanbul_Anadolu` yazımı desteklenir: klinik İstanbul sayfasında listelenir, kartta "Avrupa Yakası" / "Anadolu Yakası" yazar.
- Telefon her biçimde yazılabilir (`2124252393`, `0212 425 23 93`…); site `0212 425 23 93` biçimine çevirir. Web sütununa Instagram adresi yazılırsa Instagram butonu olarak gösterilir.

**Videolar sütunları:** `Video Linki` · `Başlık` · `Doktor` · `Kanal` · `Tarih` · `Öne Çıkan` · `Aktif`
- Yalnızca **YouTube linki zorunlu**. `Başlık` boş bırakılırsa YouTube'daki başlık otomatik gelir, kapak görseli videodan alınır.
- `Kanal` doldurulursa TV yayınları sayfasında kanal filtresi oluşur. `Tarih` (gg.aa.yyyy) Google video zengin sonuçları için gereklidir.

**Şehir sayfaları** (`/klinikler/istanbul/` gibi) build sırasında Sheet'teki illerden üretilir. Yeni bir il eklendiğinde klinik ana listede hemen görünür; o ilin ayrı sayfası bir sonraki build'de oluşur.

## Görseller

Kaynak dosyalar `assets/images/` altında durur. `npm run images` her görsel için birkaç genişlikte WebP üretir (`public/images/hero-480.webp`, `hero-640.webp`…). Site her cihaza ekranına uygun boyutu indirir; telefonda hero görseli ~11–26 KB'tır.

Yeni ya da değişen görsel için:

1. Dosyayı `assets/images/` altına koyun ve `scripts/images.mjs` içindeki listeye ekleyin.
2. `npm run images` çalıştırın.
3. `src/content/media.json` içinde `src` olarak `/images/<ad>.webp` yazın.

Logo vektördür (`public/images/logo.svg`, koyu zeminler için `logo-white.svg`). Sosyal medya paylaşım görseli `public/images/og.jpg` (1200×630) dosyasıdır.

## cPanel'e yayın

1. `npm run build`
2. `out/` klasörünün **içindekileri** (gizli `.htaccess` dosyası dahil) cPanel → Dosya Yöneticisi → `public_html` içine yükleyin. Önce zip'leyip yükleyip sunucuda açmak daha hızlıdır.
3. İçerik veya blog değiştiğinde 1–2. adımları tekrarlayın. Klinik ve video değişiklikleri için bu gerekmez.

## Yayın öncesi kontrol listesi

- [x] Logo, hero, ürün, SSS ve paylaşım görselleri PSD'den hazırlanıp yerelleştirildi.
- [ ] Kalan görseller yerelleştirildi: 3'lü etki (3), uygulama bölgeleri portresi, öncesi/sonrası (7), Erdağı logosu, favicon. `media.json`'da adresi `https://mesonutrilift.com/wp-content/…` olanlar hâlâ eski siteden geliyor ve eski site kapanınca kırılır.
- [ ] Görseller yerelleşince `.htaccess` içindeki `wp-content` kuralı açıldı.
- [ ] Gilroy web lisansı alındı ve `src/app/fonts.ts` Gilroy'a çevrildi (şu an geçici olarak Plus Jakarta Sans kullanılıyor).
- [x] Klinik Sheet'i bağlandı.
- [ ] Video Sheet'i bağlandı (şu an yedek listedeki 5 video gösteriliyor).
- [ ] Metinler (özellikle sağlık iddiaları ve SSS yanıtları) hukuk/tıbbi incelemeden geçti.
- [ ] Ölçümleme (GTM) eklendi. Klinik butonlarında `data-event="Clinic_Phone_Click"` / `"Clinic_Click"` ve `data-clinic-*` nitelikleri hazır.

## Blog

`src/content/posts/` altına `yazi-adresi.md` dosyası eklenir; dosya adı URL olur (`/blog/yazi-adresi/`). Örnek için `ornek-yazi.md` dosyasına bakın. `draft: true` olan yazılar yalnızca `npm run dev` ile görünür. İlk yazı yayınlanınca menüde Blog bağlantısı kendiliğinden belirir.
