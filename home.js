// Home page specific JS logic
// Requires script.js (common functions) to load first.

function initHomePage() {
  if (typeof startParticles === 'function') startParticles();
  if (typeof startTypingEffect === 'function') startTypingEffect();
  if (typeof startCounters === 'function') startCounters();
  if (typeof animateChips === 'function') animateChips();
  if (typeof setupScrollReveal === 'function') setupScrollReveal();
  if (typeof updateCalc === 'function') updateCalc();
}

document.addEventListener('DOMContentLoaded', initHomePage);
