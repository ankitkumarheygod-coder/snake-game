/**
 * Snake Game - UI Module
 * Handles Score, Best Score, Pause Modal, and Game Over Screen.
 */

let currentScoreEl = null;
let highScoreEl = null;
let gameOverOverlay = null;
let finalScoreEl = null;
let bestScoreEl = null;
let restartBtn = null;
let pauseOverlay = null;
let resumeBtn = null;
let pauseToggleBtn = null;

/**
 * Initializes UI element references and listeners
 * @param {Object} options
 * @param {Function} options.onRestart - Restart game callback
 * @param {Function} options.onTogglePause - Pause/Resume toggle callback
 */
export function initUI({ onRestart, onTogglePause }) {
  currentScoreEl = document.getElementById('current-score');
  highScoreEl = document.getElementById('high-score');
  gameOverOverlay = document.getElementById('game-over-overlay');
  finalScoreEl = document.getElementById('final-score');
  bestScoreEl = document.getElementById('best-score');
  restartBtn = document.getElementById('restart-btn');
  pauseOverlay = document.getElementById('pause-overlay');
  resumeBtn = document.getElementById('resume-btn');
  pauseToggleBtn = document.getElementById('pause-toggle-btn');

  if (restartBtn && onRestart) {
    restartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      onRestart();
    });
  }

  if (resumeBtn && onTogglePause) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      onTogglePause();
    });
  }

  if (pauseToggleBtn && onTogglePause) {
    pauseToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      onTogglePause();
    });
  }
}

/**
 * Updates score and best score display
 * @param {number} score 
 * @param {number} highScore 
 */
export function updateScore(score, highScore) {
  if (currentScoreEl) {
    currentScoreEl.textContent = String(score);
  }
  if (highScoreEl) {
    highScoreEl.textContent = String(highScore);
  }
}

/**
 * Displays Game Over screen
 * @param {number} score 
 * @param {number} highScore 
 */
export function showGameOver(score, highScore) {
  if (finalScoreEl) finalScoreEl.textContent = String(score);
  if (bestScoreEl) bestScoreEl.textContent = String(highScore);
  if (gameOverOverlay) gameOverOverlay.classList.add('active');
  if (pauseOverlay) pauseOverlay.classList.remove('active');
}

/**
 * Hides Game Over screen
 */
export function hideGameOver() {
  if (gameOverOverlay) gameOverOverlay.classList.remove('active');
}

/**
 * Shows Pause overlay
 */
export function showPause() {
  if (pauseOverlay) pauseOverlay.classList.add('active');
  updatePauseButton(true);
}

/**
 * Hides Pause overlay
 */
export function hidePause() {
  if (pauseOverlay) pauseOverlay.classList.remove('active');
  updatePauseButton(false);
}

/**
 * Updates pause button icon
 * @param {boolean} isPaused 
 */
export function updatePauseButton(isPaused) {
  if (!pauseToggleBtn) return;
  if (isPaused) {
    pauseToggleBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
    pauseToggleBtn.setAttribute('aria-label', 'Resume Game');
  } else {
    pauseToggleBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    `;
    pauseToggleBtn.setAttribute('aria-label', 'Pause Game');
  }
}
