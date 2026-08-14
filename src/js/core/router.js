/**
 * Rota ve Görünüm Yönlendirici (Router Modülü)
 * Hash tabanlı sayfa yönlendirmesi, parametre ayrıştırma ve panel güncellemeleri.
 */

import { sidebarPanel } from '../panels/sidebarPanel.js';
import { headerPanel } from '../panels/headerPanel.js';

import { renderDashboard } from '../views/dashboardView.js';
import { renderPastExams } from '../views/pastExamsView.js';
import { renderExamSimulator } from '../views/examSimulatorView.js';
import { renderQuestionBank } from '../views/questionBankView.js';

import { renderLectures } from '../views/lecturesView.js';
import { renderFlashcards } from '../views/flashcardsView.js';
import { renderCurrentEvents } from '../views/currentEventsView.js';
import { renderWrongNotebook } from '../views/wrongNotebookView.js';
import { renderFavorites } from '../views/favoritesView.js';
import { renderNotes } from '../views/notesView.js';
import { renderStats } from '../views/statsView.js';
import { renderScoreCalc } from '../views/scoreCalcView.js';
import { renderSettings } from '../views/settingsView.js';

export class Router {
  constructor(contentContainerId = 'content-area') {
    this.container = document.getElementById(contentContainerId);
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const rawHash = window.location.hash.slice(1) || 'dashboard';
    const [path, queryString] = rawHash.split('?');
    const params = new URLSearchParams(queryString || '');
    const paramObj = Object.fromEntries(params.entries());

    // Update active nav indicators in sidebar & mobile bottom bar
    sidebarPanel.setActive(path);

    switch (path) {
      case 'dashboard':
        headerPanel.setBreadcrumb('Ana Ekran');
        renderDashboard(this.container);
        break;

      case 'pastexams':
        headerPanel.setBreadcrumb('Çıkmış Sorular');
        renderPastExams(this.container, paramObj);
        break;

      case 'simulator':
        headerPanel.setBreadcrumb('130 Dk Sınav Simülatörü');
        renderExamSimulator(this.container, paramObj);
        break;


      case 'questionbank':
        headerPanel.setBreadcrumb('Soru Bankası');
        renderQuestionBank(this.container, paramObj);
        break;

      case 'lectures':
        headerPanel.setBreadcrumb('Konu Anlatımı & Formüller');
        renderLectures(this.container);
        break;

      case 'flashcards':
        headerPanel.setBreadcrumb('Bilgi Kartları (Hafıza)');
        renderFlashcards(this.container);
        break;

      case 'currentevents':
        headerPanel.setBreadcrumb('Güncel Bilgiler');
        renderCurrentEvents(this.container);
        break;

      case 'wrongnotebook':
        headerPanel.setBreadcrumb('Hata Defteri (Yanlışlar)');
        renderWrongNotebook(this.container);
        break;

      case 'favorites':
        headerPanel.setBreadcrumb('Favori Sorularım');
        renderFavorites(this.container);
        break;

      case 'notes':
        headerPanel.setBreadcrumb('Notlarım');
        renderNotes(this.container);
        break;

      case 'stats':
        headerPanel.setBreadcrumb('İstatistik & Analiz');
        renderStats(this.container);
        break;

      case 'scorecalc':
        headerPanel.setBreadcrumb('Puan & Net Hesaplama');
        renderScoreCalc(this.container);
        break;

      case 'settings':
        headerPanel.setBreadcrumb('Ayarlar & JSON Yedek');
        renderSettings(this.container);
        break;

      default:
        headerPanel.setBreadcrumb('Ana Ekran');
        renderDashboard(this.container);
        break;
    }

    if (this.container) {
      this.container.scrollTop = 0;
    }
  }
}
