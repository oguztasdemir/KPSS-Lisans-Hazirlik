/**
 * KPSS Lisans Web Uygulaması - Ana Başlatıcı & Koordinatör
 * Paneller (Sidebar, Header, Router, Store) arası entegrasyonu yönetir.
 */

import { store } from './store.js';
import { sidebarPanel } from './panels/sidebarPanel.js';
import { headerPanel } from './panels/headerPanel.js';
import { pomodoroPanel } from './panels/pomodoroPanel.js';
import { Router } from './core/router.js';

class App {
  constructor() {
    this.years = [2009, 2010, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    this.router = new Router('content-area');
  }

  async init() {
    // 1. Temayı uygula
    store.applyTheme(store.settings.theme || 'light');

    // 2. Veri setlerini yükle
    await this.loadAllData();

    // 3. Panelleri başlat
    sidebarPanel.init();
    headerPanel.init();
    pomodoroPanel.init();

    // 4. Sayfa yönlendiricisini (Router) devreye al
    this.router.init();


    console.log('🚀 KPSS Lisans Web Uygulaması başarıyla hazırlandı!');
  }

  async loadAllData() {
    try {
      const branches = ['matematik', 'tarih', 'cografya', 'vatandaslik', 'turkce', 'guncel'];

      // Dataset klasöründen müfredat ve modüler bilgi kartlarını yükle
      const [subjRes, ceRes, ...modularCards] = await Promise.all([
        fetch('Dataset/Mufredat/subjects.json').then(r => r.json()).catch(() => []),
        fetch('Dataset/Mufredat/current_events.json').then(r => r.json()).catch(() => []),
        ...branches.map(b => 
          fetch(`Dataset/Bilgi_Kartlari/${b}.json`)
            .then(r => r.json())
            .catch(() => [])
        )
      ]);

      store.subjects = subjRes;
      store.currentEvents = ceRes;
      
      const flatCards = modularCards.flat().filter(Boolean);
      if (flatCards.length > 0) {
        store.flashcards = flatCards;
      } else {
        store.flashcards = await fetch('Dataset/Mufredat/flashcards.json').then(r => r.json()).catch(() => []);
      }

      // Dataset/Sinav_Sorulari altındaki 16 yılın 120 soruluk sınavlarını yükle
      const questionPromises = this.years.map(yr => 
        fetch(`Dataset/Sinav_Sorulari/${yr}.json`)
          .then(r => r.json())
          .catch(() => [])
      );

      const allYearArrays = await Promise.all(questionPromises);
      store.allQuestions = allYearArrays.flat();
      console.log(`Loaded ${store.allQuestions.length} total questions and ${store.flashcards.length} modular flashcards from Dataset/!`);
    } catch (e) {
      console.error('Error loading dataset:', e);
    }
  }
}

// DOM Hazır olduğunda uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
