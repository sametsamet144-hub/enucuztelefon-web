import type { QAItem } from "@/types";

export const qaItems: QAItem[] = [
  {
    id: "1",
    slug: "hangi-telefon-daha-iyi-iphone-mi-samsung-mi",
    question: "iPhone mi Samsung mi daha iyi?",
    answer:
      "İkisi de birbirinden farklı güçlü yönlere sahip. iPhone, yazılım optimizasyonu, güvenlik ve uzun vadeli güncelleme desteği konusunda öne çıkar. Samsung ise donanım çeşitliliği, özelleştirme ve fiyat/performans seçenekleri ile öne çıkar. Kullanım alışkanlıklarınıza göre tercih yapmalısınız.",
    category: "Satın Alma Soruları",
    tags: ["iphone", "samsung", "karşılaştırma"],
    relatedPhones: ["apple-iphone-16-pro-max", "samsung-galaxy-s25-ultra"],
    relatedGuides: ["iphone-16-pro-max-inceleme"],
    helpful: 342,
    publishedAt: "2025-01-15",
  },
  {
    id: "2",
    slug: "telefonum-neden-bu-kadar-hizli-siniyor",
    question: "Telefonum neden bu kadar hızlı şarjı bitiyor?",
    answer:
      "Batarya tüketimini artıran birçok faktör olabilir: ekran parlaklığı, arka planda çalışan uygulamalar, konum servisleri, zayıf ağ sinyali veya eski batarya. Ayarlar > Batarya bölümünden hangi uygulamanın en çok pil tükettiğini görebilirsiniz.",
    category: "Batarya Sorunları",
    tags: ["batarya", "pil", "tüketim"],
    relatedPhones: [],
    relatedGuides: ["batarya-omrunu-uzatma-ipuclari"],
    helpful: 215,
    publishedAt: "2025-02-10",
  },
  {
    id: "3",
    slug: "5g-telefon-almali-miyim",
    question: "5G telefon almalı mıyım?",
    answer:
      "Türkiye'de 5G altyapısı henüz tam kapsamlı değil, ancak hızla genişliyor. Uzun vadeli kullanım için 5G destekli telefon almanızı öneririz. Fiyat farkı giderek azaldığından 5G'li model almak mantıklı bir yatırım olacaktır.",
    category: "Satın Alma Soruları",
    tags: ["5g", "ağ", "satın-alma"],
    relatedPhones: ["samsung-galaxy-s25-ultra", "apple-iphone-16-pro-max"],
    relatedGuides: ["telefon-satın-alma-rehberi"],
    helpful: 189,
    publishedAt: "2025-03-05",
  },
  {
    id: "4",
    slug: "telefonum-internete-baglaniyor-ama-cekmiyor",
    question: "Telefonum Wi-Fi'ye bağlanıyor ama internet çekmiyor, neden?",
    answer:
      "Bu sorun genellikle DNS ayarları veya modem/router kaynaklıdır. Şu adımları deneyin: 1) Telefonu uçak moduna alıp tekrar açın. 2) Wi-Fi ağını unutup yeniden bağlanın. 3) Router'ı yeniden başlatın. 4) DNS ayarlarını 8.8.8.8 olarak değiştirin.",
    category: "Bağlantı Sorunları",
    tags: ["wifi", "internet", "bağlantı"],
    relatedPhones: [],
    relatedGuides: [],
    helpful: 423,
    publishedAt: "2025-01-28",
  },
  {
    id: "5",
    slug: "kamera-neden-bulanik-cekiyor",
    question: "Telefonum kamera neden bulanık çekiyor?",
    answer:
      "Bulanık fotoğraf birçok nedenden kaynaklanabilir: lens kirliliği, el titremesi, düşük ışık koşulları veya yazılım sorunu. Önce lensi temizleyin, OIS/EIS seçeneklerinin açık olduğunu kontrol edin, kamera uygulamasını kapatıp açın.",
    category: "Kamera Sorunları",
    tags: ["kamera", "fotoğraf", "bulanık"],
    relatedPhones: [],
    relatedGuides: [],
    helpful: 156,
    publishedAt: "2025-04-12",
  },
  {
    id: "6",
    slug: "ekran-neden-dokunmaya-yanit-vermiyor",
    question: "Telefon ekranım dokunuşa yanıt vermyor, ne yapmalıyım?",
    answer:
      "Ekran yanıt vermiyorsa: 1) Telefonu yeniden başlatın. 2) Ekranda nem veya kir olup olmadığını kontrol edin. 3) Ekran koruyucunuzu çıkarıp deneyin. 4) Ayarlar > Erişilebilirlik'ten dokunma hassasiyetini kontrol edin.",
    category: "Ekran Sorunları",
    tags: ["ekran", "dokunmatik", "yanıt"],
    relatedPhones: [],
    relatedGuides: [],
    helpful: 98,
    publishedAt: "2025-05-20",
  },
];

export const getQABySlug = (slug: string): QAItem | undefined =>
  qaItems.find((q) => q.slug === slug);

export const getQAByCategory = (category: string): QAItem[] =>
  qaItems.filter((q) => q.category === category);
