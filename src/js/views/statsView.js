/**
 * İstatistik & Performans Analizi View
 */

import { store } from '../store.js';

export function renderStats(container) {
  const stats = store.getStatistics();
  const subjectStats = stats.subjectStats;

  container.innerHTML = `
    <div>
      <div class="view-header">
        <h1 class="view-title">📊 KPSS Performans & İstatistik Analizi</h1>
        <p class="view-subtitle">Ders ders çözülen sorular, doğruluk oranları, net ortalamaları ve gelişim tablonuz.</p>
      </div>

      <!-- Top Big Stats Grid -->
      <div class="stats-summary-grid" style="margin-bottom: 2rem;">
        <div class="summary-stat-card">
          <div class="stat-icon-wrapper" style="background: var(--primary-light); color: var(--primary);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20V10"></path>
              <path d="M18 20V4"></path>
              <path d="M6 20v-4"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${stats.totalSolved}</span>
            <span class="stat-label">Toplam Çözülen Soru</span>
          </div>
        </div>

        <div class="summary-stat-card">
          <div class="stat-icon-wrapper" style="background: var(--success-bg); color: var(--success);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${stats.totalCorrect}</span>
            <span class="stat-label">Toplam Doğru Sayısı</span>
          </div>
        </div>

        <div class="summary-stat-card">
          <div class="stat-icon-wrapper" style="background: var(--danger-bg); color: var(--danger);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${stats.totalWrong}</span>
            <span class="stat-label">Toplam Yanlış Sayısı</span>
          </div>
        </div>

        <div class="summary-stat-card">
          <div class="stat-icon-wrapper" style="background: var(--purple-bg); color: var(--purple);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${stats.netScore}</span>
            <span class="stat-label">Tahmini Toplam Net</span>
          </div>
        </div>
      </div>

      <!-- Branch Performance Breakdown -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.75rem; box-shadow: var(--shadow-sm); margin-bottom: 2rem;">
        <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1.25rem;">
          🎯 Ders Bazlı Başarı Oranları
        </h2>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${Object.entries(subjectStats).map(([subjName, s]) => {
            const pct = s.solved > 0 ? Math.round((s.correct / s.solved) * 100) : 0;
            const net = (s.correct - (s.wrong * 0.25)).toFixed(2);

            return `
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${subjName}</span>
                  <span style="font-size: 0.85rem; color: var(--text-muted);">
                    ${s.correct} Doğru / ${s.wrong} Yanlış • <strong>${net} Net</strong> (%${pct})
                  </span>
                </div>
                <div class="subject-progress-bar" style="height: 10px;">
                  <div class="progress-fill" style="width: ${pct}%; background: ${pct >= 70 ? 'var(--success)' : pct >= 45 ? 'var(--warning)' : 'var(--primary)'};"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
