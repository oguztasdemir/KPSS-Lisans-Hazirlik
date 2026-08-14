/**
 * Kişisel Notlarım View
 */

import { store } from '../store.js';

export function renderNotes(container) {
  const notes = store.userNotes || {};
  const allQuestions = store.allQuestions || [];
  const noteKeys = Object.keys(notes);

  if (noteKeys.length === 0) {
    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-title">📝 Notlarım</h1>
      </div>
      <div class="question-card" style="text-align: center; padding: 4rem 2rem;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">📝</div>
        <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--text-primary);">Henüz Not Eklenmedi</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Soru çözerken sağ üstteki 'Not Ekle' butonuna basarak kendinize özel ders ve soru hatırlatıcıları yazabilirsiniz.</p>
        <a href="#pastexams" class="btn btn-primary">Çıkmış Soruları Çözmeye Başla</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div>
      <div class="view-header">
        <h1 class="view-title">📝 Soru ve Ders Notlarım (${noteKeys.length} Not)</h1>
        <p class="view-subtitle">Çözdüğünüz soruların üzerine aldığınız kişisel ders notları ve pratik hatırlatıcılar.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
        ${noteKeys.map(qid => {
          const noteObj = notes[qid];
          const q = allQuestions.find(item => item.id === qid);
          const dateStr = noteObj.updatedAt ? new Date(noteObj.updatedAt).toLocaleDateString('tr-TR') : 'Tarihsiz';
          const year = q ? (q.yil || q.year) : '';
          const subject = q ? (q.brans || q.subject) : '';

          return `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem; box-shadow: var(--shadow-sm);">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                  <span class="badge badge-primary">${q ? `${year} KPSS • ${subject}` : 'Soru Notu'}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${dateStr}</span>
                </div>
                <p style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.6; white-space: pre-line; background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  ${noteObj.text}
                </p>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;" data-delete-note-id="${qid}">
                  Sil
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-delete-note-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = btn.getAttribute('data-delete-note-id');
      if (confirm('Bu notu silmek istediğinize emin misiniz?')) {
        store.saveNote(qid, '');
        renderNotes(container);
      }
    });
  });
}
