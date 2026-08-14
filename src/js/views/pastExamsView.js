/**
 * Çıkmış Sorular List View (Rich Table / List with Statistics and Resume/Restart Actions)
 */

import { store } from '../store.js';
import { QuizController } from '../quizController.js';

export function renderPastExams(container, params = {}) {
  const allQuestions = store.allQuestions || [];
  
  // Direct Quiz launch by Year
  if (params.year) {
    const yearNum = parseInt(params.year, 10);
    let questions = allQuestions.filter(q => (q.yil === yearNum || q.year === yearNum));

    // Optional filter: only wrongs or start from specific index
    if (params.onlyWrongs) {
      questions = questions.filter(q => store.wrongQuestionIds.includes(q.id));
    }

    const startIndex = params.startIndex !== undefined ? parseInt(params.startIndex, 10) : undefined;

    const quiz = new QuizController(container, questions, { 
      title: `${yearNum} KPSS Lisans GY-GK Çıkmış Sorular`,
      year: yearNum,
      startIndex: startIndex
    });
    quiz.init();
    return;
  }

  // Direct Quiz launch by Subject
  if (params.subject) {
    const targetSubj = params.subject.toLowerCase();
    const questions = allQuestions.filter(q => {
      const b = (q.brans || q.subject || '').toLowerCase();
      return b.includes(targetSubj) || targetSubj.includes(b);
    });
    const quiz = new QuizController(container, questions, { title: `${params.subject} - Çıkmış Sorular Havuzu` });
    quiz.init();
    return;
  }

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010, 2009];
  const branches = [
    { name: 'Tarih', icon: '📜', color: '#f59e0b', count: '27 Soru / Sınav', desc: 'İslamiyet Öncesi, Selçuklu, Osmanlı, İnkılap Tarihi' },
    { name: 'Coğrafya', icon: '🌍', color: '#10b981', count: '18 Soru / Sınav', desc: 'Fiziki, Beşeri, Ekonomik ve Bölgesel Coğrafya' },
    { name: 'Vatandaşlık', icon: '⚖️', color: '#ef4444', count: '9 Soru / Sınav', desc: 'Temel Hukuk, 1982 Anayasası, Yasama, Yürütme, İdare' },
    { name: 'Türkçe', icon: '🇹🇷', color: '#3b82f6', count: '30 Soru / Sınav', desc: 'Sözcük, Cümle, Paragraf, Dil Bilgisi, Sözel Mantık' },
    { name: 'Matematik & Geometri', icon: '📐', color: '#8b5cf6', count: '30 Soru / Sınav', desc: 'Temel Matematik, Problemler, Sayısal Mantık, Geometri' },
    { name: 'Güncel Bilgiler', icon: '🌐', color: '#06b6d4', count: '6 Soru / Sınav', desc: 'Uluslararası Örgütler, Sanat, UNESCO, Güncel Olaylar' }
  ];

  container.innerHTML = `
    <div>
      <div class="view-header">
        <h1 class="view-title">📝 KPSS Lisans Çıkmış Sorular</h1>
        <p class="view-subtitle">ÖSYM çıkmış sınavlarını çözün, ilerlemenizi takip edin ve kaldığınız yerden devam edin.</p>
      </div>

      <!-- Mode & Filter Bar -->
      <div class="filter-bar">
        <div class="filter-tabs" id="exam-mode-tabs">
          <button class="filter-tab-btn active" data-mode="years">📅 Yıllara Göre Liste & İstatistik</button>
          <button class="filter-tab-btn" data-mode="branches">📚 Branşlara (Derslere) Göre Çöz</button>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <select id="status-filter-select" class="calc-input" style="padding: 0.45rem 0.85rem; font-size: 0.82rem; width: auto; font-weight: 600;">
            <option value="all">Tüm Sınavlar (16 Yıl)</option>
            <option value="in_progress">⏳ Devam Edenler</option>
            <option value="completed">🏆 Tamamlananlar</option>
            <option value="not_started">⚪ Başlanmayanlar</option>
          </select>
        </div>
      </div>

      <!-- Main Dynamic List Container -->
      <div id="exams-mode-content"></div>
    </div>
  `;

  const tabs = container.querySelectorAll('.filter-tab-btn');
  const contentArea = container.querySelector('#exams-mode-content');
  const statusFilterSelect = container.querySelector('#status-filter-select');

  function renderExamRows(filterStatus = 'all') {
    const examStatsList = years.map(yr => store.getExamStats(yr));

    let filteredExams = examStatsList;
    if (filterStatus === 'in_progress') {
      filteredExams = examStatsList.filter(e => e.isStarted && !e.isFinished);
    } else if (filterStatus === 'completed') {
      filteredExams = examStatsList.filter(e => e.isFinished);
    } else if (filterStatus === 'not_started') {
      filteredExams = examStatsList.filter(e => !e.isStarted);
    }

    if (filteredExams.length === 0) {
      contentArea.innerHTML = `
        <div class="question-card" style="text-align: center; padding: 3rem;">
          <p style="color: var(--text-muted);">Bu filtreye uygun sınav bulunamadı.</p>
        </div>
      `;
      return;
    }

    contentArea.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        ${filteredExams.map(stats => {
          const yr = stats.year;
          const isLatest = yr >= 2023;
          
          // Determine status badge
          let statusBadge = `<span class="badge" style="background: var(--bg-surface-elevated); color: var(--text-muted);">⚪ Başlanmadı</span>`;
          if (stats.isFinished) {
            statusBadge = `<span class="badge badge-success">🏆 Tamamlandı</span>`;
          } else if (stats.isStarted) {
            statusBadge = `<span class="badge badge-warning">⏳ Devam Ediyor (${stats.answered}/${stats.total})</span>`;
          }

          return `
            <div class="exam-list-card" id="exam-card-${yr}" style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 1.25rem; transition: all var(--transition-fast);">
              <!-- Top Row: Year Info & Status -->
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="width: 58px; height: 58px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--primary), #06b6d4); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 900; box-shadow: 0 4px 12px var(--primary-glow); flex-shrink: 0;">
                    ${yr}
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                      <h2 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary);">${yr} KPSS Lisans</h2>
                      <span class="badge badge-primary">120 Soru (GY-GK)</span>
                      ${isLatest ? '<span class="badge badge-purple">⭐ Yeni Müfredat</span>' : ''}
                      ${statusBadge}
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Genel Yetenek (60) + Genel Kültür (60)</span>
                  </div>
                </div>

                <!-- Action Buttons Area -->
                <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                  ${!stats.isStarted ? `
                    <button class="btn btn-primary" data-start-exam="${yr}" data-start-index="0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      <span>Sınava Başla</span>
                    </button>
                  ` : stats.isFinished ? `
                    <button class="btn btn-secondary" data-start-exam="${yr}" data-start-index="0">
                      <span>📊 Sonuçları İncele</span>
                    </button>
                    <button class="btn btn-danger" data-reset-exam="${yr}" title="Tüm cevapları sıfırla">
                      🔄 Sınavı Sıfırla
                    </button>
                  ` : `
                    <button class="btn btn-primary" data-start-exam="${yr}" data-start-index="${stats.lastIndex}">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      <span>Kaldığın Yerden Devam Et (Soru ${stats.lastIndex + 1})</span>
                    </button>
                    <button class="btn btn-secondary" data-prompt-restart="${yr}">
                      🔄 Sınavı Sıfırla
                    </button>
                  `}


                  ${stats.wrong > 0 ? `
                    <button class="btn btn-danger" style="padding: 0.65rem 0.85rem;" data-solve-wrongs="${yr}" title="Sadece bu sınavdaki yanlışları çöz">
                      ❌ Yanlışları Çöz (${stats.wrong})
                    </button>
                  ` : ''}

                  <button class="quiz-action-btn" data-toggle-breakdown="${yr}" title="Ders ders detaylı doğru/yanlış tablosunu aç">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <span>Ders Analizi</span>
                  </button>
                </div>
              </div>

              <!-- Stats & Progress Bar Row -->
              <div style="display: grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; align-items: center; background: var(--bg-surface-elevated); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                <!-- Progress bar -->
                <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600;">
                    <span style="color: var(--text-primary);">Sınav İlerlemesi</span>
                    <span style="color: var(--primary);">%${stats.progressPercent} (${stats.answered} / ${stats.total} Soru)</span>
                  </div>
                  <div class="subject-progress-bar" style="height: 9px;">
                    <div class="progress-fill" style="width: ${stats.progressPercent}%; background: ${stats.isFinished ? 'var(--success)' : 'var(--primary)'};"></div>
                  </div>
                </div>

                <!-- Metric Badges -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; text-align: center;">
                  <div style="background: var(--bg-surface); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--success);">${stats.correct}</div>
                    <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted);">DOĞRU</div>
                  </div>

                  <div style="background: var(--bg-surface); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--danger);">${stats.wrong}</div>
                    <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted);">YANLIŞ</div>
                  </div>

                  <div style="background: var(--bg-surface); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-muted);">${stats.empty}</div>
                    <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted);">BOŞ</div>
                  </div>

                  <div style="background: var(--primary-light); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-focus);">
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary);">${stats.net}</div>
                    <div style="font-size: 0.68rem; font-weight: 700; color: var(--primary);">NET</div>
                  </div>
                </div>
              </div>

              <!-- Collapsible Subject Breakdown Accordion -->
              <div id="breakdown-panel-${yr}" style="display: none; padding-top: 0.75rem; border-top: 1px dashed var(--border-color);">
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.75rem;">
                  📊 ${yr} KPSS Branş Dağılımı
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem;">
                  ${Object.entries(stats.subjectBreakdown).map(([name, b]) => {
                    const bNet = (b.correct - (b.wrong * 0.25)).toFixed(2);
                    return `
                      <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.25rem;">
                        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">${name}</span>
                        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
                          <span style="color: var(--success); font-weight: 600;">${b.correct} D</span>
                          <span style="color: var(--danger); font-weight: 600;">${b.wrong} Y</span>
                          <span style="color: var(--primary); font-weight: 700;">${bNet} Net</span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    bindExamListEvents();
  }

  function bindExamListEvents() {
    // Start or resume exam
    contentArea.querySelectorAll('[data-start-exam]').forEach(btn => {
      btn.addEventListener('click', () => {
        const yr = btn.getAttribute('data-start-exam');
        const sIndex = btn.getAttribute('data-start-index');
        window.location.hash = `#pastexams?year=${yr}&startIndex=${sIndex}`;
      });
    });

    // Prompt restart modal
    contentArea.querySelectorAll('[data-prompt-restart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const yr = btn.getAttribute('data-prompt-restart');
        openRestartModal(yr);
      });
    });

    // Reset exam directly
    contentArea.querySelectorAll('[data-reset-exam]').forEach(btn => {
      btn.addEventListener('click', () => {
        const yr = btn.getAttribute('data-reset-exam');
        if (confirm(`${yr} KPSS sınavının tüm çözümlerini sıfırlayıp baştan başlamak istediğinize emin misiniz?`)) {
          store.resetExam(yr);
          window.location.hash = `#pastexams?year=${yr}&startIndex=0`;
        }
      });
    });

    // Solve only wrong questions
    contentArea.querySelectorAll('[data-solve-wrongs]').forEach(btn => {
      btn.addEventListener('click', () => {
        const yr = btn.getAttribute('data-solve-wrongs');
        window.location.hash = `#pastexams?year=${yr}&onlyWrongs=true`;
      });
    });

    // Toggle subject breakdown accordion
    contentArea.querySelectorAll('[data-toggle-breakdown]').forEach(btn => {
      btn.addEventListener('click', () => {
        const yr = btn.getAttribute('data-toggle-breakdown');
        const panel = contentArea.querySelector(`#breakdown-panel-${yr}`);
        if (panel) {
          const isVisible = panel.style.display === 'block';
          panel.style.display = isVisible ? 'none' : 'block';
        }
      });
    });
  }

  function openRestartModal(year) {
    const stats = store.getExamStats(year);
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-overlay active" id="resume-modal-overlay">
        <div class="modal-card" style="max-width: 480px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⏳</div>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">
            ${year} KPSS Sınavına Devam Et
          </h2>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            Bu sınavda daha önce <strong>${stats.answered} soru</strong> çözdünüz. Nasıl devam etmek istersiniz?
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
            <button class="btn btn-primary" id="modal-btn-resume" style="padding: 0.9rem;">
              ▶️ Kaldığım Yerden Devam Et (Soru ${stats.lastIndex + 1})
            </button>
            <button class="btn btn-danger" id="modal-btn-restart" style="padding: 0.9rem;">
              🔄 Sınavı Sıfırla (Cevapları Temizle)
            </button>
            <button class="btn" id="modal-btn-cancel" style="color: var(--text-muted); font-size: 0.85rem;">
              Vazgeç
            </button>

          </div>
        </div>
      </div>
    `;

    const overlay = modalContainer.querySelector('#resume-modal-overlay');
    const resumeBtn = modalContainer.querySelector('#modal-btn-resume');
    const restartBtn = modalContainer.querySelector('#modal-btn-restart');
    const cancelBtn = modalContainer.querySelector('#modal-btn-cancel');

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => { modalContainer.innerHTML = ''; }, 200);
    };

    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    resumeBtn.addEventListener('click', () => {
      closeModal();
      window.location.hash = `#pastexams?year=${year}&startIndex=${stats.lastIndex}`;
    });

    restartBtn.addEventListener('click', () => {
      store.resetExam(year);
      closeModal();
      window.location.hash = `#pastexams?year=${year}&startIndex=0`;
    });
  }

  function showMode(mode) {
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-mode') === mode));

    if (mode === 'years') {
      renderExamRows(statusFilterSelect ? statusFilterSelect.value : 'all');
    } else {
      contentArea.innerHTML = `
        <div class="subject-cards-grid">
          ${branches.map(br => {
            const brQuestions = allQuestions.filter(q => {
              const b = (q.brans || q.subject || '').toLowerCase();
              return b.includes(br.name.toLowerCase()) || br.name.toLowerCase().includes(b);
            });
            let answeredCount = 0;
            brQuestions.forEach(q => { if (store.answers[q.id]) answeredCount++; });
            const progressPct = brQuestions.length > 0 ? Math.round((answeredCount / brQuestions.length) * 100) : 0;

            return `
              <div class="subject-card" data-subject="${br.name}">
                <div class="subject-card-top">
                  <div class="subject-icon-box" style="background: ${br.color}18; color: ${br.color}; font-size: 1.3rem;">
                    ${br.icon}
                  </div>
                  <span class="badge" style="background: ${br.color}20; color: ${br.color};">${brQuestions.length} Soru</span>
                </div>
                <div>
                  <div class="subject-title">${br.name}</div>
                  <div class="subject-meta" style="margin-top: 0.2rem;">${br.desc}</div>
                </div>
                <div class="subject-progress-bar" style="margin-top: 0.75rem;">
                  <div class="progress-fill" style="width: ${progressPct}%; background: ${br.color};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted);">
                  <span>İlerleme</span>
                  <span>%${progressPct} (${answeredCount}/${brQuestions.length})</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      contentArea.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('click', () => {
          const subj = card.getAttribute('data-subject');
          window.location.hash = `#pastexams?subject=${encodeURIComponent(subj)}`;
        });
      });
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      showMode(tab.getAttribute('data-mode'));
    });
  });

  if (statusFilterSelect) {
    statusFilterSelect.addEventListener('change', () => {
      renderExamRows(statusFilterSelect.value);
    });
  }

  showMode('years');
}
