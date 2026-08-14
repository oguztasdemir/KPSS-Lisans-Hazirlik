/**
 * Sol Panel (Sidebar) Yönetim Modülü
 * Menü navigasyonu, aktif link takibi, rozet sayaçları ve mobil çekmece kontrolü.
 */

import { store } from '../store.js';

export class SidebarPanel {
  constructor() {
    this.sidebarEl = document.getElementById('sidebar');
    this.backdropEl = document.getElementById('sidebar-backdrop');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.wrongBadge = document.getElementById('sidebar-wrong-badge');
    this.favBadge = document.getElementById('sidebar-fav-badge');
  }

  init() {
    this.bindEvents();
    this.updateBadges();
    store.onUpdate(() => this.updateBadges());
  }

  bindEvents() {
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', () => this.toggle());
    }

    if (this.backdropEl) {
      this.backdropEl.addEventListener('click', () => this.close());
    }

    // Mobil ekranda herhangi bir menü linkine tıklandığında çekmeceyi otomatik kapat
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 900) this.close();
      });
    });
  }

  toggle(forceClose = false) {
    if (!this.sidebarEl) return;
    if (forceClose) {
      this.sidebarEl.classList.remove('open');
      this.backdropEl?.classList.remove('active');
    } else {
      const isOpen = this.sidebarEl.classList.toggle('open');
      this.backdropEl?.classList.toggle('active', isOpen);
    }
  }

  open() {
    this.toggle(false);
  }

  close() {
    this.toggle(true);
  }

  setActive(path) {
    // Sol paneldeki aktif menü öğesini güncelle
    document.querySelectorAll('.nav-item').forEach(link => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href.includes(path));
    });

    // Mobil alt menüdeki aktif butonu güncelle
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      const navTarget = btn.getAttribute('data-nav') || '';
      btn.classList.toggle('active', path.startsWith(navTarget));
    });
  }

  updateBadges() {
    if (this.wrongBadge) {
      const count = store.wrongQuestionIds?.length || 0;
      this.wrongBadge.textContent = count;
      this.wrongBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    if (this.favBadge) {
      const count = store.favoriteIds?.length || 0;
      this.favBadge.textContent = count;
      this.favBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }
}

export const sidebarPanel = new SidebarPanel();
