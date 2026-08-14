/**
 * Global Arama Modalı (Search Modal) Modülü
 * Ctrl+K veya '/' ile açılan hızlı soru, ders ve konu arama motoru.
 */

import { store } from '../store.js';

export class SearchModal {
  static open() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-overlay active" id="search-modal-overlay">
        <div class="modal-card" style="max-width: 600px; padding: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 1rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-muted);">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="global-search-input" placeholder="Soru, ders veya konu ara (Örn: Selçuklu, Tombolo, TBMM, Öklid)..." style="flex: 1; border: none; background: transparent; font-size: 1rem; color: var(--text-primary);" autofocus>
            <button id="search-modal-close" style="color: var(--text-muted); font-size: 1.2rem;">&times;</button>
          </div>

          <div id="search-results-list" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 380px; overflow-y: auto;">
            <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 2rem;">Aramak istediğiniz anahtar kelimeyi yazın...</p>
          </div>
        </div>
      </div>
    `;

    const overlay = modalContainer.querySelector('#search-modal-overlay');
    const closeBtn = modalContainer.querySelector('#search-modal-close');
    const input = modalContainer.querySelector('#global-search-input');
    const resultsList = modalContainer.querySelector('#search-results-list');

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => { modalContainer.innerHTML = ''; }, 200);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    input.focus();

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        resultsList.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 2rem;">En az 2 harf giriniz...</p>`;
        return;
      }

      const matches = store.allQuestions.filter(item => {
        const text = (item.soruMetni || item.questionText || '').toLowerCase();
        const subj = (item.brans || item.subject || '').toLowerCase();
        const topic = (item.konu || item.topic || '').toLowerCase();
        return text.includes(q) || subj.includes(q) || topic.includes(q);
      }).slice(0, 15);

      if (matches.length === 0) {
        resultsList.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 2rem;">Sonuç bulunamadı.</p>`;
        return;
      }

      resultsList.innerHTML = matches.map(m => {
        const year = m.yil || m.year;
        const subj = m.brans || m.subject;
        const topic = m.konu || m.topic;
        const text = (m.soruMetni || m.questionText || '').replace(/\n/g, ' ');

        return `
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem 1rem; cursor: pointer; display: flex; flex-direction: column; gap: 0.25rem;" 
               onclick="window.location.hash='#pastexams?year=${year}'; document.getElementById('search-modal-close').click();">
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <span class="badge badge-primary" style="font-size: 0.7rem;">${year} KPSS</span>
              <span class="badge badge-purple" style="font-size: 0.7rem;">${subj}</span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${topic}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${text}
            </p>
          </div>
        `;
      }).join('');
    });
  }
}
