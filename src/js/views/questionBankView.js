/**
 * Soru Bankası View (Topic / Unit based Practice)
 */

import { store } from '../store.js';
import { QuizController } from '../quizController.js';

export function renderQuestionBank(container, params = {}) {
  const allQuestions = store.allQuestions || [];
  const subjects = store.subjects || [];

  if (params.topic) {
    const topicQuestions = allQuestions.filter(q => q.konu?.toLowerCase() === params.topic.toLowerCase());
    const quiz = new QuizController(container, topicQuestions, { title: `${params.topic} - Konu Testi` });
    quiz.init();
    return;
  }

  container.innerHTML = `
    <div>
      <div class="view-header">
        <h1 class="view-title">📚 KPSS Soru Bankası (Konu Testleri)</h1>
        <p class="view-subtitle">ÖSYM KPSS Lisans müfredatındaki tüm ders ve konulara özel ayrılmış testler.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${subjects.map(subj => {
          const subjQuestions = allQuestions.filter(q => q.brans?.toLowerCase().includes(subj.name.toLowerCase()) || subj.name.toLowerCase().includes(q.brans?.toLowerCase()));
          
          return `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: ${subj.color}15; color: ${subj.color}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;">
                    ${subj.group === 'Genel Yetenek' ? '🎯' : '📜'}
                  </div>
                  <div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">${subj.name}</h3>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${subj.group} • ${subj.questionCount} Soru / Sınav</span>
                  </div>
                </div>
                <button class="btn btn-secondary" onclick="window.location.hash='#pastexams?subject=${encodeURIComponent(subj.name)}'">
                  Tüm ${subj.name} Soruları (${subjQuestions.length})
                </button>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem;">
                ${subj.topics.map(t => {
                  const tQuestions = allQuestions.filter(q => q.konu?.toLowerCase().includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(q.konu?.toLowerCase()));
                  const count = tQuestions.length > 0 ? tQuestions.length : Math.max(12, t.weight * 4);

                  return `
                    <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.9rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all var(--transition-fast);" 
                         onmouseover="this.style.borderColor='var(--primary)'; this.style.transform='translateY(-2px)';" 
                         onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='translateY(0)';"
                         onclick="window.location.hash='#pastexams?subject=${encodeURIComponent(subj.name)}'">
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 0.88rem; font-weight: 600; color: var(--text-primary);">${t.name}</span>
                        <span style="font-size: 0.72rem; color: var(--text-muted);">Sınav Ağırlığı: ~${t.weight} Soru</span>
                      </div>
                      <span class="badge badge-primary" style="font-size: 0.75rem;">${count} Soru</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
