/**
 * ⏱️ 130 Dakika Gerçek KPSS Lisans Sınav Simülatörü
 * 120 soru, 130 dakika geri sayım, optik form cevap kağıdı ve sınav sonu detaylı KPSS P3 karnesi.
 */

import { store } from '../store.js';
import { sound } from '../../utils/sound.js';

export function renderExamSimulator(container, params = {}) {
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010, 2009];
  let selectedYear = parseInt(params.year, 10) || 2025;
  let isRunning = false;
  let isFinished = false;
  let timerInterval = null;
  let remainingSeconds = 130 * 60; // 130 minutes = 7800s
  let currentQuestionIndex = 0;
  let simAnswers = {}; // { [questionId]: 'A' | 'B' | ... }
  let examQuestions = [];

  function loadExamQuestions() {
    examQuestions = store.allQuestions.filter(q => (q.yil || q.year) === selectedYear);
    if (examQuestions.length === 0) {
      examQuestions = store.allQuestions.slice(0, 120);
    }
  }

  function formatTime(secs) {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function calculateScore(gyNet, gkNet) {
    // Standard KPSS P3 Formula Approximation:
    // Base 40 + (GY_Net * 0.5) + (GK_Net * 0.5) scaled to 100 max
    const totalNet = gyNet + gkNet;
    const score = 40 + (gyNet * 0.52) + (gkNet * 0.48);
    return Math.min(100, Math.max(40, score)).toFixed(3);
  }

  function startExam() {
    loadExamQuestions();
    isRunning = true;
    isFinished = false;
    simAnswers = {};
    currentQuestionIndex = 0;
    remainingSeconds = 130 * 60;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        updateTimerDisplay();
      } else {
        finishExam();
      }
    }, 1000);

    renderSimActive();
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById('sim-timer-display');
    if (timerEl) {
      timerEl.textContent = formatTime(remainingSeconds);
      if (remainingSeconds < 600) {
        timerEl.style.color = 'var(--danger)';
        timerEl.classList.add('pulse');
      }
    }
  }

  function finishExam() {
    clearInterval(timerInterval);
    isRunning = false;
    isFinished = true;
    sound.playFinish();

    // Calculate score
    let gyD = 0, gyY = 0, gyB = 0;
    let gkD = 0, gkY = 0, gkB = 0;
    const subjectStats = {};

    examQuestions.forEach((q, idx) => {
      const isGY = idx < 60;
      const userAns = simAnswers[q.id];
      const correct = q.dogruCevap || q.correctAnswer;
      const subj = q.brans || q.subject || 'Genel';

      if (!subjectStats[subj]) subjectStats[subj] = { d: 0, y: 0, b: 0 };

      if (!userAns) {
        if (isGY) gyB++; else gkB++;
        subjectStats[subj].b++;
      } else if (userAns === correct) {
        if (isGY) gyD++; else gkD++;
        subjectStats[subj].d++;
      } else {
        if (isGY) gyY++; else gkY++;
        subjectStats[subj].y++;
      }
    });

    const gyNet = Math.max(0, gyD - (gyY * 0.25));
    const gkNet = Math.max(0, gkD - (gkY * 0.25));
    const totalNet = (gyNet + gkNet).toFixed(2);
    const p3Score = calculateScore(gyNet, gkNet);

    renderReportCard({
      gyD, gyY, gyB, gyNet: gyNet.toFixed(2),
      gkD, gkY, gkB, gkNet: gkNet.toFixed(2),
      totalNet, p3Score, subjectStats
    });
  }

  function renderLobby() {
    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <div class="view-header">
          <h1 class="view-title">⏱️ KPSS Lisans Gerçek Sınav Simülatörü</h1>
          <p class="view-subtitle">ÖSYM standartlarında 120 Soru, 130 Dakika, optik işaretleme ve resmi sınav karnesi.</p>
        </div>

        <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; box-shadow: var(--shadow-md); margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <div style="width: 50px; height: 50px; border-radius: var(--radius-md); background: rgba(99, 102, 241, 0.15); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.6rem;">
              ⏳
            </div>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">Sınav Kuralları & Yönerge</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Lütfen sınava başlamadan önce yönergeleri dikkatlice okuyunuz.</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: center;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Soru Sayısı</span>
              <div style="font-size: 1.4rem; font-weight: 900; color: var(--primary);">120 Soru</div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">60 GY + 60 GK</span>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: center;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Sınav Süresi</span>
              <div style="font-size: 1.4rem; font-weight: 900; color: var(--purple);">130 Dakika</div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Geri Sayım Modu</span>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: center;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Net Hesaplama</span>
              <div style="font-size: 1.4rem; font-weight: 900; color: var(--danger);">4 Yanlış 1 Doğru</div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">ÖSYM Net Standardı</span>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: center;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Puan Türü</span>
              <div style="font-size: 1.4rem; font-weight: 900; color: var(--success);">KPSS P3</div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Lisans B Grubu Puanı</span>
            </div>
          </div>

          <div class="alert-box tip" style="margin-bottom: 2rem;">
            <strong>ℹ️ Simülasyon Esnasında:</strong> Doğru/yanlış cevaplar ve açıklamalar sınav bitene kadar gizlenir. Sınav bittiğinde detaylı karneniz ve KPSS P3 puanınız hesaplanır.
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <label style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Sınav Yılı:</label>
              <select id="sim-year-select" style="padding: 0.6rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-elevated); color: var(--text-primary); font-weight: 700;">
                ${years.map(y => `<option value="${y}" ${y === selectedYear ? 'selected' : ''}>${y} KPSS Lisans (120 Soru)</option>`).join('')}
              </select>
            </div>

            <button class="btn btn-primary" id="btn-start-simulation" style="padding: 0.85rem 2rem; font-size: 1.05rem; font-weight: 800; box-shadow: 0 4px 15px var(--primary-glow);">
              🚀 130 Dk Sınavı Başlat
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#sim-year-select')?.addEventListener('change', (e) => {
      selectedYear = parseInt(e.target.value, 10);
    });

    container.querySelector('#btn-start-simulation')?.addEventListener('click', () => {
      sound.playClick();
      startExam();
    });
  }

  function renderSimActive() {
    const q = examQuestions[currentQuestionIndex];
    if (!q) return;

    const displayNum = currentQuestionIndex + 1;
    const isGY = currentQuestionIndex < 60;
    const currentAns = simAnswers[q.id];
    const options = (q.secenekler || q.options || []).map(opt => ({
      key: opt.anahtar || opt.key,
      text: opt.metin || opt.text || ''
    }));

    container.innerHTML = `
      <div class="sim-wrapper" style="display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; align-items: start; max-width: 1200px; margin: 0 auto;">
        <!-- Left: Question Area -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Top Control Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); padding: 0.85rem 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-primary">${selectedYear} KPSS</span>
              <span class="badge ${isGY ? 'badge-purple' : 'badge-warning'}">${isGY ? 'Genel Yetenek' : 'Genel Kültür'}</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">${q.brans || q.subject}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.4rem; background: var(--bg-surface-elevated); padding: 0.4rem 0.85rem; border-radius: var(--radius-md); border: 1.5px solid var(--border-color);">
                <span style="font-size: 1.1rem;">⏱️</span>
                <span id="sim-timer-display" style="font-family: monospace; font-size: 1.15rem; font-weight: 900; color: var(--primary);">
                  ${formatTime(remainingSeconds)}
                </span>
              </div>

              <button class="btn btn-danger" id="btn-finish-simulation" style="padding: 0.45rem 0.9rem; font-size: 0.85rem;">
                🏁 Sınavı Bitir
              </button>
            </div>
          </div>

          <!-- Question Card -->
          <div class="question-card" style="padding: 1.75rem;">
            <div class="question-header">
              <span class="question-number-badge">Soru ${displayNum} / 120</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${q.konu || q.topic}</span>
            </div>

            <div class="question-body" style="font-size: 1.05rem; line-height: 1.75;">${q.soruMetni || q.questionText}</div>

            <!-- Options (Real Exam Mode: Selection without instant correct/wrong reveal) -->
            <div class="options-grid">
              ${options.map(opt => {
                const isSelected = currentAns === opt.key;
                return `
                  <div class="option-item ${isSelected ? 'selected' : ''}" data-sim-opt="${opt.key}" style="${isSelected ? 'border-color: var(--primary); background: var(--primary-light);' : ''}">
                    <div class="option-key" style="${isSelected ? 'background: var(--primary); color: #fff; border-color: var(--primary);' : ''}">
                      ${opt.key}
                    </div>
                    <div class="option-text">${opt.text}</div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Navigation Controls -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem; margin-top: 0.5rem;">
              <button class="btn btn-secondary" id="btn-sim-prev" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                ⬅ Önceki Soru
              </button>

              <button class="btn btn-secondary" id="btn-sim-clear" style="font-size: 0.82rem; color: var(--text-muted);">
                🗑️ Seçimi Temizle
              </button>

              <button class="btn btn-primary" id="btn-sim-next">
                ${currentQuestionIndex === 119 ? '🏁 Sınavı Bitir' : 'Sonraki Soru ➡'}
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Optical Form Navigator -->
        <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; max-height: calc(100vh - 120px); position: sticky; top: 80px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; font-weight: 800; color: var(--text-primary);">📝 Optik Cevap Listesi</span>
            <span class="badge badge-success" style="font-size: 0.72rem;">
              ${Object.keys(simAnswers).length} / 120 İşaretlendi
            </span>
          </div>

          <div style="overflow-y: auto; flex: 1; display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.4rem; padding-right: 0.25rem;">
            ${examQuestions.map((item, i) => {
              const ans = simAnswers[item.id];
              const isCurrent = i === currentQuestionIndex;
              let btnStyle = 'background: var(--bg-surface-elevated); border: 1px solid var(--border-color); color: var(--text-secondary);';

              if (isCurrent) {
                btnStyle = 'background: var(--primary); color: #fff; font-weight: 900; border-color: var(--primary); box-shadow: 0 0 8px var(--primary-glow);';
              } else if (ans) {
                btnStyle = 'background: rgba(16, 185, 129, 0.18); border-color: var(--success); color: var(--success); font-weight: 800;';
              }

              return `
                <button class="sim-grid-btn" data-jump-index="${i}" style="height: 36px; border-radius: var(--radius-sm); font-size: 0.78rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; ${btnStyle}">
                  <span>${i + 1}</span>
                  ${ans ? `<span style="font-size: 0.65rem; line-height: 1;">${ans}</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    bindActiveEvents();
  }

  function bindActiveEvents() {
    // Option Click
    container.querySelectorAll('[data-sim-opt]').forEach(item => {
      item.addEventListener('click', () => {
        const key = item.getAttribute('data-sim-opt');
        const q = examQuestions[currentQuestionIndex];
        simAnswers[q.id] = key;
        sound.playClick();
        renderSimActive();
      });
    });

    // Clear Selection
    container.querySelector('#btn-sim-clear')?.addEventListener('click', () => {
      const q = examQuestions[currentQuestionIndex];
      delete simAnswers[q.id];
      renderSimActive();
    });

    // Prev Button
    container.querySelector('#btn-sim-prev')?.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderSimActive();
      }
    });

    // Next Button
    container.querySelector('#btn-sim-next')?.addEventListener('click', () => {
      if (currentQuestionIndex < 119) {
        currentQuestionIndex++;
        renderSimActive();
      } else {
        if (confirm('Sınavı sonlandırmak ve karnenizi görmek istiyor musunuz?')) {
          finishExam();
        }
      }
    });

    // Finish Early Button
    container.querySelector('#btn-finish-simulation')?.addEventListener('click', () => {
      const unanswered = 120 - Object.keys(simAnswers).length;
      const msg = unanswered > 0 
        ? `Henüz ${unanswered} adet boş sorunuz var. Sınavı bitirmek istiyor musunuz?`
        : 'Sınavı bitirip sonuç karnenizi görmek istiyor musunuz?';
      if (confirm(msg)) {
        finishExam();
      }
    });

    // Jump to index
    container.querySelectorAll('[data-jump-index]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentQuestionIndex = parseInt(btn.getAttribute('data-jump-index'), 10);
        renderSimActive();
      });
    });
  }

  function renderReportCard(report) {
    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <div class="view-header" style="text-align: center; margin-bottom: 1.5rem;">
          <h1 class="view-title">🎓 ${selectedYear} KPSS Lisans Sınav Karnesi</h1>
          <p class="view-subtitle">130 dakikalık gerçek sınav simülasyonu resmi puan ve net dökümünüz.</p>
        </div>

        <!-- Score Hero Card -->
        <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15)); border: 2px solid var(--primary); border-radius: var(--radius-xl); padding: 2rem; text-align: center; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.15);">
          <span style="font-size: 0.9rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em;">Tahmini KPSS Lisans P3 Puanı</span>
          <div style="font-size: 3.5rem; font-weight: 900; color: var(--text-primary); line-height: 1.1; margin: 0.5rem 0;">
            ${report.p3Score}
          </div>
          <p style="font-size: 0.95rem; color: var(--text-secondary);">
            Toplam <strong>${report.totalNet} Net</strong> / 120 Soru (${report.gyD + report.gkD} Doğru, ${report.gyY + report.gkY} Yanlış, ${report.gyB + report.gkB} Boş)
          </p>
        </div>

        <!-- Detailed Breakdown Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 2rem;">
          <!-- GY Box -->
          <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.6rem; margin-bottom: 0.85rem;">
              <span style="font-weight: 800; color: var(--purple);">📚 Genel Yetenek (60 Soru)</span>
              <span class="badge badge-purple" style="font-size: 0.9rem;">${report.gyNet} Net</span>
            </div>
            <div style="display: flex; justify-content: space-around; font-size: 0.9rem;">
              <span style="color: var(--success); font-weight: 700;">✅ ${report.gyD} Doğru</span>
              <span style="color: var(--danger); font-weight: 700;">❌ ${report.gyY} Yanlış</span>
              <span style="color: var(--text-muted); font-weight: 700;">⚪ ${report.gyB} Boş</span>
            </div>
          </div>

          <!-- GK Box -->
          <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.6rem; margin-bottom: 0.85rem;">
              <span style="font-weight: 800; color: var(--warning);">🌍 Genel Kültür (60 Soru)</span>
              <span class="badge badge-warning" style="font-size: 0.9rem;">${report.gkNet} Net</span>
            </div>
            <div style="display: flex; justify-content: space-around; font-size: 0.9rem;">
              <span style="color: var(--success); font-weight: 700;">✅ ${report.gkD} Doğru</span>
              <span style="color: var(--danger); font-weight: 700;">❌ ${report.gkY} Yanlış</span>
              <span style="color: var(--text-muted); font-weight: 700;">⚪ ${report.gkB} Boş</span>
            </div>
          </div>
        </div>

        <!-- Subject Table -->
        <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-primary);">📊 Ders Bazında Başarı Dağılımı</h3>
          <table class="lecture-table">
            <thead>
              <tr>
                <th>Ders</th>
                <th>Doğru</th>
                <th>Yanlış</th>
                <th>Boş</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(report.subjectStats).map(([subj, s]) => {
                const net = Math.max(0, s.d - (s.y * 0.25)).toFixed(2);
                return `
                  <tr>
                    <td><strong>${subj}</strong></td>
                    <td style="color: var(--success); font-weight: 700;">${s.d}</td>
                    <td style="color: var(--danger); font-weight: 700;">${s.y}</td>
                    <td style="color: var(--text-muted);">${s.b}</td>
                    <td><span class="badge badge-primary">${net}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" id="btn-review-with-solutions" style="padding: 0.9rem 1.75rem;">
            🔍 Soruları & Çözümleri İncele
          </button>
          <button class="btn btn-secondary" id="btn-restart-simulator" style="padding: 0.9rem 1.75rem;">
            🔄 Yeni Simülasyon Başlat
          </button>
        </div>
      </div>
    `;

    container.querySelector('#btn-review-with-solutions')?.addEventListener('click', () => {
      window.location.hash = `#pastexams?year=${selectedYear}`;
    });

    container.querySelector('#btn-restart-simulator')?.addEventListener('click', () => {
      renderLobby();
    });
  }

  renderLobby();
}
