/**
 * 🍅 Entegre KPSS Pomodoro Çalışma Zamanlayıcısı
 * 25 dk Odak / 5 dk Mola / 50 dk Derin Çalışma modları, ses efektleri ve bildirimler.
 */

import { sound } from '../../utils/sound.js';

export class PomodoroPanel {
  constructor() {
    this.modes = {
      focus: { label: '25 dk Odak', duration: 25 * 60 },
      shortBreak: { label: '5 dk Mola', duration: 5 * 60 },
      deepWork: { label: '50 dk Derin Çalışma', duration: 50 * 60 }
    };
    this.currentMode = 'focus';
    this.remainingSeconds = this.modes.focus.duration;
    this.isRunning = false;
    this.timerInterval = null;
    this.totalCompletedSessions = 0;
  }

  init() {
    this.renderFloatingWidget();
  }

  formatTime(secs) {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  renderFloatingWidget() {
    let widgetEl = document.getElementById('pomodoro-floating-widget');
    if (!widgetEl) {
      widgetEl = document.createElement('div');
      widgetEl.id = 'pomodoro-floating-widget';
      document.body.appendChild(widgetEl);
    }

    widgetEl.innerHTML = `
      <div class="pomodoro-pill" id="pomodoro-toggle-btn" title="Pomodoro Odak Sayacını Aç/Kapat">
        <span class="pomo-icon">🍅</span>
        <span class="pomo-timer" id="pomo-pill-timer">${this.formatTime(this.remainingSeconds)}</span>
        <span class="pomo-dot ${this.isRunning ? 'running' : ''}"></span>
      </div>

      <div class="pomodoro-modal" id="pomodoro-popup">
        <div class="pomo-modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">🍅</span>
            <span style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary);">KPSS Odak Sayacı</span>
          </div>
          <button id="pomo-close-btn" style="background: none; border: none; font-size: 1.1rem; color: var(--text-muted); cursor: pointer;">&times;</button>
        </div>

        <div class="pomo-modes">
          <button class="pomo-mode-btn ${this.currentMode === 'focus' ? 'active' : ''}" data-mode="focus">25 Dk Odak</button>
          <button class="pomo-mode-btn ${this.currentMode === 'shortBreak' ? 'active' : ''}" data-mode="shortBreak">5 Dk Mola</button>
          <button class="pomo-mode-btn ${this.currentMode === 'deepWork' ? 'active' : ''}" data-mode="deepWork">50 Dk Blok</button>
        </div>

        <div class="pomo-big-clock" id="pomo-big-clock">
          ${this.formatTime(this.remainingSeconds)}
        </div>

        <div class="pomo-controls">
          <button class="btn btn-primary" id="pomo-start-btn" style="flex: 1; padding: 0.75rem;">
            ${this.isRunning ? '⏸️ Duraklat' : '▶️ Başlat'}
          </button>
          <button class="btn btn-secondary" id="pomo-reset-btn" style="padding: 0.75rem;">
            🔄 Sıfırla
          </button>
        </div>

        <div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 0.75rem;">
          Tamamlanan Odak Oturumu: <strong style="color: var(--success);">${this.totalCompletedSessions}</strong>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const pill = document.getElementById('pomodoro-toggle-btn');
    const popup = document.getElementById('pomodoro-popup');
    const closeBtn = document.getElementById('pomo-close-btn');
    const startBtn = document.getElementById('pomo-start-btn');
    const resetBtn = document.getElementById('pomo-reset-btn');

    pill?.addEventListener('click', () => {
      popup?.classList.toggle('active');
    });

    closeBtn?.addEventListener('click', () => {
      popup?.classList.remove('active');
    });

    startBtn?.addEventListener('click', () => {
      this.toggleTimer();
    });

    resetBtn?.addEventListener('click', () => {
      this.resetTimer();
    });

    document.querySelectorAll('.pomo-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        this.setMode(mode);
      });
    });
  }

  setMode(mode) {
    if (!this.modes[mode]) return;
    this.currentMode = mode;
    this.remainingSeconds = this.modes[mode].duration;
    if (this.isRunning) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
    }
    this.updateDisplays();
    document.querySelectorAll('.pomo-mode-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });
  }

  toggleTimer() {
    if (this.isRunning) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
    } else {
      this.isRunning = true;
      sound.playClick();
      this.timerInterval = setInterval(() => {
        if (this.remainingSeconds > 0) {
          this.remainingSeconds--;
          this.updateDisplays();
        } else {
          this.completeSession();
        }
      }, 1000);
    }
    this.updateDisplays();
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.remainingSeconds = this.modes[this.currentMode].duration;
    this.updateDisplays();
  }

  completeSession() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.totalCompletedSessions++;
    sound.playFinish();
    alert('🎉 Tebrikler! Odaklanma oturumunuz tamamlandı.');
    this.setMode(this.currentMode === 'focus' ? 'shortBreak' : 'focus');
  }

  updateDisplays() {
    const text = this.formatTime(this.remainingSeconds);
    const pillTimer = document.getElementById('pomo-pill-timer');
    const bigClock = document.getElementById('pomo-big-clock');
    const startBtn = document.getElementById('pomo-start-btn');
    const pillDot = document.querySelector('.pomo-dot');

    if (pillTimer) pillTimer.textContent = text;
    if (bigClock) bigClock.textContent = text;
    if (startBtn) startBtn.textContent = this.isRunning ? '⏸️ Duraklat' : '▶️ Başlat';
    if (pillDot) pillDot.classList.toggle('running', this.isRunning);
  }
}

export const pomodoroPanel = new PomodoroPanel();
