/**
 * KPSS Lisans Puan & Net Hesaplama View (P1, P2, P3 Puanları)
 */

export function renderScoreCalc(container) {
  container.innerHTML = `
    <div>
      <div class="view-header">
        <h1 class="view-title">🧮 KPSS Lisans Puan & Net Hesaplama</h1>
        <p class="view-subtitle">Genel Yetenek ve Genel Kültür doğru/yanlış sayılarınızı girerek standart sapmalı KPSS P1, P2, P3 puanlarınızı hesaplayın.</p>
      </div>

      <div class="calc-grid">
        <!-- Input Form -->
        <div class="calc-card">
          <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">
            📝 Sınav Net Girişi
          </h2>

          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; padding-bottom: 0.5rem; border-bottom: 2px solid var(--border-color);">
            <span>Test</span>
            <span style="text-align: center;">Doğru</span>
            <span style="text-align: center;">Yanlış</span>
            <span style="text-align: center;">Net</span>
          </div>

          <!-- Genel Yetenek -->
          <div class="calc-input-row">
            <span style="font-weight: 600; font-size: 0.9rem;">Genel Yetenek (60 Soru)</span>
            <input type="number" id="calc-gy-d" class="calc-input" min="0" max="60" value="45" placeholder="D">
            <input type="number" id="calc-gy-y" class="calc-input" min="0" max="60" value="8" placeholder="Y">
            <span id="calc-gy-net" style="text-align: center; font-weight: 800; color: var(--primary);">43.00</span>
          </div>

          <!-- Genel Kültür -->
          <div class="calc-input-row">
            <span style="font-weight: 600; font-size: 0.9rem;">Genel Kültür (60 Soru)</span>
            <input type="number" id="calc-gk-d" class="calc-input" min="0" max="60" value="48" placeholder="D">
            <input type="number" id="calc-gk-y" class="calc-input" min="0" max="60" value="6" placeholder="Y">
            <span id="calc-gk-net" style="text-align: center; font-weight: 800; color: var(--primary);">46.50</span>
          </div>

          <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
            <span style="font-weight: 700; font-size: 1rem;">Toplam Net:</span>
            <span id="calc-total-net" style="font-size: 1.3rem; font-weight: 900; color: var(--success);">89.50</span>
          </div>
        </div>

        <!-- Calculated Score Badges -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="score-result-badge">
            <span style="font-size: 0.88rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9;">
              🏆 KPSS P3 (Lisans Düz Memurluk)
            </span>
            <span class="score-big-number" id="score-p3">88.42</span>
            <span style="font-size: 0.8rem; opacity: 0.85;">%50 Genel Yetenek + %50 Genel Kültür</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; text-align: center; box-shadow: var(--shadow-sm);">
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">KPSS P1 Puanı</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;" id="score-p1">86.15</div>
              <span style="font-size: 0.7rem; color: var(--text-muted);">%70 GY + %30 GK</span>
            </div>

            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; text-align: center; box-shadow: var(--shadow-sm);">
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">KPSS P2 Puanı</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;" id="score-p2">87.60</div>
              <span style="font-size: 0.7rem; color: var(--text-muted);">%60 GY + %40 GK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const gyD = container.querySelector('#calc-gy-d');
  const gyY = container.querySelector('#calc-gy-y');
  const gkD = container.querySelector('#calc-gk-d');
  const gkY = container.querySelector('#calc-gk-y');

  const gyNetEl = container.querySelector('#calc-gy-net');
  const gkNetEl = container.querySelector('#calc-gk-net');
  const totalNetEl = container.querySelector('#calc-total-net');
  const p3El = container.querySelector('#score-p3');
  const p1El = container.querySelector('#score-p1');
  const p2El = container.querySelector('#score-p2');

  function calculate() {
    const d1 = parseFloat(gyD.value) || 0;
    const y1 = parseFloat(gyY.value) || 0;
    const d2 = parseFloat(gkD.value) || 0;
    const y2 = parseFloat(gkY.value) || 0;

    const net1 = Math.max(0, d1 - (y1 * 0.25));
    const net2 = Math.max(0, d2 - (y2 * 0.25));
    const totalNet = net1 + net2;

    gyNetEl.textContent = net1.toFixed(2);
    gkNetEl.textContent = net2.toFixed(2);
    totalNetEl.textContent = totalNet.toFixed(2);

    // Standard KPSS Lisans P3 formula approx
    // P3 = 40 + (net1 * 0.52) + (net2 * 0.54)
    const p3 = Math.min(100, Math.max(0, 40 + (net1 * 0.52) + (net2 * 0.54)));
    const p1 = Math.min(100, Math.max(0, 40 + (net1 * 0.68) + (net2 * 0.32)));
    const p2 = Math.min(100, Math.max(0, 40 + (net1 * 0.60) + (net2 * 0.44)));

    p3El.textContent = p3.toFixed(2);
    p1El.textContent = p1.toFixed(2);
    p2El.textContent = p2.toFixed(2);
  }

  [gyD, gyY, gkD, gkY].forEach(input => {
    input.addEventListener('input', calculate);
  });

  calculate();
}
