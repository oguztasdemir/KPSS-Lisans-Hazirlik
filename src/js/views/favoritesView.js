/**
 * Favori Sorular View
 */

import { store } from '../store.js';
import { QuizController } from '../quizController.js';

export function renderFavorites(container) {
  const allQuestions = store.allQuestions || [];
  const favoriteIds = store.favoriteIds || [];
  const favQuestions = allQuestions.filter(q => favoriteIds.includes(q.id));

  if (favQuestions.length === 0) {
    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-title">⭐ Favori Sorularım</h1>
      </div>
      <div class="question-card" style="text-align: center; padding: 4rem 2rem;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">⭐</div>
        <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--text-primary);">Henüz Favori Soru Eklenmedi</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Soru çözerken sağ üstteki yıldız ikonuna tıklayarak beğendiğiniz soruları buraya kaydedebilirsiniz.</p>
        <a href="#pastexams" class="btn btn-primary">Çıkmış Soruları İncele</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div>
      <div class="view-header">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 class="view-title">⭐ Favori Sorularım (${favQuestions.length} Soru)</h1>
            <p class="view-subtitle">Yıldızlayıp kaydettiğiniz tüm önemli soruları dilediğiniz an tekrar çözün.</p>
          </div>
          <button class="btn btn-primary" id="btn-start-fav-quiz">
            🚀 Favori Soruları Çöz
          </button>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${favQuestions.map(q => {
          const year = q.yil || q.year || '';
          const subject = q.brans || q.subject || '';
          const topic = q.konu || q.topic || '';
          const text = (q.soruMetni || q.questionText || '').replace(/\n/g, ' ');

          return `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-left: 4px solid var(--warning); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
              <div style="flex: 1;">
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span class="badge badge-warning">${year} KPSS</span>
                  <span class="badge badge-purple">${subject}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${topic}</span>
                </div>
                <p style="font-size: 0.95rem; font-weight: 500; color: var(--text-primary); line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 650px;">
                  ${text}
                </p>
              </div>
              <button class="btn btn-secondary" style="font-size: 0.8rem;" data-fav-id="${q.id}">
                İncele
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const startFavBtn = container.querySelector('#btn-start-fav-quiz');
  if (startFavBtn) {
    startFavBtn.addEventListener('click', () => {
      const quiz = new QuizController(container, favQuestions, { title: 'Favori Sorularım', mode: 'favorites' });
      quiz.init();
    });
  }

  container.querySelectorAll('[data-fav-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = btn.getAttribute('data-fav-id');
      const targetQ = favQuestions.filter(q => q.id === qid);
      const quiz = new QuizController(container, targetQ, { title: 'Favori Soru', mode: 'favorites' });
      quiz.init();
    });
  });
}
