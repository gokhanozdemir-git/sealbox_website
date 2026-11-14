# Sealbox web sitesi

Tanıtım + dokümantasyon sitesi. Derleme gerektirmez: `index.html` dosyasını tarayıcıda açın.

Site iki dilli: ana dil İngilizce, Türkçe sürüm `tr/` klasöründe. Menüdeki **EN / TR** düğmesi
iki sürüm arasında geçer ve sayfadaki yeri (`#bölüm`) korur. Bölüm adları (`#nasil`, `#ekip`…)
iki dilde aynıdır; yeni bölüm eklerken ikisine de aynı `id` verin.

| Sayfa | İçerik |
|---|---|
| `index.html` · `tr/index.html` | Tanıtım: video arka planlı hero, kurulum (PyPI · Marketplace · Open VSX · GitHub), sorun, nasıl çalışır, özellikler, ekip, GitHub güvenliği, kurtarma, VS Code, karşılaştırma |
| `learn.html` · `tr/learn.html` | Öğren: adım adım rehberler ve kavramlar |
| `docs.html` · `tr/docs.html` | Dokümantasyon: tüm komutlar (history ve hook dahil), ayarlar, güvenlik modeli |
| `assets/` | `style.css`, `main.js`, `hero.mp4`, `flow.jpeg` (iki dil ortak kullanır) |

`main.js`, sayfanın `<html lang>` değerine bakıp kopyala düğmesini ve hero'daki yazılan terminali o dilde gösterir.

Yerelde sunucuyla açmak için: `python -m http.server 8000` → http://localhost:8000

Hero videosu Chrome, Edge ve Firefox'ta oynar. VS Code'un içindeki önizleme (Simple Browser / Live Preview)
MP4 (H.264) oynatamaz; siteyi gerçek bir tarayıcıda açın.

Yayınlamak için klasörü olduğu gibi GitHub Pages, Netlify ya da Vercel'e yükleyin.

Bağlantılar (gerekirse güncelleyin, tüm HTML dosyalarında geçer):
- VS Code Marketplace: `https://marketplace.visualstudio.com/items?itemName=gokhanozdemir.sealbox`
- GitHub: `https://github.com/gokhanozdemir-git/SealBox`
- PyPI: `https://pypi.org/project/sealbox/`
- Open VSX: `https://open-vsx.org/extension/gokhanozdemir/sealbox`
