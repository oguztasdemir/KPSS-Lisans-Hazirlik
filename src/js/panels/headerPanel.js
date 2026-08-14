/**
 * Üst Panel (Header) Yönetim Modülü
 * Canlı sınav geri sayımı, tema değiştirici (Dark/Light),
 * Hata Defteri & Gelişim PDF Raporu ve hızlı arama tetikleyicisi.
 */

import { store } from '../store.js';
import { startCountdown } from '../../utils/countdown.js';
import { SearchModal } from './searchModal.js';

export class HeaderPanel {
  constructor() {
    this.breadcrumbRoot = document.querySelector('.breadcrumb-root');
    this.breadcrumbCurrent = document.getElementById('breadcrumb-current');
    this.headerCountdownBadge = document.getElementById('header-countdown-badge');
    this.headerDaysEl = document.getElementById('header-countdown-days');
    this.themeBtn = document.getElementById('theme-toggle-btn');
    this.backupBtn = document.getElementById('header-backup-btn');
    this.searchBtn = document.getElementById('search-trigger-btn');
  }

  init() {
    this.initCountdown();
    this.bindEvents();
  }

  initCountdown() {
    const examDate = store.settings.examDate || '2026-09-06T10:15:00';
    startCountdown(examDate, ({ days, isPassed }) => {
      if (this.headerDaysEl) {
        this.headerDaysEl.textContent = isPassed ? 'Sınav Günü' : `${days} Gün Kaldı`;
      }
    });

    if (this.headerCountdownBadge) {
      this.headerCountdownBadge.addEventListener('click', () => {
        window.location.hash = '#dashboard';
      });
    }
  }

  bindEvents() {
    // Theme Toggle
    if (this.themeBtn) {
      this.themeBtn.addEventListener('click', () => {
        const nextTheme = store.settings.theme === 'dark' ? 'light' : 'dark';
        store.updateSettings({ theme: nextTheme });
      });
    }

    // Quick PDF Report & Mistakes Exporter
    if (this.backupBtn) {
      this.backupBtn.addEventListener('click', () => {
        this.openPdfReportModal();
      });
    }

    // Quick Search Trigger
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => SearchModal.open());
    }

    // Global Search Shortcuts (Ctrl+K or /)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        SearchModal.open();
      }
    });
  }

  openPdfReportModal() {
    const stats = store.getStatistics();
    const wrongIds = store.wrongQuestionIds || [];
    const allQuestions = store.allQuestions || [];
    const wrongQuestions = allQuestions.filter(q => wrongIds.includes(q.id));
    const nowStr = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-overlay active" id="pdf-report-overlay" style="z-index: 9999;">
        <div class="modal-card" style="max-width: 850px; max-height: 90vh; overflow-y: auto; padding: 2rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <div>
              <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">
                📄 KPSS Lisans Hata & İlerleme PDF Raporu
              </h2>
              <span style="font-size: 0.82rem; color: var(--text-muted);">Rapor Tarihi: ${nowStr}</span>
            </div>
            <button id="modal-close-pdf-btn" style="font-size: 1.5rem; color: var(--text-muted); background: none; border: none; cursor: pointer;">&times;</button>
          </div>

          <!-- Quick Metrics Bar -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; text-align: center;">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Toplam Çözülen</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary);">${stats.totalSolved}</div>
            </div>
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; text-align: center;">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Başarı Oranı</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--success);">%${stats.accuracyRate}</div>
            </div>
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; text-align: center;">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Hata Defteri</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--danger);">${wrongQuestions.length} Soru</div>
            </div>
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; text-align: center;">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Tahmini KPSS P3</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--purple);">${stats.p3Score}</div>
            </div>
          </div>

          <!-- Wrong Questions Section -->
          <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
              <span>❌ Yanlış Yapılan Sorular ve Detaylı Çözümleri (${wrongQuestions.length})</span>
            </div>

            ${wrongQuestions.length === 0 ? `
              <div style="text-align: center; padding: 2rem; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
                <div style="font-weight: 700; color: var(--text-primary);">Tebrikler! Hata defterinizde soru bulunmamaktadır.</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Çözdüğünüz sınavlarda yanlış yaptıkça sorular detaylı çözümleriyle burada listelenecektir.</div>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${wrongQuestions.map((q, idx) => {
                  const year = q.yil || q.year || '';
                  const branch = q.brans || q.subject || '';
                  const topic = q.konu || q.topic || '';
                  const text = (q.soruMetni || '').replace(/\n/g, '<br>');
                  const userAns = store.answers[q.id]?.selected || '-';
                  const correctAns = q.dogruCevap || '';
                  const expl = q.aciklama?.netOzet || 'Çözüm açıklaması hazırlanmıştır.';

                  return `
                    <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-left: 4px solid var(--danger); border-radius: var(--radius-md); padding: 1.15rem 1.35rem;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.4rem;">
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                          <span class="badge badge-danger">#${idx + 1}</span>
                          <span class="badge badge-primary">${year} KPSS</span>
                          <span class="badge badge-purple">${branch}</span>
                          <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">${topic}</span>
                        </div>
                        <div style="font-size: 0.82rem; font-weight: 700;">
                          <span style="color: var(--danger);">İşaretlediğiniz: <strong>${userAns}</strong></span> | 
                          <span style="color: var(--success);">Doğru Cevap: <strong>${correctAns}</strong></span>
                        </div>
                      </div>

                      <div style="font-size: 0.92rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 0.75rem;">
                        ${text}
                      </div>

                      <!-- Options List -->
                      ${q.secenekler ? `
                        <div style="display: grid; grid-template-columns: 1fr; gap: 0.35rem; margin-bottom: 0.75rem; font-size: 0.85rem;">
                          ${q.secenekler.map(opt => `
                            <div style="padding: 0.35rem 0.65rem; border-radius: var(--radius-sm); background: ${opt.anahtar === correctAns ? 'rgba(16, 185, 129, 0.12)' : opt.anahtar === userAns ? 'rgba(239, 68, 68, 0.12)' : 'transparent'}; border: 1px solid ${opt.anahtar === correctAns ? 'var(--success)' : opt.anahtar === userAns ? 'var(--danger)' : 'var(--border-subtle)'};">
                              <strong>${opt.anahtar})</strong> ${opt.metin}
                            </div>
                          `).join('')}
                        </div>
                      ` : ''}

                      <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid var(--success); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem; line-height: 1.5; color: var(--text-primary);">
                        <strong>💡 ÖSYM Çözüm Özeti:</strong> ${expl}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- Modal Bottom Controls -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <button class="btn btn-secondary" id="btn-export-json-fallback" style="font-size: 0.85rem;">
              💾 Ham JSON Yedeğini İndir
            </button>
            <div style="display: flex; gap: 0.75rem;">
              <button class="btn btn-secondary" id="btn-close-pdf-modal">Kapat</button>
              <button class="btn btn-primary" id="btn-trigger-print-report" style="font-weight: 800; padding: 0.75rem 1.5rem;">
                🖨️ PDF Olarak Kaydet / Yazdır
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const overlay = modalContainer.querySelector('#pdf-report-overlay');
    const closeX = modalContainer.querySelector('#modal-close-pdf-btn');
    const closeBtn = modalContainer.querySelector('#btn-close-pdf-modal');
    const printBtn = modalContainer.querySelector('#btn-trigger-print-report');
    const jsonBtn = modalContainer.querySelector('#btn-export-json-fallback');

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => { modalContainer.innerHTML = ''; }, 200);
    };

    if (closeX) closeX.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    if (jsonBtn) {
      jsonBtn.addEventListener('click', () => {
        store.exportBackup();
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  setBreadcrumb(title, section = 'KPSS 2026') {
    if (this.breadcrumbRoot) this.breadcrumbRoot.textContent = section;
    if (this.breadcrumbCurrent) this.breadcrumbCurrent.textContent = title;
  }
}

export const headerPanel = new HeaderPanel();
