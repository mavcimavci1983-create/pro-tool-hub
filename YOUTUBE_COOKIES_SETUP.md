# YouTube cookies ile indiriciyi açma

YouTube bazen bot gibi gördüğü istekleri engeller. Tarayıcıdan export ettiğin çerezleri projeye verirsen, sunucu aynı oturumla istek atar ve "Could not load formats" hatası büyük oranda azalır.

---

## 1. Tarayıcıda YouTube’a giriş yap

- Chrome/Edge’de **youtube.com** adresine git, gerekirse Google hesabınla **giriş yap**.
- Birkaç video izle veya sayfada dolaş ki gerekli cookie’ler (VISITOR_INFO, LOGIN_INFO vb.) setlensin.

---

## 2. Çerezleri JSON olarak dışa aktar

### EditThisCookie (Chrome / Edge)

1. [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeediginlielkbhoned) eklentisini kur.
2. **youtube.com** sayfasındayken eklenti ikonuna tıkla.
3. **Export** (veya "Export as JSON" / "Export cookies") seç.
4. İndirilen veya panoya kopyalanan JSON’u bir metin dosyasına yapıştır.

EditThisCookie bazen şu formatta verir (her çerez bir nesne):

```json
[
  {
    "domain": ".youtube.com",
    "expirationDate": 1234567890,
    "hostOnly": false,
    "httpOnly": false,
    "name": "VISITOR_INFO1_LIVE",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "value": "abc123..."
  }
]
```

`expirationDate` bazen saniye cinsinden sayı, bazen tarih string’i olabilir; ikisi de desteklenir.

### Alternatif: Get cookies.txt / Cookie-Editor

- **Get cookies.txt** veya **Cookie-Editor** gibi eklentiler “JSON export” veriyorsa, çıkan formatı **tek bir JSON array** olacak şekilde kaydet (yukarıdaki gibi `[{ ... }, { ... }]`).
- Eğer sadece `name=value; name2=value2` formatında veriyorsa, bu projedeki cookie loader doğrudan JSON array beklediği için önce bir JSON array’e çevirmen gerekir; en kolay yol EditThisCookie ile “Export as JSON” kullanmak.

---

## 3. Dosyayı proje köküne kaydet

1. Proje kök dizinini aç (örn. `C:\Users\...\Desktop\ProTollHub`).
2. Export ettiğin JSON’u **`youtube-cookies.json`** adıyla kaydet; tam yol şöyle olsun:
   - `ProTollHub/youtube-cookies.json`
3. **Bu dosyayı Git’e ekleme** (güvenlik). Projede zaten `.gitignore` içinde `youtube-cookies.json` var; ekstra bir şey yapmana gerek yok.

Örnek içerik (gerçek değerleri kendi çerezlerinle değiştir):

```json
[
  {
    "name": "VISITOR_INFO1_LIVE",
    "value": "gercek_deger_buraya",
    "domain": ".youtube.com",
    "path": "/",
    "secure": true,
    "httpOnly": false,
    "sameSite": "lax"
  },
  {
    "name": "LOGIN_INFO",
    "value": "gercek_deger_buraya",
    "domain": ".youtube.com",
    "path": "/",
    "secure": true,
    "httpOnly": true,
    "sameSite": "lax"
  }
]
```

---

## 4. Ortam değişkeni ile dosyayı tanıt

Sunucunun bu dosyayı okuması için **YOUTUBE_COOKIES_FILE** tanımlanmalı.

### A) Geliştirme (PowerShell – tek seferlik)

Sunucuyu başlatmadan önce:

```powershell
cd "C:\Users\Mehmet AVCI\Desktop\ProTollHub"
$env:YOUTUBE_COOKIES_FILE = "youtube-cookies.json"
npm run dev
```

### B) Geliştirme – kalıcı (`.env`)

Proje zaten `dotenv` kullanıyor; sunucu başlarken kök dizindeki `.env` otomatik okunur.

1. Proje kökünde **`.env`** dosyası oluştur (yoksa). Örnek için `.env.example` dosyasına bakabilirsin.
2. İçine şunu yaz:

```env
YOUTUBE_COOKIES_FILE=youtube-cookies.json
```

3. `npm run dev` ile sunucuyu başlat. Cookie’ler dosyadan yüklendiğinde terminalde tek seferlik şu log görünür: `[ytdl] Loaded N cookies from YOUTUBE_COOKIES_FILE`

### C) Production (Replit / sunucu)

- Replit: **Secrets** kısmına ekle:
  - Key: `YOUTUBE_COOKIES_FILE`
  - Value: `youtube-cookies.json`
- Kendi sunucunda: process’i başlatan yerde (systemd, PM2, script) aynı değişkeni ver:
  - `YOUTUBE_COOKIES_FILE=youtube-cookies.json`

---

## 5. Çalıştığını kontrol et

1. Sunucuyu başlat: `npm run dev`
2. Tarayıcıda **http://localhost:5001** → YouTube Video Downloader.
3. Bir YouTube linki yapıştırıp **“Get quality options”** (veya “Kalite seçeneklerini getir”) tıkla.
4. Format listesi geliyorsa cookie’ler yüklendi ve `loadYouTubeCookies()` bu dosyayı okuyup `ytdl.createAgent(cookies)` ile kullanıyor demektir. İlk YouTube isteğinde terminalde `[ytdl] Loaded N cookies from YOUTUBE_COOKIES_FILE` mesajını görürsen dosya başarıyla okunmuştur.

Hata alırsan terminalde şunlara bak:

- `[ytdl] YOUTUBE_COOKIES_FILE read failed` → Dosya yolu veya adı yanlış; `YOUTUBE_COOKIES_FILE` doğru mu kontrol et.
- `[ytdl] YOUTUBE_COOKIES parse failed` → JSON geçersiz; dosyayı bir JSON validator ile kontrol et.
- `[ytdl-core] getYouTubeFormats error` → YouTube hâlâ engelliyor olabilir; cookie’leri yeniden export edip güncelle, bir süre sonra tekrar dene.

---

## Özet

| Adım | Ne yapacaksın |
|------|----------------|
| 1 | youtube.com’da giriş yap, sayfada dolaş |
| 2 | EditThisCookie ile “Export as JSON” al |
| 3 | İçeriği **`youtube-cookies.json`** olarak proje köküne kaydet |
| 4 | `YOUTUBE_COOKIES_FILE=youtube-cookies.json` ortam değişkenini ver (veya `.env` + dotenv) |
| 5 | `npm run dev` ile sunucuyu başlatıp YouTube indiriciyi dene |

Bu dosya eklendiğinde ve env set edildiğinde, `loadYouTubeCookies()` bu veriyi okuyup `ytdl.createAgent(cookies)` ile kimlik doğrulamasında kullanır; başka bir kod değişikliği gerekmez.
