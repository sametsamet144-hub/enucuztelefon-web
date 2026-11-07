# EnUcuzTelefon Web (`enucuztelefon-web`)

Türkiye'nin en kapsamlı akıllı telefon fiyat karşılaştırma, teknik özellik inceleme ve canlı mağaza teklif web uygulaması.

## 🚀 Teknolojiler
- **Framework**: Next.js 16 (App Router & Turbopack)
- **UI & Stil**: Tailwind CSS v4, Lucide React, Radix UI
- **Grafikler & İstatistik**: Recharts
- **Dil**: TypeScript 5
- **Paket Yöneticisi**: PNPM

## 🛠️ Yerel Geliştirme (Local Development)

```bash
# Bağımlılıkları yükleyin
pnpm install

# Geliştirme sunucusunu başlatın
pnpm dev
```
Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📦 Üretim Derlemesi (Production Build)

```bash
pnpm build
pnpm start
```

## 🌐 Ortam Değişkenleri (.env.local)

```env
# Backend REST API adresi
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## ☁️ Canlıya Alma (Deploy)
- **Render / Railway / Vercel**: Repoyu bağlayın, derleme komutu `pnpm install && pnpm build`, başlatma komutu `pnpm start` olarak ayarlandığında otomatik olarak ayağa kalkar.
