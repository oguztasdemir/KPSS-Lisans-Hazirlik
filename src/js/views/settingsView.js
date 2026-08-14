/**
 * Ayarlar ve Vercel JSON Yedekleme / İçe Aktarma View
 */

import { store } from '../store.js';

export function renderSettings(container) {
  const settings = store.settings;

  container.innerHTML = `
    <div>
      <div class="view-header">
        <h1 class="view-title">⚙️ Ayarlar & Veri Yedekleme</h1>
        <p class="view-subtitle">Vercel üzerinde verilerinizin kaybolmaması için tek tıkla JSON yedeğinizi indirin veya geri yükleyin.</p>
      </div>

      <!-- Backup & Restore Section -->
      <div class="settings-section">
        <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">
          💾 Veri Yedekleme & Geri Yükleme (JSON)
        </h2>

        <div class="settings-row">
          <div class="settings-info">
            <span class="settings-label">İlerlemeyi JSON Olarak İndir (Yedek Al)</span>
            <span class="settings-desc">Çözülen tüm sorular, hata defteri, favoriler ve kişisel notlarınız tek bir .json dosyasında cihazınıza iner.</span>
          </div>
          <button class="btn btn-primary" id="btn-export-json">
            📥 JSON Yedeği İndir
          </button>
        </div>

        <div class="settings-row">
          <div class="settings-info">
            <span class="settings-label">JSON Yedeği Geri Yükle</span>
            <span class="settings-desc">Daha önce indirdiğiniz yedek dosyasını seçerek tüm ilerlemenizi anında geri getirin.</span>
          </div>
          <div>
            <input type="file" id="input-import-json" accept=".json" style="display: none;">
            <button class="btn btn-secondary" id="btn-import-trigger">
              📤 Dosya Seç & Geri Yükle
            </button>
          </div>
        </div>
      </div>

      <!-- Target & Audio Settings -->
      <div class="settings-section">
        <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">
          🎯 Çalışma & Ses Tercihleri
        </h2>

        <div class="settings-row">
          <div class="settings-info">
            <span class="settings-label">Günlük Soru Hedefi</span>
            <span class="settings-desc">Ana ekranda takip edilecek günlük çözülecek soru sayısı hedefi.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="number" id="input-daily-target" class="calc-input" style="width: 90px;" min="10" max="500" value="${settings.dailyTarget || 50}">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Soru</span>
          </div>
        </div>

        <div class="settings-row">
          <div class="settings-info">
            <span class="settings-label">Ses Efektleri</span>
            <span class="settings-desc">Doğru ve yanlış cevaplarda anında hafif sesli geri bildirim çalınır.</span>
          </div>
          <label style="display: flex; align-items: center; cursor: pointer;">
            <input type="checkbox" id="check-sound" ${settings.soundEnabled ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--primary);">
          </label>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="settings-section" style="border-color: var(--danger-border);">
        <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--danger); margin-bottom: 0.5rem;">
          ⚠️ Tehlikeli Bölge
        </h2>

        <div class="settings-row" style="border-bottom: none; padding-bottom: 0;">
          <div class="settings-info">
            <span class="settings-label" style="color: var(--danger);">Tüm İlerlemeyi Sıfırla</span>
            <span class="settings-desc">Çözülen tüm sorular, hata defteri ve notlar yerel hafızadan kalıcı olarak silinir.</span>
          </div>
          <button class="btn btn-danger" id="btn-reset-data">
            🗑️ Verileri Sıfırla
          </button>
        </div>
      </div>
    </div>
  `;

  // Export JSON
  container.querySelector('#btn-export-json').addEventListener('click', () => {
    store.exportBackup();
    alert('Yedek dosyanız başarıyla indirildi!');
  });

  // Import JSON Trigger
  const fileInput = container.querySelector('#input-import-json');
  const importBtn = container.querySelector('#btn-import-trigger');
  importBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = store.importBackup(event.target.result);
      if (result.success) {
        alert(result.message);
        renderSettings(container);
      } else {
        alert(result.message);
      }
    };
    reader.readAsText(file);
  });

  // Daily Target
  const targetInput = container.querySelector('#input-daily-target');
  targetInput.addEventListener('change', () => {
    const val = parseInt(targetInput.value, 10) || 50;
    store.updateSettings({ dailyTarget: val });
  });

  // Sound Checkbox
  const soundCheck = container.querySelector('#check-sound');
  soundCheck.addEventListener('change', () => {
    store.updateSettings({ soundEnabled: soundCheck.checked });
  });

  // Reset Data
  container.querySelector('#btn-reset-data').addEventListener('click', () => {
    if (confirm('DİKKAT: Tüm soru çözme geçmişiniz, favorileriniz ve notlarınız silinecektir. Devam etmek istiyor musunuz?')) {
      store.resetAllData();
      alert('Tüm veriler sıfırlandı.');
      renderSettings(container);
    }
  });
}
