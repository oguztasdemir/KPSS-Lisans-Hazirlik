/**
 * Interactive Quiz Controller Engine
 * Supports resumption at last index, timer, instant feedback, and Turkish schema
 */

import { store } from './store.js';
import { sound } from '../utils/sound.js';
import { renderMath } from './utils/renderMath.js';

export class QuizController {
  constructor(containerElement, questions, options = {}) {
    this.container = containerElement;
    
    // De-duplicate questions by id to guarantee each question appears only once
    const seenIds = new Set();
    this.questions = (questions || []).filter(q => {
      if (!q || !q.id || seenIds.has(q.id)) return false;
      seenIds.add(q.id);
      return true;
    });

    this.title = options.title || 'KPSS Soru Pratiği';
    this.mode = options.mode || 'standard'; // 'standard', 'wrongNotebook', 'favorites'
    this.year = options.year || (this.questions[0]?.yil || this.questions[0]?.year || null);
    
    // Resume at startIndex if provided, or from store if exam
    let initialIndex = options.startIndex !== undefined ? options.startIndex : 0;
    if (this.year && options.startIndex === undefined) {
      initialIndex = store.getExamLastIndex(this.year);
    }
    this.currentIndex = Math.min(Math.max(0, initialIndex), Math.max(0, this.questions.length - 1));
    this.userSelections = {};

    // Load existing answers
    this.questions.forEach(q => {
      if (store.answers[q.id]) {
        this.userSelections[q.id] = store.answers[q.id].selected;
      }
    });
  }


  init() {
    if (!this.questions || this.questions.length === 0) {
      this.renderEmptyState();
      return;
    }
    this.render();
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="view-header">
        <h1 class="view-title">${this.title}</h1>
      </div>
      <div class="question-card" style="text-align: center; padding: 4rem 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--text-primary);">Soru Bulunamadı</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Bu kategoride henüz çözülecek soru bulunmamaktadır.</p>
        <div>
          <button class="btn btn-primary" id="btn-back-home">
            Ana Ekrana Dön
          </button>
        </div>
      </div>
    `;

    const backBtn = this.container.querySelector('#btn-back-home');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.hash = '#pastexams';
      });
    }
  }

  render() {
    const q = this.questions[this.currentIndex];
    const isFav = store.isFavorite(q.id);
    const existingNote = store.getNote(q.id);
    const selectedKey = this.userSelections[q.id];
    const isAnswered = selectedKey !== undefined;

    // Normalizing field names
    const year = q.yil || q.year || 'KPSS';
    const subject = q.brans || q.subject || 'Genel';
    const topic = q.konu || q.topic || 'Konu';
    const questionText = q.soruMetni || q.questionText || '';
    const correctAnswer = q.dogruCevap || q.correctAnswer || '';
    const rawOptions = q.secenekler || q.options || [];
    const options = rawOptions.map(opt => ({
      key: opt.anahtar || opt.key,
      text: opt.metin || opt.text || opt.icerik || ''
    }));

    const explanationSummary = q.aciklama?.netOzet || q.explanation?.summary || 'Detaylı çözüm bilgisi hazırlanmaktadır.';
    const optionsDetail = q.aciklama?.secenekDetaylari || q.explanation?.optionsDetail || null;

    const displayNum = q.genelSoruNo || (this.currentIndex + 1);

    // Save progress to store
    if (this.year) {
      store.saveExamLastIndex(this.year, this.currentIndex);
    }

    this.container.innerHTML = `
      <div class="quiz-container">
        <!-- Top Bar -->
        <div class="quiz-top-bar">
          <div class="quiz-meta-left">
            <button class="quiz-action-btn" id="btn-back-to-list" style="margin-right: 0.25rem;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Listeye Dön</span>
            </button>
            <span class="badge badge-primary">${year} KPSS Lisans</span>
            <span class="badge badge-purple">${subject}</span>
            <span class="badge badge-warning" style="font-size: 0.72rem;">${topic}</span>
          </div>
          <div class="quiz-meta-right">
            <button class="quiz-action-btn ${isFav ? 'active-favorite' : ''}" id="btn-toggle-fav" title="Favorilere Ekle/Çıkar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>${isFav ? 'Favorilerde' : 'Favori'}</span>
            </button>
            <button class="quiz-action-btn" id="btn-add-note" title="Bu Soruya Not Ekle">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>${existingNote ? 'Notu Düzenle' : 'Not Ekle'}</span>
            </button>
            <button class="quiz-action-btn" id="btn-open-palette" title="Tüm Sorular Haritası">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>${this.currentIndex + 1} / ${this.questions.length}</span>
            </button>
          </div>
        </div>

        <!-- Question Card -->
        <div class="question-card">
          <div class="question-header">
            <span class="question-number-badge">Soru ${displayNum} (${this.currentIndex + 1} / ${this.questions.length})</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${q.testGrubu || 'GY-GK'}</span>
          </div>

          <div class="question-body">${questionText}</div>

          <!-- Options -->
          <div class="options-grid">
            ${options.map(opt => {
              let optClass = 'option-item';
              let iconHtml = '';

              if (isAnswered) {
                optClass += ' disabled';
                if (opt.key === correctAnswer) {
                  optClass += ' correct';
                  iconHtml = `
                    <div class="option-feedback-icon" style="color: var(--success);">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>`;
                } else if (opt.key === selectedKey) {
                  optClass += ' wrong';
                  iconHtml = `
                    <div class="option-feedback-icon" style="color: var(--danger);">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>`;
                }
              }

              return `
                <div class="${optClass}" data-key="${opt.key}">
                  <div class="option-key">${opt.key}</div>
                  <div class="option-text">${opt.text}</div>
                  ${iconHtml}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Explanation Box -->
          ${isAnswered ? `
            <div class="explanation-box">
              <div class="explanation-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Detaylı Çözüm & ÖSYM Analizi</span>
                <span class="badge ${selectedKey === correctAnswer ? 'badge-success' : 'badge-danger'}" style="margin-left: auto;">
                  ${selectedKey === correctAnswer ? 'Tebrikler! Doğru Cevap' : 'Doğru Cevap: ' + correctAnswer}
                </span>
              </div>
              <div class="explanation-summary">
                ${explanationSummary}
              </div>

              ${optionsDetail ? `
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 0.5rem;">
                  Şıkların Detaylı Açıklaması:
                </div>
                <div class="explanation-options-detail">
                  ${Object.entries(optionsDetail).map(([key, desc]) => `
                    <div class="opt-detail-item ${key === correctAnswer ? 'is-correct-key' : ''}">
                      <span class="opt-detail-key">${key}:</span>
                      <span>${desc}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Bottom Navigation -->
        <div class="quiz-nav-bar">
          <button class="btn btn-secondary" id="btn-prev-q" ${this.currentIndex === 0 ? 'disabled' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Önceki Soru</span>
          </button>

          <button class="btn btn-secondary" id="btn-finish-quiz">
            <span>Testi Bitir / Sonuç Raporu</span>
          </button>

          <button class="btn btn-primary" id="btn-next-q">
            <span>${this.currentIndex === this.questions.length - 1 ? '🏁 Testi Tamamla' : 'Sonraki Soru'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    this.bindEvents(q, correctAnswer, subject, topic, year);
    this.renderMath();
  }

  bindEvents(q, correctAnswer, subject, topic, year) {
    const optElements = this.container.querySelectorAll('.option-item:not(.disabled)');
    optElements.forEach(el => {
      el.addEventListener('click', () => {
        const selectedKey = el.getAttribute('data-key');
        this.handleSelectOption(q, selectedKey, correctAnswer, subject, topic, year);
      });
    });

    const backBtn = this.container.querySelector('#btn-back-to-list');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.hash = '#pastexams';
      });
    }

    const prevBtn = this.container.querySelector('#btn-prev-q');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.render();
        }
      });
    }

    const nextBtn = this.container.querySelector('#btn-next-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentIndex < this.questions.length - 1) {
          this.currentIndex++;
          this.render();
        } else {
          this.showResultsModal();
        }
      });
    }


    const favBtn = this.container.querySelector('#btn-toggle-fav');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        store.toggleFavorite(q.id);
        this.render();
      });
    }

    const noteBtn = this.container.querySelector('#btn-add-note');
    if (noteBtn) {
      noteBtn.addEventListener('click', () => {
        this.openNoteModal(q);
      });
    }

    const paletteBtn = this.container.querySelector('#btn-open-palette');
    if (paletteBtn) {
      paletteBtn.addEventListener('click', () => {
        this.openPaletteModal();
      });
    }

    const finishBtn = this.container.querySelector('#btn-finish-quiz');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        this.showResultsModal();
      });
    }
  }

  handleSelectOption(q, selectedKey, correctAnswer, subject, topic, year) {
    const isCorrect = (selectedKey === correctAnswer);
    this.userSelections[q.id] = selectedKey;

    if (store.settings.soundEnabled) {
      if (isCorrect) sound.playCorrect();
      else sound.playWrong();
    }

    store.recordAnswer(q.id, selectedKey, isCorrect, subject, topic, year, this.currentIndex);
    this.render();
  }

  openNoteModal(q) {
    const currentNote = store.getNote(q.id);
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-overlay active" id="note-modal-overlay">
        <div class="modal-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">📝 Soruya Özel Not Ekle</h3>
            <button id="modal-close-btn" style="font-size: 1.2rem; color: var(--text-muted);">&times;</button>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            Bu soruyla ilgili hatırlatıcı notlarınızı buraya kaydedebilirsiniz.
          </p>
          <textarea id="note-textarea" rows="5" style="width: 100%; padding: 0.85rem; background: var(--bg-surface-elevated); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); font-size: 0.9rem; margin-bottom: 1.25rem;" placeholder="Örn: Bu kuralda dikkat edilecek nokta...">${currentNote}</textarea>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button class="btn btn-secondary" id="modal-cancel-btn">İptal</button>
            <button class="btn btn-primary" id="modal-save-note-btn">Kaydet</button>
          </div>
        </div>
      </div>
    `;

    const overlay = modalContainer.querySelector('#note-modal-overlay');
    const closeBtn = modalContainer.querySelector('#modal-close-btn');
    const cancelBtn = modalContainer.querySelector('#modal-cancel-btn');
    const saveBtn = modalContainer.querySelector('#modal-save-note-btn');
    const textarea = modalContainer.querySelector('#note-textarea');

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => { modalContainer.innerHTML = ''; }, 200);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    saveBtn.addEventListener('click', () => {
      store.saveNote(q.id, textarea.value);
      closeModal();
      this.render();
    });
  }

  openPaletteModal() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-overlay active" id="palette-modal-overlay">
        <div class="modal-card" style="max-width: 620px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">📋 Soru Haritası</h3>
            <button id="modal-close-btn" style="font-size: 1.2rem; color: var(--text-muted);">&times;</button>
          </div>
          <div class="question-palette-modal-grid">
            ${this.questions.map((item, idx) => {
              const ans = store.answers[item.id];
              let stateClass = '';
              if (idx === this.currentIndex) stateClass += ' current';
              if (ans) {
                stateClass += ans.isCorrect ? ' answered-correct' : ' answered-wrong';
              }
              return `<button class="palette-number-btn ${stateClass}" data-index="${idx}">${idx + 1}</button>`;
            }).join('')}
          </div>
          <div style="display: flex; gap: 1rem; margin-top: 1.5rem; font-size: 0.75rem; color: var(--text-muted); justify-content: center;">
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width:10px;height:10px;background:var(--success);border-radius:2px;"></span> Doğru</span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width:10px;height:10px;background:var(--danger);border-radius:2px;"></span> Yanlış</span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width:10px;height:10px;background:var(--bg-surface-elevated);border:1px solid var(--border-color);border-radius:2px;"></span> Boş</span>
          </div>
        </div>
      </div>
    `;

    const overlay = modalContainer.querySelector('#palette-modal-overlay');
    const closeBtn = modalContainer.querySelector('#modal-close-btn');

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => { modalContainer.innerHTML = ''; }, 200);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    modalContainer.querySelectorAll('.palette-number-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentIndex = parseInt(btn.getAttribute('data-index'), 10);
        closeModal();
        this.render();
      });
    });
  }

  showResultsModal() {
    let correct = 0;
    let wrong = 0;
    let empty = 0;

    this.questions.forEach(q => {
      const ans = store.answers[q.id];
      if (!ans) empty++;
      else if (ans.isCorrect) correct++;
      else wrong++;
    });

    const net = (correct - (wrong * 0.25)).toFixed(2);
    const accuracy = (correct + wrong > 0) ? Math.round((correct / (correct + wrong)) * 100) : 0;

    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-overlay active" id="results-modal-overlay">
        <div class="modal-card" style="text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">Test Raporu</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">${this.title}</p>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
            <div style="background: var(--success-bg); padding: 0.85rem; border-radius: var(--radius-md);">
              <div style="font-size: 1.5rem; font-weight: 900; color: var(--success);">${correct}</div>
              <div style="font-size: 0.72rem; font-weight: 600; color: var(--success);">DOĞRU</div>
            </div>
            <div style="background: var(--danger-bg); padding: 0.85rem; border-radius: var(--radius-md);">
              <div style="font-size: 1.5rem; font-weight: 900; color: var(--danger);">${wrong}</div>
              <div style="font-size: 0.72rem; font-weight: 600; color: var(--danger);">YANLIŞ</div>
            </div>
            <div style="background: var(--bg-surface-elevated); padding: 0.85rem; border-radius: var(--radius-md);">
              <div style="font-size: 1.5rem; font-weight: 900; color: var(--text-secondary);">${empty}</div>
              <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary);">BOŞ</div>
            </div>
            <div style="background: var(--primary-light); padding: 0.85rem; border-radius: var(--radius-md);">
              <div style="font-size: 1.5rem; font-weight: 900; color: var(--primary);">${net}</div>
              <div style="font-size: 0.72rem; font-weight: 600; color: var(--primary);">NET</div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button class="btn btn-secondary" id="modal-close-results-btn">Soruları İncele</button>
            <button class="btn btn-primary" id="modal-home-btn">Sınav Listesine Dön</button>
          </div>
        </div>
      </div>
    `;

    const overlay = modalContainer.querySelector('#results-modal-overlay');
    const closeBtn = modalContainer.querySelector('#modal-close-results-btn');
    const homeBtn = modalContainer.querySelector('#modal-home-btn');

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => { modalContainer.innerHTML = ''; }, 200);
    };

    closeBtn.addEventListener('click', closeModal);
    homeBtn.addEventListener('click', () => {
      closeModal();
      window.location.hash = '#pastexams';
    });
  }

  renderMath() {
    renderMath(this.container);
  }
}
