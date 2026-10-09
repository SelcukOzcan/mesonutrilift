# Sürüm geçmişi

## v2.1.0 — 2026-10-06

PSD'deki varlıklar ve canlı klinik Sheet'i siteye bağlandı; footer yenilendi.

- Klinik listesi Google Sheet'ten canlı okunuyor ("Web'de yayınla" bağlantısı; normal Sheet bağlantısı da desteklenir)
- `İstanbul_Avrupa` / `İstanbul_Anadolu` tek İstanbul sayfasında toplanıyor, kartta yaka bilgisi gösteriliyor
- Logo PSD'deki vektör kaynaktan SVG'ye çevrildi (her ekranda keskin; koyu zemin için beyaz sürüm)
- Hero görseli PSD'deki orijinalinden yeniden kırpıldı (yüz ortada); ürün kutusu, SSS portresi ve sosyal medya paylaşım görseli (og.jpg) eklendi
- Görseller cihaza göre boyutlanıyor: WebP varyantları + srcset (`npm run images`); telefonda hero ~11–26 KB
- Footer: dev soluk marka yazısı kaldırıldı; arka planda Somon DNA'ya gönderme yapan dönen çift sarmal (masaüstünde çapraz, mobilde dikey; cam kartın arkasından bulanık geçer), şehirlere göre klinik bağlantıları, cam efektli klinik çağrısı, sayfa kaydırıldıkça dolan "başa dön" halkası
- Mobilde alttaki "Klinik bul" çubuğu footer görününce çekiliyor

## v2.0.0 — 2026-10-02

Aynı bilgi akışı korunarak arayüz modernize edildi. Animasyonlar CSS ile yapıldı; anasayfa JavaScript boyutu v1 ile aynı (~187 KB gzip).

- Hero: hareketli renk geçişli arka plan, kemer formunda görsel, dönen rozet, süzülen içerik etiketleri, imleç paralaksı, sayaçlar (klinik / il / ülke)
- Hero altında kayan güven şeridi
- 3'lü etki: masaüstünde üzerine gelince genişleyen paneller, mobilde kaydırmalı kartlar
- MesoNutrilift nedir: bento ızgara, imleci takip eden ışık efekti
- Uygulama bölgeleri: yüz görselinde dokunulabilir noktalar
- Uygulama süreci: ekrana sabitlenen başlık, kaydırdıkça dolan zaman çizelgesi
- Öncesi/sonrası: sürüklenebilir karşılaştırma slider'ı ve vaka seçici
- TV yayınları: öne çıkan video + oynatma listesi (sayfa içinde oynatma)
- SSS: yumuşak açılan akordiyon
- Klinik bulucu: yazdıkça il, ilçe ve klinik öneren canlı arama
- Header: kaydırınca belirginleşen arka plan ve sayfa ilerleme çubuğu
- Kaydırınca beliren bölümler; hareket azaltma tercihine tam uyum
- İç sayfalar aynı dile taşındı: hareketli başlık alanı + sayaçlar (klinikler, şehir sayfaları, TV yayınları, blog), cam efektli filtre kartı
- Klinik kartları: isimden üretilen monogram, kurum türü etiketi (Hastane / Klinik / Hekim — Sheet'e "Tür" sütunu eklenirse oradan okunur)
- Mobil menü: tam ekran, sırayla beliren bağlantılar, "Klinik bul" ve telefon butonları
- Footer: marka cümlesi + klinik çağrısı, büyük silik marka yazısı; 404 sayfası yenilendi

## v1.0.0 — 2026-10-02

İlk sürüm: WordPress sitesinin Next.js'e taşınmış, aynı bilgi akışını koruyan hali.

- Statik çıktı (cPanel'e yüklenecek `out/` klasörü), `.htaccess` ile eski WordPress adreslerinin yönlendirilmesi
- Anasayfa: hero, 3'lü etki, MesoNutrilift nedir, endikasyonlar, uygulama süreci, öncesi/sonrası, TV yayınları, SSS, klinik CTA'sı
- Klinikler: Google Sheet'ten canlı veri, il/ilçe filtresi, Türkçe karakter duyarsız arama, sayfalama, URL'de filtre (reklam parametreleri korunur), 18 şehir sayfası
- Video kütüphanesi: Google Sheet'e yalnızca YouTube linki ekleyerek çalışır; başlık ve kapak otomatik gelir
- Blog altyapısı (Markdown), schema.org yapılandırılmış verileri, sitemap, robots.txt, llms.txt
- Geçici: görseller eski siteden, font Plus Jakarta Sans (Gilroy bekleniyor)
