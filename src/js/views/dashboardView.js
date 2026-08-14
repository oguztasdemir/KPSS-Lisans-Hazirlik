/**
 * Dashboard / Ana Ekran View
 * Sınav geri sayımı, 130 Dk Simülatör banner'ı, zayıf konu teşhisi, günlük hedef ve ders kartları.
 */

import { store } from '../store.js';

export function renderDashboard(container) {
  const stats = store.getStatistics();
  const dailyTarget = store.settings.dailyTarget || 50;
  const targetPercent = Math.min(100, Math.round((stats.todaySolved / dailyTarget) * 100));

  // Zayıf konu tespiti (en çok yanlış yapılan konular)
  const wrongIds = store.wrongQuestionIds || [];
  const wrongQuestions = store.allQuestions.filter(q => wrongIds.includes(q.id));
  const topicWrongMap = {};

  wrongQuestions.forEach(q => {
    const topic = q.konu || q.topic || 'Genel Konu';
    const subj = q.brans || q.subject || 'Genel';
    const key = `${subj} - ${topic}`;
    topicWrongMap[key] = (topicWrongMap[key] || 0) + 1;
  });

  const sortedWeakTopics = Object.entries(topicWrongMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  container.innerHTML = `
    <div class="dashboard-grid">
      <!-- Hero Banner with Live Exam Days -->
      <div class="dashboard-hero-banner">
        <div class="hero-left">
          <span class="badge" style="background: rgba(255,255,255,0.2); color: #fff; width: fit-content;">🎯 KPSS Lisans Hazırlık Asistanı</span>
          <h1 class="hero-title">Hedefine Adım Adım İlerle!</h1>
          <p class="hero-desc">
            Çıkmış soruları yıl yıl çöz, 130 dakikalık resmi simülasyonla kendini test et, yanlışlarını hata defterinden temizle.
          </p>
          <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
            <a href="#simulator" class="btn" style="background: #ffffff; color: var(--primary); font-weight: 800; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
              ⏱️ 130 Dk Simülatör Başlat
            </a>
            <a href="#pastexams" class="btn" style="background: rgba(255,255,255,0.18); color: #ffffff; border: 1px solid rgba(255,255,255,0.4);">
              <span>📚 Çıkmış Sınavlar (16 Yıl)</span>
            </a>
          </div>
        </div>

        <div class="hero-countdown-box">
          <span id="hero-countdown-days" class="hero-days-number">--</span>
          <span class="hero-days-label">GÜN KALDI</span>
          <span style="font-size: 0.7rem; opacity: 0.85; margin-top: 0.2rem;">KPSS 2026 Lisans</span>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="stats-summary-grid">
        <div class="summary-stat-card">
          <div class="stat-icon-wrapper" style="background: #eff6ff; color: #3b82f6;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${stats.totalSolved}</span>
            <span class="stat-label">Toplam Çözülen Soru</span>
          </div>
        </div>

        <div class="summary-stat-card">
          <div class="stat-icon-wrapper" style="background: #ecfdf5; color: #10b981;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">%${stats.accuracyRate}</span>
            <span class="stat-label">Genel Başarı Oranı</span>
          </div>
        </div>

        <div class="summary-stat-card">
          <div class="stat-icon-wrapper" style="background: #fef2f2; color: #ef4444;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${stats.wrongPoolCount}</span>
            <span class="stat-label">Hata Defterindeki Soru</span>
          </div>
        </div>

        <div class="summary-stat-card">
          <div class="stat-icon-wrapper" style="background: #fffbeb; color: #f59e0b;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${stats.favoriteCount}</span>
            <span class="stat-label">Favori Sorularım</span>
          </div>
        </div>
      </div>

      <!-- Two Column: Daily Target & Weak Topics Diagnostic -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
        <!-- Daily Target Card -->
        <div class="summary-stat-card" style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">🎯 Günlük Soru Hedefi</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Bugün çözülen: <strong>${stats.todaySolved}</strong> / ${dailyTarget} Soru</div>
            </div>
            <span class="badge ${targetPercent >= 100 ? 'badge-success' : 'badge-primary'}">%${targetPercent} Tamamlandı</span>
          </div>
          <div class="subject-progress-bar" style="height: 10px;">
            <div class="progress-fill" style="width: ${targetPercent}%; background: ${targetPercent >= 100 ? 'var(--success)' : 'var(--primary)'};"></div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-muted);">
            <span>Hedefe kalan: ${Math.max(0, dailyTarget - stats.todaySolved)} soru</span>
            <a href="#settings" style="color: var(--primary); font-weight: 700;">Hedefi Değiştir &rarr;</a>
          </div>
        </div>

        <!-- Smart Weak Topic Diagnostics Card -->
        <div class="summary-stat-card" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">🧠 Akıllı Eksik Teşhisi</div>
            <span class="badge badge-danger" style="font-size: 0.72rem;">Hata Analizi</span>
          </div>

          ${sortedWeakTopics.length === 0 ? `
            <p style="font-size: 0.85rem; color: var(--text-muted); padding: 0.5rem 0;">
              Henüz yeterli yanlış analizi yok. Soru çözdükçe zayıf konularınız burada listelenir.
            </p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
              ${sortedWeakTopics.map(([topicKey, count]) => `
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface-elevated); padding: 0.45rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                  <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-primary);">${topicKey}</span>
                  <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <span class="badge badge-danger" style="font-size: 0.7rem;">${count} Yanlış</span>
                    <a href="#lectures" class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;">Çalış</a>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Branch Quick Access Grid -->
      <div>
        <div class="section-heading">
          <span>📚 Branşlara Göre Çıkmış Sorular</span>
          <a href="#pastexams" style="font-size: 0.82rem; color: var(--primary); font-weight: 600;">Tümünü Gör &rarr;</a>
        </div>
        
        <div class="subject-cards-grid">
          <div class="subject-card" onclick="window.location.hash='#pastexams?subject=Tarih'">
            <div class="subject-card-top">
              <div class="subject-icon-box" style="background: #fffbeb; color: #f59e0b;">📜</div>
              <span class="badge badge-warning">27 Soru</span>
            </div>
            <div>
              <div class="subject-title">Tarih</div>
              <div class="subject-meta">İslamiyet Öncesi, Osmanlı, İnkılap Tarihi</div>
            </div>
          </div>

          <div class="subject-card" onclick="window.location.hash='#pastexams?subject=Coğrafya'">
            <div class="subject-card-top">
              <div class="subject-icon-box" style="background: #ecfdf5; color: #10b981;">🌍</div>
              <span class="badge badge-success">18 Soru</span>
            </div>
            <div>
              <div class="subject-title">Coğrafya</div>
              <div class="subject-meta">Fiziki, Beşeri ve Ekonomik Coğrafya</div>
            </div>
          </div>

          <div class="subject-card" onclick="window.location.hash='#pastexams?subject=Vatandaşlık'">
            <div class="subject-card-top">
              <div class="subject-icon-box" style="background: #fef2f2; color: #ef4444;">⚖️</div>
              <span class="badge badge-danger">9 Soru</span>
            </div>
            <div>
              <div class="subject-title">Vatandaşlık</div>
              <div class="subject-meta">Temel Hukuk, 1982 Anayasası, İdare Hukuku</div>
            </div>
          </div>

          <div class="subject-card" onclick="window.location.hash='#pastexams?subject=Türkçe'">
            <div class="subject-card-top">
              <div class="subject-icon-box" style="background: #eff6ff; color: #3b82f6;">🇹🇷</div>
              <span class="badge badge-primary">30 Soru</span>
            </div>
            <div>
              <div class="subject-title">Türkçe</div>
              <div class="subject-meta">Paragraf, Dil Bilgisi, Sözel Mantık</div>
            </div>
          </div>

          <div class="subject-card" onclick="window.location.hash='#pastexams?subject=Matematik & Geometri'">
            <div class="subject-card-top">
              <div class="subject-icon-box" style="background: #f5f3ff; color: #8b5cf6;">📐</div>
              <span class="badge badge-purple">30 Soru</span>
            </div>
            <div>
              <div class="subject-title">Matematik & Geometri</div>
              <div class="subject-meta">Temel Matematik, Problemler, Geometri</div>
            </div>
          </div>

          <div class="subject-card" onclick="window.location.hash='#pastexams?subject=Güncel Bilgiler'">
            <div class="subject-card-top">
              <div class="subject-icon-box" style="background: #ecfeff; color: #06b6d4;">🌐</div>
              <span class="badge" style="background: #ecfeff; color: #06b6d4;">6 Soru</span>
            </div>
            <div>
              <div class="subject-title">Güncel Bilgiler</div>
              <div class="subject-meta">Uluslararası Kuruluşlar, Kültür, Sanat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Update hero countdown
  const examDate = store.settings.examDate || '2026-09-06T10:15:00';
  const diffDays = Math.max(0, Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24)));
  const heroDaysEl = container.querySelector('#hero-countdown-days');
  if (heroDaysEl) heroDaysEl.textContent = diffDays;
}
