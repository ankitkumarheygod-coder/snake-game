// js/ui.js

const scoreEl = document.getElementById('currentScore');
const bestScoreEl = document.getElementById('bestScore');
const pauseOverlay = document.getElementById('pauseOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreEl = document.getElementById('finalScore');
const finalBestScoreEl = document.getElementById('finalBestScore');

let bestScore = 0;

export function initUI(callbacks) {
    // Load Best Score
    const savedBest = localStorage.getItem('snake_game_best_score');
    if (savedBest) bestScore = parseInt(savedBest);
    bestScoreEl.innerText = bestScore;

    // Bind Buttons
    document.getElementById('pauseBtn').addEventListener('click', callbacks.onPauseToggle);
    document.getElementById('resumeBtn').addEventListener('click', callbacks.onResume);
    document.getElementById('restartBtn').addEventListener('click', callbacks.onRestart);
}

export function updateScore(score) {
    scoreEl.innerText = score;
    if (score > bestScore) {
        bestScore = score;
        bestScoreEl.innerText = bestScore;
        localStorage.setItem('snake_game_best_score', bestScore);
    }
}

export function showGameOver(score) {
    hideAllOverlays();
    finalScoreEl.innerText = score;
    finalBestScoreEl.innerText = bestScore;
    gameOverOverlay.classList.add('active');
}

export function showPause() {
    hideAllOverlays();
    pauseOverlay.classList.add('active');
}

export function hideAllOverlays() {
    pauseOverlay.classList.remove('active');
    gameOverOverlay.classList.remove('active');
}

export function resetUIScore() {
    scoreEl.innerText = "0";
}
