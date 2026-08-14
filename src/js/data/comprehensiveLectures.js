/**
 * KPSS Lisans GY-GK - Kapsamlı Ders & Konu Anlatım Kütüphanesi
 * ÖSYM Sınav Tuzakları, Altın Kurallar, Hafıza Şifreleri (Mnemonics) ve Çözümlü Pekiştirme Soruları ile donatılmıştır.
 */

export const COMPREHENSIVE_LECTURES = {
  matematik: {
    title: 'Matematik & Geometri',
    icon: '📐',
    color: '#8b5cf6',
    questionCount: '30 Soru',
    topics: [
      {
        id: 'mat_temel_kavramlar',
        name: '1. Temel Kavramlar & Sayı Kümeleri',
        badge: '3-4 Soru',
        relatedExamTopic: 'Temel Kavramlar & Sayı Kümeleri',
        html: `
          <div class="lecture-unit-body">
            <div class="alert-box tip">
              <strong>🎯 Sınav Analizi:</strong> KPSS Lisans sınavında her yıl ilk 3-4 soru temel kavramlar, basamak analizi ve faktöriyel konusundan gelir.
            </div>

            <div class="osym-trap-box">
              <div class="osym-trap-title">⚠️ ÖSYM Tuzağı: Sayı Kümeleri Ayrımı</div>
              <div class="osym-trap-desc">
                Soru kökündeki <em>"a ve b birbirinden farklı doğal sayılardır"</em> ifadesine çok dikkat edin! <strong>0 bir doğal sayıdır</strong> fakat sayma sayısı veya pozitif tam sayı değildir. 0'ı unutmak soruyu kaybettirir.
              </div>
            </div>

            <h3>📌 1. Sayı Kümeleri</h3>
            <p>
              • <strong>Rakamlar:</strong> {0, 1, 2, 3, 4, 5, 6, 7, 8, 9} (Toplam 10 adettir).<br>
              • <strong>Doğal Sayılar (N):</strong> {0, 1, 2, 3, ...}<br>
              • <strong>Sayma Sayıları (N⁺):</strong> {1, 2, 3, ...}<br>
              • <strong>Tam Sayılar (Z):</strong> {..., -3, -2, -1, 0, 1, 2, 3, ...} <em>(0 ne pozitif ne de negatiftir; nötrdür).</em><br>
              • <strong>Rasyonel Sayılar (Q):</strong> a / b şeklinde yazılabilen sayılar (b ≠ 0).<br>
              • <strong>İrrasyonel Sayılar (Q'):</strong> Kök dışına tam çıkamayan (√2, √3) veya π, e gibi virgülden sonrası devretmeyen sayılar.<br>
              • <strong>Reel (Gerçel) Sayılar (R):</strong> Sayı doğrusundaki tüm rasyonel ve irrasyonel sayıların birleşimidir.
            </p>

            <div class="osym-golden-rule">
              <div class="osym-golden-title">⭐ Altın Kural: Ardışık Sayılarda Ortanca Terim</div>
              <div class="osym-golden-desc">
                Ardışık tek sayıda terimi olan bir dizide: <strong>Toplam ÷ Terim Sayısı = Ortanca Terim</strong>'i verir. Örneğin: Ardışık 5 tam sayının toplamı 85 ise, 85 ÷ 5 = 17 ortanca sayıdır. Sayılar: 15, 16, 17, 18, 19 olur.
              </div>
            </div>

            <div class="math-formula-box">
              <div class="formula-title">📐 Ardışık Sayılar ve Gauss Toplam Formülleri</div>
              <div class="formula-content">
                <p>• <strong>Terim Sayısı:</strong> Terim Sayısı = ((Son Terim - İlk Terim) / Artış Miktarı) + 1</p>
                <p>• <strong>Terimler Toplamı:</strong> Toplam = ((Son Terim + İlk Terim) / 2) × Terim Sayısı</p>
                <p>• <strong>1'den n'e Ardışık Sayılar Toplamı:</strong> 1 + 2 + 3 + ... + n = (n · (n + 1)) / 2</p>
                <p>• <strong>Ardışık Çift Sayılar Toplamı:</strong> 2 + 4 + 6 + ... + 2n = n · (n + 1)</p>
                <p>• <strong>Ardışık Tek Sayılar Toplamı:</strong> 1 + 3 + 5 + ... + (2n - 1) = n²</p>
              </div>
            </div>

            <div class="worked-example-card">
              <div class="worked-example-header">
                <span class="worked-example-title">💡 Çözümlü Örnek Soru (ÖSYM Tipi)</span>
                <span class="badge badge-primary">Sayı Problemi</span>
              </div>
              <div class="worked-example-body">
                <strong>Soru:</strong> 13 ile 97 arasındaki 4'ün katı olan tam sayıların toplamı kaçtır?
              </div>
              <div class="example-solution-toggle" onclick="this.nextElementSibling.classList.toggle('is-open')">
                <span>🔍 Adım Adım Çözümü Göster / Gizle</span>
                <span>▼</span>
              </div>
              <div class="example-solution-content">
                <strong>Çözüm Adımları:</strong><br>
                1. İlk terim = 16, Son terim = 96, Artış miktarı = 4.<br>
                2. Terim Sayısı = ((96 - 16) / 4) + 1 = (80 / 4) + 1 = 20 + 1 = <strong>21 terim</strong>.<br>
                3. Ortalama = (96 + 16) / 2 = 112 / 2 = <strong>56</strong>.<br>
                4. Toplam = 21 × 56 = <strong>1.176</strong> bulunur.
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'mat_problemler',
        name: '2. KPSS Problem Türleri (Sayı, Kesir, Yaş, Hız, Kâr)',
        badge: '8-10 Soru',
        relatedExamTopic: 'Sayı ve Kesir Problemleri',
        html: `
          <div class="lecture-unit-body">
            <div class="alert-box tip">
              <strong>🎯 Sınav Analizi:</strong> KPSS Lisans Matematik testinin neredeyse 3'te 1'i (8-10 soru) problemlerden oluşur. Doğru denklem kurmak sınavın anahtarıdır.
            </div>

            <div class="osym-golden-rule">
              <div class="osym-golden-title">⭐ Altın Kural: Yaş Problemleri Değişmezliği</div>
              <div class="osym-golden-desc">
                İki kişi arasındaki <strong>yaş farkı yıllar geçse de ASLA DEĞİŞMEZ</strong>. Geçen yıl her iki kişi için de aynı miktarda eklenir.
              </div>
            </div>

            <h3>📌 Problem Formülleri & Çözüm Taktikleri</h3>
            <div class="math-formula-box">
              <div class="formula-title">📐 Hız - Hareket Bağıntıları</div>
              <div class="formula-content">
                <p>• <strong>Temel Bağıntı:</strong> Yol = Hız × Zaman (x = V · t)</p>
                <p>• <strong>Zıt Yönde Karşılaşma:</strong> x = (V₁ + V₂) · t_karşılaşma</p>
                <p>• <strong>Aynı Yönde Yakalama:</strong> x = (V₁ - V₂) · t_yakalama (V₁ > V₂)</p>
                <p>• <strong>Ortalama Hız:</strong> V_ort = (Toplam Alınan Yol) / (Toplam Harcanan Zaman)</p>
              </div>
            </div>

            <div class="math-formula-box">
              <div class="formula-title">💰 Yüzde & Kâr - Zarar Formülleri</div>
              <div class="formula-content">
                <p>• <strong>Kârlı Satış:</strong> Satış = Maliyet × (1 + k/100)</p>
                <p>• <strong>Zararlı Satış:</strong> Satış = Maliyet × (1 - z/100)</p>
                <p>• <strong>İskonto (İndirim):</strong> İndirimli Fiyat = Etiket Fiyatı × (1 - i/100)</p>
              </div>
            </div>

            <div class="worked-example-card">
              <div class="worked-example-header">
                <span class="worked-example-title">💡 Çözümlü Hız Problemi Örneği</span>
                <span class="badge badge-warning">Hız Problemi</span>
              </div>
              <div class="worked-example-body">
                <strong>Soru:</strong> Aralarında 420 km mesafe olan iki araç, saatte 60 km ve 80 km hızla birbirlerine doğru aynı anda hareket ediyor. Kaç saat sonra karşılaşırlar?
              </div>
              <div class="example-solution-toggle" onclick="this.nextElementSibling.classList.toggle('is-open')">
                <span>🔍 Adım Adım Çözümü Göster / Gizle</span>
                <span>▼</span>
              </div>
              <div class="example-solution-content">
                <strong>Çözüm:</strong><br>
                Zıt yönde birbirine doğru hareket formülü:<br>
                Yol = (V₁ + V₂) × t<br>
                420 = (60 + 80) × t<br>
                420 = 140 × t -> <strong>t = 3 saat</strong> sonra karşılaşırlar.
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'mat_geometri',
        name: '3. Geometri (Açılar, Üçgenler, Dörtgenler & Analitik)',
        badge: '3-4 Soru',
        relatedExamTopic: 'Geometri - Özel Dik Üçgenler ve Öklid',
        html: `
          <div class="lecture-unit-body">
            <div class="osym-trap-box">
              <div class="osym-trap-title">⚠️ ÖSYM Tuzağı: Öklid Bağıntısı Şartı</div>
              <div class="osym-trap-desc">
                Öklid bağıntısı uygulanabilmesi için mutlaka <strong>90 derecelik dik açıdan hipotenüse dik inmesi</strong> (dikten dik inme) şarttır!
              </div>
            </div>

            <div class="math-formula-box">
              <div class="formula-title">📐 Özel Dik Üçgenler ve Kenar Bağıntıları</div>
              <div class="formula-content">
                <p>• <strong>Pisagor Teoremi:</strong> a² + b² = c² (c = Hipotenüs)</p>
                <p>• <strong>Kenarlarına Göre Özel Üçgenler:</strong> (3-4-5), (5-12-13), (8-15-17), (7-24-25) ve katları.</p>
                <p>• <strong>30° - 60° - 90° Üçgeni:</strong> 30° karşısı a ise, 90° karşısı 2a, 60° karşısı a√3'tür.</p>
                <p>• <strong>45° - 45° - 90° Üçgeni:</strong> Dik kenarlar a, a ise hipotenüs a√2'dir.</p>
                <p>• <strong>Öklid Bağıntısı:</strong> h² = p · k (Yüksekliğin karesi = taban parçaları çarpımı).</p>
                <p>• <strong>Eşkenar Üçgen Alanı:</strong> Alan = (a² · √3) / 4</p>
              </div>
            </div>
          </div>
        `
      }
    ]
  },

  tarih: {
    title: 'Tarih',
    icon: '📜',
    color: '#f59e0b',
    questionCount: '27 Soru',
    topics: [
      {
        id: 'tar_islam_oncesi',
        name: '1. İslamiyet Öncesi Türk Tarihi & Kültürü',
        badge: '3 Soru',
        relatedExamTopic: 'İslamiyet Öncesi Türk Tarihi (Siyasi)',
        html: `
          <div class="lecture-unit-body">
            <div class="osym-trap-box">
              <div class="osym-trap-title">⚠️ ÖSYM Tuzağı: Hükümdarlık Alametleri</div>
              <div class="osym-trap-desc">
                İslamiyet öncesi Türk devletlerinde <strong>Hutbe okutmak, Para bastırmak, Hilat giymek ve Çetr (saltanat şemsiyesi)</strong> HÜKÜMDARLIK ALAMETİ DEĞİLDİR! Bunlar İslamiyet'in kabulüyle gelmiştir.
              </div>
            </div>

            <div class="osym-golden-rule">
              <div class="osym-golden-title">⭐ Altın Kural: Uygurların Farkı</div>
              <div class="osym-golden-desc">
                Maniheizm dinini benimseyerek <strong>yerleşik hayata geçen İLK Türk devleti Uygurlardır</strong>. Matbaa, kütüphane, fresk (duvar resmi), minyatür ve şehircilik Uygurlarla başlamıştır.
              </div>
            </div>

            <table class="lecture-table">
              <thead>
                <tr>
                  <th>Kavram</th>
                  <th>Anlamı</th>
                  <th>ÖSYM Soru Tipi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Kut</strong></td>
                  <td>Gök Tengri tarafından hükümdara verildiğine inanılan yönetme yetkisi (Kan bağıyla hanedana geçer).</td>
                  <td>Veraset sistemi ve taht kavgalarının ana nedeni.</td>
                </tr>
                <tr>
                  <td><strong>Kurultay (Toy)</strong></td>
                  <td>Kağan, Hatun ve Boy beylerinin katıldığı devlet meclisi.</td>
                  <td>Danışma organı niteliği.</td>
                </tr>
                <tr>
                  <td><strong>Töre</strong></td>
                  <td>Yazısız hukuk kuralları (Kağan dahi töreye uymak zorundadır).</td>
                  <td>Hukukun üstünlüğü ilkesi.</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        id: 'tar_milli_mucadele',
        name: '2. Kurtuluş Savaşı & Genelgeler-Kongreler',
        badge: '4-5 Soru',
        relatedExamTopic: 'Milli Mücadele Hazırlık Dönemi (Genelgeler)',
        html: `
          <div class="lecture-unit-body">
            <div class="mnemonic-card">
              <div class="mnemonic-header">🧠 Hafıza Şifresi: I. İnönü Savaşı Sonuçları</div>
              <div class="mnemonic-code">TALİM</div>
              <p style="font-size: 0.9rem; line-height: 1.6; margin-top: 0.5rem;">
                • <strong>T:</strong> Teşkilat-ı Esasiye (1921 Anayasası kabul edildi)<br>
                • <strong>A:</strong> Afganistan Dostluk Antlaşması (TBMM'yi tanıyan ilk Müslüman devlet)<br>
                • <strong>L:</strong> Londra Konferansı (İtilaf Devletleri TBMM'yi resmen tanıdı)<br>
                • <strong>İ:</strong> İstiklal Marşı'nın Kabulü (12 Mart 1921)<br>
                • <strong>M:</strong> Moskova Antlaşması (Sovyet Rusya ile imzalandı, ilk büyük Avrupalı devlet)
              </p>
            </div>

            <div class="osym-trap-box">
              <div class="osym-trap-title">⚠️ ÖSYM Tuzağı: Manda ve Himaye</div>
              <div class="osym-trap-desc">
                Manda ve himaye fikri <strong>İLK KEZ Erzurum Kongresi'nde</strong> reddedilmiştir. <strong>KESİN OLARAK ise Sivas Kongresi'nde</strong> reddedilip gündemden tamamen çıkarılmıştır.
              </div>
            </div>

            <div class="osym-golden-rule">
              <div class="osym-golden-title">⭐ Altın Kural: Kadınlara Siyasi Haklar (BMW Şifresi)</div>
              <div class="osym-golden-desc">
                Kadınlara verilen hakların kronolojisi <strong>0 - 3 - 4</strong> kuralı: <strong>1930 Belediye</strong>, <strong>1933 Muhtar</strong>, <strong>1934 Milletvekili</strong> seçme ve seçilme hakkı.
              </div>
            </div>
          </div>
        `
      }
    ]
  },

  cografya: {
    title: 'Coğrafya',
    icon: '🌍',
    color: '#10b981',
    questionCount: '18 Soru',
    topics: [
      {
        id: 'cog_konum_iklim',
        name: '1. Türkiye Coğrafi Konumu & İklimi',
        badge: '4 Soru',
        relatedExamTopic: "Türkiye'nin Coğrafi Konumu ve Sonuçları",
        html: `
          <div class="lecture-unit-body">
            <div class="mnemonic-card">
              <div class="mnemonic-header">🧠 Hafıza Şifresi: Türkiye'nin Orta Kuşakta Olmasının Sonuçları</div>
              <div class="mnemonic-code">A - B - C - D</div>
              <p style="font-size: 0.9rem; line-height: 1.6; margin-top: 0.5rem;">
                • <strong>A:</strong> Akdeniz İklim kuşağında yer alması<br>
                • <strong>B:</strong> Batı Rüzgârlarının etkisi altında kalması<br>
                • <strong>C:</strong> Cephesel (Frontal) Yağışların görülmesi<br>
                • <strong>D:</strong> Dört mevsimin belirgin olarak yaşanması
              </p>
            </div>

            <div class="mnemonic-card">
              <div class="mnemonic-header">🧠 Hafıza Şifresi: Türkiye'yi Etkileyen Yerel Rüzgârlar</div>
              <div class="mnemonic-code">KAYIP SAKAL</div>
              <p style="font-size: 0.9rem; line-height: 1.6; margin-top: 0.5rem;">
                <em>Kuzeyden esenler (Sıcaklığı düşürür):</em> <strong>K</strong>arayel, <strong>Y</strong>ıldız, <strong>P</strong>oyraz.<br>
                <em>Güneyden esenler (Sıcaklığı artırır):</em> <strong>S</strong>amyeli (Keşişleme), <strong>K</strong>ıble, <strong>L</strong>odos.
              </p>
            </div>

            <div class="osym-trap-box">
              <div class="osym-trap-title">⚠️ ÖSYM Tuzağı: Kıyı Tipleri</div>
              <div class="osym-trap-desc">
                Türkiye kıyılarında Okyanus bulunmadığı ve gelgit genliği az olduğu için <strong>Haliç ve Watt tipi kıyılar GÖRÜLMEZ</strong>. Ayrıca mutlak konum nedeniyle <strong>Fiyort ve Skyer tipi buzul kıyıları da yoktur</strong>.
              </div>
            </div>
          </div>
        `
      }
    ]
  },

  vatandaslik: {
    title: 'Vatandaşlık',
    icon: '⚖️',
    color: '#ef4444',
    questionCount: '9 Soru',
    topics: [
      {
        id: 'vat_temel_hukuk',
        name: '1. Temel Hukuk Kavramları & Yüksek Mahkemeler',
        badge: '3 Soru',
        relatedExamTopic: 'Temel Hukuk Kavramları (Sosyal Düzen Kuralları)',
        html: `
          <div class="lecture-unit-body">
            <div class="osym-trap-box">
              <div class="osym-trap-title">⚠️ ÖSYM Tuzağı: Yüksek Mahkemeler Listesi</div>
              <div class="osym-trap-desc">
                1982 Anayasası'na göre Yüksek Mahkemeler SADECE 4 tanedir:<br>
                1. <strong>Anayasa Mahkemesi</strong><br>
                2. <strong>Yargıtay</strong> (Adli Yargı temyiz)<br>
                3. <strong>Danıştay</strong> (İdari Yargı temyiz)<br>
                4. <strong>Uyuşmazlık Mahkemesi</strong><br>
                <em>(DİKKAT: Sayıştay, HSK ve YSK anayasal kurumlardır ancak YÜKSEK MAHKEME DEĞİLDİR!)</em>
              </div>
            </div>

            <div class="osym-golden-rule">
              <div class="osym-golden-title">⭐ Altın Kural: Hak Ehliyeti vs. Fiil Ehliyeti</div>
              <div class="osym-golden-desc">
                • <strong>Hak Ehliyeti:</strong> Sağ ve tam doğumla başlar (Pasif ehliyettir, herkes sahiptir).<br>
                • <strong>Fiil Ehliyeti:</strong> Kendi eylemleriyle hak kazanabilme ve borç altına girebilme ehliyetidir. Şartları: <strong>1) Ayırt etme gücü, 2) Erginlik (18 yaş), 3) Kısıtlı (mahcur) olmamak</strong>.
              </div>
            </div>
          </div>
        `
      }
    ]
  },

  turkce: {
    title: 'Türkçe',
    icon: '🇹🇷',
    color: '#3b82f6',
    questionCount: '30 Soru',
    topics: [
      {
        id: 'tr_dil_bilgisi',
        name: '1. Dil Bilgisi & Yazım - Noktalama Kuralları',
        badge: '5-6 Soru',
        relatedExamTopic: 'Yazım Kuralları (Bitişik ve Ayrı Yazılanlar)',
        html: `
          <div class="lecture-unit-body">
            <div class="mnemonic-card">
              <div class="mnemonic-header">🧠 Hafıza Şifresi: Kalıplaşmış Bitişik Yazılan 'ki'ler</div>
              <div class="mnemonic-code">SOMBAHÇEMİ</div>
              <p style="font-size: 0.9rem; line-height: 1.6; margin-top: 0.5rem;">
                • <strong>S:</strong> Sanki<br>
                • <strong>O:</strong> Oysaki<br>
                • <strong>M:</strong> Mademki<br>
                • <strong>B:</strong> Belki<br>
                • <strong>A:</strong> (A - Boşluk)<br>
                • <strong>H:</strong> Halbuki<br>
                • <strong>Ç:</strong> Çünkü<br>
                • <strong>E:</strong> (E - Boşluk)<br>
                • <strong>M:</strong> Meğerki<br>
                • <strong>İ:</strong> İllaki
              </p>
            </div>

            <div class="osym-trap-box">
              <div class="osym-trap-title">⚠️ ÖSYM Tuzağı: Noktalı Virgül (;) Kuralı</div>
              <div class="osym-trap-desc">
                Bir cümlede virgül (,) yoksa <strong>noktalı virgül (;) ASLA kullanılamaz</strong>! Noktalı virgül, virgüllerle ayrılmış tür veya ögeleri birbirinden ayırmak için kullanılır.
              </div>
            </div>
          </div>
        `
      }
    ]
  },

  guncel: {
    title: 'Güncel Bilgiler',
    icon: '🌐',
    color: '#06b6d4',
    questionCount: '6 Soru',
    topics: [
      {
        id: 'gun_uluslararasi_orgutler',
        name: '1. Uluslararası Örgütler & UNESCO Varlıkları',
        badge: '6 Soru',
        relatedExamTopic: 'Uluslararası Örgütler ve Merkezleri (BM, NATO, AB)',
        html: `
          <div class="lecture-unit-body">
            <div class="osym-golden-rule">
              <div class="osym-golden-title">⭐ UNESCO Türkiye Son Dünya Mirasları</div>
              <div class="osym-golden-desc">
                • <strong>20. Varlık (2023):</strong> Ankara - <em>Gordion Antik Kenti</em>.<br>
                • <strong>21. Varlık (2023):</strong> <em>Anadolu'nun Ahşap Hipostil (Direkli) Camileri</em> (Konya Eşrefoğlu, Afyon Ulu, Sivrihisar Ulu, Kastamonu Mahmut Bey, Ankara Arslanhane).
              </div>
            </div>

            <table class="lecture-table">
              <thead>
                <tr>
                  <th>Kuruluş</th>
                  <th>Genel Merkezi</th>
                  <th>Özellik</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>UNESCO</strong></td>
                  <td>Paris / Fransa</td>
                  <td>Eğitim, Bilim ve Kültür Örgütü</td>
                </tr>
                <tr>
                  <td><strong>NATO</strong></td>
                  <td>Brüksel / Belçika</td>
                  <td>Kuzey Atlantik Savunma İttifakı</td>
                </tr>
                <tr>
                  <td><strong>TÜRKSOY</strong></td>
                  <td>Ankara / Türkiye</td>
                  <td>Uluslararası Türk Kültürü Teşkilatı</td>
                </tr>
                <tr>
                  <td><strong>D-8</strong></td>
                  <td>İstanbul / Türkiye</td>
                  <td>Gelişen 8 Ülke Ekonomik İşbirliği</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      }
    ]
  }
};