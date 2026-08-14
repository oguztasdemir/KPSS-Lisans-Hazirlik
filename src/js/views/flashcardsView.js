/**
 * Bilgi Kartları (Flashcards) View
 * Branş bazlı filtreleme, kart tamamlama ekranı ve döngüsüz (tek seferlik) kart akışı.
 */

import { store } from '../store.js';
import { sound } from '../../utils/sound.js';

export function renderFlashcards(container) {
  const allCards = store.flashcards || [];
  let activeBranch = 'all';
  let currentIndex = 0;
  let isFlipped = false;
  let isCompleted = false;
  let learnedCount = 0;

  const branches = [
    { key: 'all', name: 'Tümü', icon: '🃏' },
    { key: 'Tarih', name: 'Tarih', icon: '📜' },
    { key: 'Coğrafya', name: 'Coğrafya', icon: '🌍' },
    { key: 'Vatandaşlık', name: 'Vatandaşlık', icon: '⚖️' },
    { key: 'Türkçe', name: 'Türkçe', icon: '🇹🇷' },
    { key: 'Matematik', name: 'Matematik', icon: '📐' },
    { key: 'Güncel', name: 'Güncel', icon: '🌐' }
  ];

  function getFilteredCards() {
    if (activeBranch === 'all') return allCards;
    return allCards.filter(c => c.subject?.toLowerCase().includes(activeBranch.toLowerCase()) || activeBranch.toLowerCase().includes(c.subject?.toLowerCase()));
  }

  function updateView() {
    const cards = getFilteredCards();

    if (!cards || cards.length === 0) {
      container.innerHTML = `
        <div>
          <div class="view-header" style="text-align: center; margin-bottom: 1.5rem;">
            <h1 class="view-title">🃏 KPSS Bilgi Kartları (Flashcards)</h1>
            <p class="view-subtitle">ÖSYM'nin en çok sorduğu kritik bilgileri hafızana kazı.</p>
          </div>

          <div class="filter-bar" style="margin-bottom: 1.5rem; justify-content: center;">
            <div class="filter-tabs">
              ${branches.map(b => `
                <button class="filter-tab-btn ${b.key === activeBranch ? 'active' : ''}" data-fc-branch="${b.key}">
                  ${b.icon} ${b.name}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="question-card" style="text-align: center; padding: 3rem;">
            <p style="color: var(--text-muted);">Bu branşta henüz bilgi kartı bulunmamaktadır.</p>
          </div>
        </div>
      `;
      bindBranchEvents();
      return;
    }

    // Finished screen when all cards in deck are done
    if (isCompleted || currentIndex >= cards.length) {
      container.innerHTML = `
        <div style="max-width: 650px; margin: 0 auto; text-align: center;">
          <div class="view-header" style="margin-bottom: 1.5rem;">
            <h1 class="view-title">🃏 KPSS Bilgi Kartları (Flashcards)</h1>
          </div>

          <div class="question-card" style="padding: 3rem 2rem; text-align: center;">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">
              Tebrikler! Bu Desteyi Tamamladınız
            </h2>
            <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem;">
              Toplam <strong>${cards.length} kartın</strong> tamamını incelediniz. Öğrenilen: <strong style="color: var(--success);">${learnedCount} Kart</strong>.
            </p>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary" id="btn-restart-deck" style="padding: 0.85rem 1.5rem;">
                🔄 Kartları Yeniden Tekrar Et
              </button>
              <a href="#dashboard" class="btn btn-secondary" style="padding: 0.85rem 1.5rem;">
                🏠 Ana Ekrana Dön
              </a>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-restart-deck')?.addEventListener('click', () => {
        currentIndex = 0;
        isFlipped = false;
        isCompleted = false;
        learnedCount = 0;
        updateView();
      });
      return;
    }

    const card = cards[currentIndex];

    container.innerHTML = `
      <div>
        <div class="view-header" style="text-align: center; margin-bottom: 1.5rem;">
          <h1 class="view-title">🃏 KPSS Bilgi Kartları (Flashcards)</h1>
          <p class="view-subtitle">Kartı çevir, hafızanı test et; "Öğrendim" veya "Sonraki Kart" ile ilerle.</p>
        </div>

        <!-- Branch Tabs -->
        <div class="filter-bar" style="margin-bottom: 1.5rem; justify-content: center;">
          <div class="filter-tabs">
            ${branches.map(b => `
              <button class="filter-tab-btn ${b.key === activeBranch ? 'active' : ''}" data-fc-branch="${b.key}">
                ${b.icon} ${b.name}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; max-width: 680px; margin: 0 auto 1rem; font-size: 0.85rem; color: var(--text-muted);">
          <span>Kart <strong>${currentIndex + 1}</strong> / ${cards.length}</span>
          <span class="badge badge-success">Öğrenilen: ${learnedCount}</span>
        </div>

        <div class="flashcard-wrapper">
          <div class="flashcard" id="active-flashcard">
            <div class="flashcard-top">
              <span class="badge badge-purple">${card.subject}</span>
              <span class="badge badge-warning">${card.importance || 'Önemli'}</span>
            </div>

            <div class="flashcard-body" id="flashcard-text">
              ${isFlipped ? card.answer : card.question}
            </div>

            <div class="flashcard-hint">
              ${isFlipped ? '✅ Cevap gösteriliyor (Karta tıklayarak soruya dön)' : '👆 Karta tıklayarak cevabı gör'}
            </div>
          </div>

          <div class="flashcard-controls">
            <button class="btn btn-secondary" id="btn-next-card" style="min-width: 140px;">
              ${currentIndex === cards.length - 1 ? '🏁 Desteyi Bitir' : '➡ Sonraki Kart'}
            </button>
            <button class="btn btn-primary" id="btn-flip-card" style="min-width: 140px;">
              🔄 Kartı Çevir
            </button>
            <button class="btn" id="btn-learned-card" style="min-width: 140px; background: var(--success); color: #fff;">
              ✅ Öğrendim
            </button>
          </div>
        </div>
      </div>
    `;

    const cardEl = container.querySelector('#active-flashcard');
    const flipBtn = container.querySelector('#btn-flip-card');
    const nextBtn = container.querySelector('#btn-next-card');
    const learnedBtn = container.querySelector('#btn-learned-card');

    const toggleFlip = () => {
      isFlipped = !isFlipped;
      sound.playClick();
      updateView();
    };

    if (cardEl) cardEl.addEventListener('click', toggleFlip);
    if (flipBtn) flipBtn.addEventListener('click', toggleFlip);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sound.playClick();
        isFlipped = false;
        if (currentIndex < cards.length - 1) {
          currentIndex++;
        } else {
          isCompleted = true;
        }
        updateView();
      });
    }

    if (learnedBtn) {
      learnedBtn.addEventListener('click', () => {
        sound.playCorrect();
        learnedCount++;
        isFlipped = false;
        if (currentIndex < cards.length - 1) {
          currentIndex++;
        } else {
          isCompleted = true;
        }
        updateView();
      });
    }

    bindBranchEvents();
  }

  function bindBranchEvents() {
    container.querySelectorAll('[data-fc-branch]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeBranch = btn.getAttribute('data-fc-branch');
        currentIndex = 0;
        isFlipped = false;
        isCompleted = false;
        learnedCount = 0;
        updateView();
      });
    });
  }

  updateView();
}
