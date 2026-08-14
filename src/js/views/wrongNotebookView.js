/**
 * Yanlışlar Kutusu / Hata Defteri View
 */

import { store } from '../store.js';
import { QuizController } from '../quizController.js';

export function renderWrongNotebook(container) {
  const allQuestions = store.allQuestions || [];
  const wrongIds = store.wrongQuestionIds || [];
  const wrongQuestions = allQuestions.filter(q => wrongIds.includes(q.id));

  if (wrongQuestions.length === 0) {
    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-title">❌ Hata Defterim (Yanlışlar)</h1>
      </div>
      <div class="question-card" style="text-align: center; padding: 4rem 2rem;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🎉</div>
        <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--text-primary);">Hata Defteriniz Boş!</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Çözdüğünüz testlerde yanlış yaptığınız sorular otomatik olarak burada birikecektir.</p>
        <a href="#pastexams" class="btn btn-primary">Çıkmış Soruları Çözmeye Başla</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div>
      <div class="view-header">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 class="view-title">❌ Hata Defterim (${wrongQuestions.length} Soru)</h1>
            <p class="view-subtitle">Yanlış yaptığınız soruları tekrar çözüp doğru yaptıkça hata defterinden otomatik temizleyebilirsiniz.</p>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="btn-print-wrongs" title="Hata defterinizi A4 formatında PDF olarak kaydet veya yazdır">
              🖨️ PDF / Yazdır
            </button>
            <button class="btn btn-primary" id="btn-start-wrong-quiz">
              🚀 Tüm Yanlışları Çözmeye Başla
            </button>
          </div>
        </div>
      </div>


      <div style="display: flex; flex-direction: column; gap: 1rem;" id="wrong-questions-list">
        ${wrongQuestions.map((q) => {
          const year = q.yil || q.year || '';
          const subject = q.brans || q.subject || '';
          const topic = q.konu || q.topic || '';
          const text = (q.soruMetni || q.questionText || '').replace(/\n/g, ' ');

          return `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-left: 4px solid var(--danger); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
              <div style="flex: 1;">
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span class="badge badge-danger">${year} KPSS</span>
                  <span class="badge badge-purple">${subject}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${topic}</span>
                </div>
                <p style="font-size: 0.95rem; font-weight: 500; color: var(--text-primary); line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 650px;">
                  ${text}
                </p>
              </div>
              <button class="btn btn-secondary" style="font-size: 0.8rem;" data-solve-id="${q.id}">
                Çöz
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const startAllBtn = container.querySelector('#btn-start-wrong-quiz');
  if (startAllBtn) {
    startAllBtn.addEventListener('click', () => {
      const quiz = new QuizController(container, wrongQuestions, { title: 'Hata Defteri Soruları', mode: 'wrongNotebook' });
      quiz.init();
    });
  }

  const printBtn = container.querySelector('#btn-print-wrongs');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }


  container.querySelectorAll('[data-solve-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = btn.getAttribute('data-solve-id');
      const targetQ = wrongQuestions.filter(q => q.id === qid);
      const quiz = new QuizController(container, targetQ, { title: 'Soru Tekrarı', mode: 'wrongNotebook' });
      quiz.init();
    });
  });
}
