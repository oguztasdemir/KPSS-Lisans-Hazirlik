/**
 * Live Countdown timer for KPSS Lisans Exam
 */

export function startCountdown(targetDateStr, onTick) {
  const targetTime = new Date(targetDateStr).getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance < 0) {
      onTick({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    onTick({ days, hours, minutes, seconds, isPassed: false });
  }

  update();
  return setInterval(update, 1000);
}
