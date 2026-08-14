/**
 * Güncel Bilgiler View
 */

import { store } from '../store.js';

export function renderCurrentEvents(container) {
  const events = store.currentEvents || [];

  container.innerHTML = `
    <div>
      <div class="view-header">
        <h1 class="view-title">🌍 Güncel Bilgiler & Olaylar</h1>
        <p class="view-subtitle">KPSS Genel Kültür testinde gelen 6 soruluk güncel olaylar, uluslararası zirveler ve kültür-sanat gelişmeleri.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
        ${events.map(ev => `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; gap: 0.85rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="badge badge-primary">${ev.tag || 'Güncel'}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${ev.date || '2024-2025'}</span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${ev.title}</h3>
            <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary);">${ev.content}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
