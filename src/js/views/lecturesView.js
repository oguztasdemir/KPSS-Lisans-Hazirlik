/**
 * KPSS Lisans GY-GK - Gelişmiş İki Panelli Konu Anlatımı Arayüzü
 * ÖSYM Tuzakları, Hafıza Şifreleri, Çözümlü Örnek Akordeonları,
 * Konu Tamamlama / Çalışıldı Takip Sistemi ve Entegre Soru Çözme CTA'sı.
 */

import { COMPREHENSIVE_LECTURES } from '../data/comprehensiveLectures.js';
import { store } from '../store.js';
import { sound } from '../../utils/sound.js';

export function renderLectures(container) {
  let activeBranch = 'matematik';
  let activeTopicId = 'all';
  let searchTerm = '';

  function updateView() {
    const branchData = COMPREHENSIVE_LECTURES[activeBranch] || COMPREHENSIVE_LECTURES['matematik'];
    const topics = branchData.topics || [];

    // Filter by topic and search term
    let displayTopics = topics;
    if (activeTopicId !== 'all') {
      displayTopics = topics.filter(t => t.id === activeTopicId);
    }
    if (searchTerm) {
      displayTopics = displayTopics.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.html.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    container.innerHTML = `
      <div>
        <div class="view-header">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h1 class="view-title">📖 KPSS Lisans İnteraktif Dershane & Konu Anlatımı</h1>
              <p class="view-subtitle">ÖSYM tuzakları, altın kurallar, akrostiş hafıza şifreleri ve çözümlü pekiştirme soruları.</p>
            </div>
            <button class="btn btn-secondary" id="btn-print-lecture" title="Konu anlatımını A4 formatında PDF olarak kaydet veya yazdır">
              🖨️ PDF / Yazdır
            </button>
          </div>
        </div>

        <!-- =========================================================================
             YAN YANA İKİ PANELLİ SEÇİM ALANI (SOL: DERSLER, SAĞ: KONULAR & ARAMA)
             ========================================================================= -->
        <div class="lectures-control-grid">
          <!-- SOL PANEL: DERS SEÇİMİ -->
          <div class="branch-selector-panel">
            <div class="panel-header-mini">
              <span>📚 Ders Seçimi & İlerleme</span>
            </div>
            <div class="branch-list-vertical">
              ${Object.entries(COMPREHENSIVE_LECTURES).map(([key, item]) => {
                const progress = store.getBranchTopicProgress(key, item.topics || []);
                return `
                  <button class="branch-btn-item ${key === activeBranch ? 'active' : ''}" data-branch="${key}">
                    <span class="branch-btn-icon" style="background: ${item.color}18; color: ${item.color};">
                      ${item.icon}
                    </span>
                    <div class="branch-btn-info" style="flex: 1;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="branch-btn-title">${item.title}</span>
                        <span style="font-size: 0.7rem; font-weight: 700; color: ${progress === 100 ? 'var(--success)' : 'var(--text-muted)'};">%${progress}</span>
                      </div>
                      <div class="subject-progress-bar" style="height: 4px; margin-top: 0.25rem;">
                        <div class="progress-fill" style="width: ${progress}%; background: ${progress === 100 ? 'var(--success)' : item.color};"></div>
                      </div>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- SAĞ PANEL: KONU SEÇİMİ & ARAMA -->
          <div class="topic-selector-panel">
            <div class="topic-panel-top">
              <div class="panel-header-mini" style="margin-bottom: 0;">
                <span>📌 ${branchData.title} Konuları (${topics.length} Ünite)</span>
              </div>
              
              <!-- Search Bar -->
              <div class="lecture-search-wrapper">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-muted); flex-shrink: 0;">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="lecture-search-input" value="${searchTerm}" placeholder="${branchData.title} içinde konu, kural veya formül ara...">
                ${searchTerm ? `<button id="clear-search-btn" style="color: var(--text-muted); font-size: 1.1rem; background: none; border: none; cursor: pointer;">&times;</button>` : ''}
              </div>
            </div>

            <!-- Konu Butonları Grid -->
            <div class="topic-chips-grid">
              <button class="topic-chip-card ${activeTopicId === 'all' ? 'active' : ''}" data-topic-id="all">
                <span class="chip-title">📚 Tüm Konular (${topics.length})</span>
                <span class="chip-sub">Bütün üniteleri alt alta göster</span>
              </button>

              ${topics.map((t, idx) => {
                const isDone = store.isTopicCompleted(`${activeBranch}_${t.id}`);
                return `
                  <button class="topic-chip-card ${activeTopicId === t.id ? 'active' : ''}" data-topic-id="${t.id}">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                      <span class="chip-title">${isDone ? '✅ ' : ''}${t.name}</span>
                      <span class="badge badge-warning" style="font-size: 0.68rem; padding: 0.1rem 0.4rem;">${t.badge}</span>
                    </div>
                    <span class="chip-sub">${branchData.title} • Ünite ${idx + 1}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- =========================================================================
             KONU ANLATIM İÇERİK KARTLARI
             ========================================================================= -->
        <div style="display: flex; flex-direction: column; gap: 1.75rem;" id="lecture-cards-container">
          ${displayTopics.length === 0 ? `
            <div class="question-card" style="text-align: center; padding: 3rem;">
              <p style="color: var(--text-muted);">Aramanıza uygun konu bulunamadı.</p>
            </div>
          ` : displayTopics.map((topic, idx) => {
            const topicKey = `${activeBranch}_${topic.id}`;
            const isCompleted = store.isTopicCompleted(topicKey);

            return `
              <div class="lecture-card" style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);">
                <!-- Card Header -->
                <div style="padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface-elevated); border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: ${branchData.color}20; color: ${branchData.color}; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.15rem;">
                      ${idx + 1}
                    </div>
                    <div>
                      <h2 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary);">${topic.name}</h2>
                      <span style="font-size: 0.75rem; color: var(--text-muted);">${branchData.title} • KPSS Lisans</span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                    <span class="badge badge-warning" style="font-size: 0.78rem;">${topic.badge}</span>
                    <button class="topic-progress-btn ${isCompleted ? 'completed' : ''}" data-topic-toggle="${topicKey}">
                      <span>${isCompleted ? '✅ Çalışıldı' : '⚪ Tamamlandı Olarak İşaretle'}</span>
                    </button>
                  </div>
                </div>

                <!-- Card Body Content -->
                <div style="padding: 1.75rem;">
                  ${topic.html}

                  <!-- Bottom Question Action Banner -->
                  <div style="margin-top: 2rem; padding: 1.25rem 1.5rem; background: var(--bg-surface-elevated); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div>
                      <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">🎯 Bu Konuyu Pekiştir</div>
                      <div style="font-size: 0.82rem; color: var(--text-muted);">Öğrendiklerinizi test etmek için ${branchData.title} çıkmış sorularını hemen çözün.</div>
                    </div>
                    <a href="#pastexams?subject=${encodeURIComponent(branchData.title)}" class="btn btn-primary" style="padding: 0.7rem 1.3rem;">
                      🚀 ${branchData.title} Çıkmış Sorularını Çöz &rarr;
                    </a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // 1. Sol Panel: Ders Seçimi
    container.querySelectorAll('[data-branch]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeBranch = btn.getAttribute('data-branch');
        activeTopicId = 'all';
        searchTerm = '';
        updateView();
      });
    });

    // 2. Sağ Panel: Konu Seçimi
    container.querySelectorAll('[data-topic-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTopicId = btn.getAttribute('data-topic-id');
        updateView();
      });
    });

    // 3. Konu Tamamlama / Çalışıldı Butonu
    container.querySelectorAll('[data-topic-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-topic-toggle');
        const isNowDone = store.toggleTopicCompleted(key);
        if (isNowDone && store.settings.soundEnabled) {
          sound.playCorrect();
        }
        updateView();
      });
    });

    // 4. Sağ Panel: Arama Çubuğu
    const searchInput = container.querySelector('#lecture-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.trim();
        updateView();
        const reInput = container.querySelector('#lecture-search-input');
        if (reInput) {
          reInput.focus();
          reInput.setSelectionRange(reInput.value.length, reInput.value.length);
        }
      });
    }

    const clearBtn = container.querySelector('#clear-search-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchTerm = '';
        updateView();
      });
    }

    // 5. PDF / Yazdır Butonu
    const printBtn = container.querySelector('#btn-print-lecture');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  updateView();
}
