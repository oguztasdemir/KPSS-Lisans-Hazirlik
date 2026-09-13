
# 🎯 KPSS Lisans GY-GK Hazırlık & Çıkmış Sorular Platformu

[![Live Demo](<https://img.shields.io/badge/Demo-Canl%C4%B1%20Uygulama-brightgreen?style=for-the-badge&logo=vercel>)](https://kpss-lisans-hazirlik-app.vercel.app)
[![JavaScript](<https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black>)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](<https://img.shields.io/badge/HTML5-Modern%20Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white>)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](<https://img.shields.io/badge/CSS3-Custom%20Design%20System-1572B6?style=for-the-badge&logo=css3&logoColor=white>)](https://developer.mozilla.org/en-US/docs/Web/CSS)

Modern, hızlı, interaktif ve **tam teşekküllü dijital KPSS Lisans Hazırlık Platformu**. ÖSYM formatında 16 yıllık (2009–2025) 1.920 özgün soru havuzu, 130 dakikalık resmi sınav simülatörü, akıllı hata defteri ve hafıza teknikleriyle zenginleştirilmiş konu anlatım kütüphanesini tek bir çatı altında sunar.

---

## 🌐 Canlı Uygulama

🔗 **[https://kpss-lisans-hazirlik-app.vercel.app](https://kpss-lisans-hazirlik-app.vercel.app)**

---

## ✨ Öne Çıkan Özellikler

### 1. ⏱️ 130 Dakika Gerçek Sınav Simülatörü (`#simulator`)

* **ÖSYM Sınav Formatı:** 120 soru, 130 dakika resmi geri sayım sayacı.
* **Optik Cevap Formu:** Sağ tarafta yapışkan (sticky) 1–120 soru durumunu (dolu/boş) gösteren optik navigatör.
* **Gizli Çözüm Disiplini:** Sınav süresince cevaplar gizlidir; sınav tamamlandığında **Resmi Sınav Karnesi & KPSS P3 Tahmini Puanı** hesaplanır.

### 2. 📝 16 Yıllık (1.920 Soru) Tekrarsız Çıkmış Soru Seti

* 2009 – 2025 yılları arasındaki tüm lisans sınavları.
* **%100 Doğrulanmış Tipografi:** Tüm ÖSYM olumsuz kökleri (`değildir`, `söylenemez` vb.) ve altı çizili sözcükler `<u>` formatında vurgulanmıştır.
* **Temiz Matematik Formülleri:** LaTeX karmaşasından arındırılmış, okunaklı Unicode matematik gösterimi (`²`, `√`, `π`, `·`, `±`).
* **Sıfır Tekrar:** Her test ve her yıl için %100 bağımsız soru akışı.

### 3. 📖 İnteraktif Dershane & Konu Anlatımı (`#lectures`)

* **Yan Yana İki Panelli Arayüz:** Soldan ders seçimi ve canlı ilerleme takibi, sağdan konu listesi ve anlık filtreleme.
* **⚠️ ÖSYM Tuzakları:** Sınavda en çok düşülen çeldiricileri gösteren özel uyarı kutuları.
* **⭐ Altın Kurallar:** 10 saniyede soru çözdüren pratik taktikler.
* **🧠 Akrostiş & Hafıza Şifreleri (Mnemonics):** *TALİM, ABCD, KAYIP SAKAL, SOMBAHÇEMİ, BMW (0-3-4)* kodlamaları.
* **💡 Çözümlü Pekiştirme Soruları:** Formüllerin altında açılır-kapanır adım adım çözümlü örnek sorular.
* **✅ Konu İlerleme & Çalışıldı Takibi:** Konuları tamamladıkça kaydedilen ve sol panelde ders tamamlama yüzdesini gösteren takip sistemi.

### 4. ❌ Akıllı Hata Defteri & 📄 PDF Raporlama

* Yanlış yapılan sorular otomatik olarak Hata Defteri havuzunda toplanır.
* Doğru çözüldükçe otomatik temizleme.
* **🖨️ A4 PDF / Yazdırma:** Tüm yanlış soruları ve çözümleri tek tıkla A4 formatında PDF olarak kaydetme ve yazdırma desteği.

### 5. 🍅 Entegre KPSS Pomodoro Sayacı

* Ekranın sağ altında yüzen (floating), arka planda çalışan ve sesli uyarı veren odaklanma zamanlayıcısı:
  * 25 Dk Odak + 5 Dk Mola
  * 50 Dk Blok Çalışma

### 6. 🧮 KPSS P3 Puan Hesaplama Motoru

* ÖSYM standart sapma katsayılarına göre Genel Yetenek ve Genel Kültür netlerinden anlık P3 puanı hesaplama.

---

## 📁 Proje Dizin Yapısı

```text
KPSS-Lisans-Hazirlik/
├── Dataset/
│   ├── Sinav_Sorulari/        # 16 Yıl (2009-2025) 1.920 Soru JSON'ları
│   ├── Konu_Anlatimi/         # 6 Branş Konu Anlatım Veri Setleri
│   ├── Bilgi_Kartlari/        # Branş Bazlı Flashcard JSON'ları
│   ├── Mufredat/              # Müfredat & Ders Dağılım Metadata'ları
│   └── Orijinal_PDFler/       # Kaynak ÖSYM PDF Arşivi
├── src/
│   ├── css/
│   │   ├── main.css           # Tasarım Sistemi & CSS Değişkenleri
│   │   ├── sidebar.css        # Sol Menü Tasarımı
│   │   ├── header.css         # Üst Başlık & Arama Stilleri
│   │   ├── quiz.css           # Soru Çözüm & Optik Form Stilleri
│   │   └── views.css          # Modül Görünümleri & @media print
│   ├── js/
│   │   ├── core/
│   │   │   └── router.js      # Hash Tabanlı SPA Router Engine
│   │   ├── panels/
│   │   │   ├── headerPanel.js # Geri Sayım, Tema, PDF Rapor Modalı
│   │   │   ├── sidebarPanel.js# Çekmece Menü Yönetimi
│   │   │   ├── searchModal.js # Global Soru Arama (Ctrl+K)
│   │   │   └── pomodoroPanel.js# Pomodoro Sayacı
│   │   ├── views/             # Sayfa Görünüm Modülleri
│   │   ├── data/              # Konu Anlatım Kütüphanesi
│   │   ├── quizController.js  # Soru Çözüm Motoru
│   │   ├── store.js           # LocalStorage & Durum Yönetimi
│   │   └── app.js             # Ana Başlatıcı
│   └── utils/
│       ├── countdown.js       # Sınav Geri Sayım Sayacı
│       └── sound.js           # Web Audio API Ses Efektleri
├── index.html                 # Ana Giriş Sayfası
├── vercel.json                # Vercel Dağıtım Konfigürasyonu
└── README.md                  # Proje Dokümantasyonu
```

---

## 🚀 Yerel Kurulum & Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için herhangi bir ek paket kurulumuna gerek yoktur. Saf HTML, CSS ve Modern JavaScript (ES Modules) kullanılmıştır.

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/oguztasdemir/KPSS-Lisans-Hazirlik.git
cd KPSS-Lisans-Hazirlik
```

### 2. Yerel Sunucuyu Başlatın

Modern ES modüllerinin çalışabilmesi için basit bir yerel HTTP sunucusu yeterlidir:

**Python ile:**

```bash
python -m http.server 3000
```

**Node.js / npx ile:**

```bash
npx serve .
```

Tarayıcınızda açın: `http://localhost:3000`

---

## 🛠️ Kullanılan Teknolojiler

* **Frontend:** Vanilla HTML5, Modern CSS3 (CSS Variables, Flexbox, CSS Grid), Vanilla JavaScript (ES6+ Modules)
* **Ses & Efektler:** Web Audio API (Harici ses dosyası bağımlılığı olmadan sentezlenen ses efektleri)
* **Veri Depolama:** Tarayıcı `localStorage` (JSON İçe/Dışa Aktarma Desteği)
* **Yazdırma Desteği:** CSS `@media print` A4 Formatı Optimizasyonu
* **Dağıtım (Deployment):** [Vercel](https://vercel.com)

---

## 📄 Lisans

Bu proje eğitim ve KPSS sınavına hazırlık amaçlı geliştirilmiştir. Tüm hakları saklıdır.

---

## ⚖️ Yasal Uyarı & Telif Hakkı Bildirimi (Disclaimer)

> **Önemli Bilgilendirme:** Bu proje ve kaynak kodları **tamamen kişisel eğitim, bireysel sınava hazırlık, algoritmik analiz ve açık kaynak yazılım geliştirme** amacıyla hazırlanmıştır. 
> - Proje içerisinde yer alan hiçbir içerik, soru veya materyal **kesinlikle ticari bir amaç taşımamakta**, herhangi bir gelir, ücret veya ticari kazanç unsuru barındırmamaktadır.
> - Sınav formatları, soru kökleri ve ilgili tüm fikri haklar **ÖSYM (Ölçme, Seçme ve Yerleştirme Merkezi)** ve ilgili resmi kurumlara aittir. 
> - Bu yazılım projesi, yalnızca adayların kişisel çalışma performanslarını ölçme, zayıf oldukları konuları analiz etme ve bireysel eğitim süreçlerini kolaylaştırmaya yönelik açık kaynaklı bir araçtır.
