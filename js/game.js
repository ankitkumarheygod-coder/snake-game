/**
 * Snake Game - Core Game Logic & Loop
 * Features:
 * - Grid-based wrap-around boundaries (NO wall collision Game Over)
 * - Self-collision Game Over
 * - Buffered input queue for fast swipe responsiveness
 * - Fluid requestAnimationFrame game loop
 * - Clean state restart
 */

import { generateFood, drawFood } from './food.js';
import { DIRECTIONS, setupControls, isOpposite } from './controls.js';
import {
  initUI,
  updateScore,
  showGameOver,
  hideGameOver,
  showPause,
  hidePause,
  updatePauseButton
} from './ui.js';

// Configuration
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const INITIAL_SPEED = 140; // Milliseconds per movement tick
const MIN_SPEED = 75; // Minimum tick speed limit for comfortable mobile swiping
const SPEED_STEP = 3; // Gradual speed acceleration per food eaten

// Game State
let canvas = null;
let ctx = null;
let cellSize = 0;

let snake = [];
let currentDirection = DIRECTIONS.RIGHT;
let inputQueue = [];

let food = null;
let score = 0;
let highScore = 0;
let currentSpeed = INITIAL_SPEED;

let isGameOver = false;
let isPaused = false;

let lastTickTime = 0;
let animationFrameId = null;

/**
 * Loads best score from localStorage
 */
function loadHighScore() {
  try {
    const saved = localStorage.getItem('snake_game_best_score');
    highScore = saved ? parseInt(saved, 10) || 0 : 0;
  } catch {
    highScore = 0;
  }
}

/**
 * Saves best score to localStorage
 */
function saveHighScore() {
  try {
    localStorage.setItem('snake_game_best_score', String(highScore));
  } catch {
    // Storage restricted or unavailable
  }
}

/**
 * Handles canvas sizing and sharp pixel density scaling
 */
function resizeCanvas() {
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.floor(rect.width);
  const displayHeight = Math.floor(rect.height);

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;

  ctx.resetTransform?.();
  ctx.scale(dpr, dpr);

  cellSize = displayWidth / GRID_WIDTH;
}

/**
 * Resets game to clean initial state
 */
function resetGameState() {
  const startY = Math.floor(GRID_HEIGHT / 2);
  const startX = 6;

  // 3 segments moving right
  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY }
  ];

  currentDirection = DIRECTIONS.RIGHT;
  inputQueue = [];

  score = 0;
  currentSpeed = INITIAL_SPEED;
  isGameOver = false;
  isPaused = false;

  food = generateFood(GRID_WIDTH, GRID_HEIGHT, snake);

  updateScore(score, highScore);
  hideGameOver();
  hidePause();
  updatePauseButton(false);
}

/**
 * Direction handler with buffered queue and anti-reverse checks
 * @param {{x: number, y: number, name: string}} newDir 
 */
function onDirectionInput(newDir) {
  if (isGameOver || isPaused) return;

  // Compare against the last queued direction or the current direction
  const lastPending = inputQueue.length > 0
    ? inputQueue[inputQueue.length - 1]
    : currentDirection;

  // Prevent 180-degree instant reversal and duplicate direction
  if (!isOpposite(newDir, lastPending) && (newDir.x !== lastPending.x || newDir.y !== lastPending.y)) {
    // Allow buffering up to 2 rapid swipe turns
    if (inputQueue.length < 2) {
      inputQueue.push(newDir);
    }
  }
}

/**
 * Toggles pause state
 */
function togglePause() {
  if (isGameOver) return;

  isPaused = !isPaused;
  if (isPaused) {
    showPause();
  } else {
    hidePause();
    lastTickTime = performance.now(); // Prevent time accumulation jump
  }
}

/**
 * Core game state update tick
 */
function update() {
  if (isGameOver || isPaused) return;

  // Pull next direction from buffer queue
  if (inputQueue.length > 0) {
    const queuedDir = inputQueue.shift();
    if (!isOpposite(queuedDir, currentDirection)) {
      currentDirection = queuedDir;
    }
  }

  // Calculate new head coordinates
  let nextX = snake[0].x + currentDirection.x;
  let nextY = snake[0].y + currentDirection.y;

  /* ==========================================================
     WRAP-AROUND BOUNDARY LOGIC
     Wall collision does NOT cause Game Over.
     ========================================================== */
  if (nextX < 0) {
    nextX = GRID_WIDTH - 1;
  } else if (nextX >= GRID_WIDTH) {
    nextX = 0;
  }

  if (nextY < 0) {
    nextY = GRID_HEIGHT - 1;
  } else if (nextY >= GRID_HEIGHT) {
    nextY = 0;
  }

  const newHead = { x: nextX, y: nextY };

  /* ==========================================================
     SELF-COLLISION CHECK
     Only colliding with own body causes Game Over.
     ========================================================== */
  const isEating = newHead.x === food.x && newHead.y === food.y;
  // If not eating, the tail will move forward, so ignore current tail segment
  const bodyToCheck = isEating ? snake : snake.slice(0, -1);
  const selfCollision = bodyToCheck.some(seg => seg.x === newHead.x && seg.y === newHead.y);

  if (selfCollision) {
    triggerGameOver();
    return;
  }

  // Move snake by adding new head
  snake.unshift(newHead);

  /* ==========================================================
     FOOD COLLISION & GROWTH
     ========================================================== */
  if (isEating) {
    score += 10;
    if (score > highScore) {
      highScore = score;
      saveHighScore();
    }
    updateScore(score, highScore);

    // Gradual speed increment with a safe minimum bound
    currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 30) * SPEED_STEP);

    // Spawn new food
    food = generateFood(GRID_WIDTH, GRID_HEIGHT, snake);
  } else {
    // Normal move: remove tail
    snake.pop();
  }
}

/**
 * Triggers Game Over overlay
 */
function triggerGameOver() {
  isGameOver = true;
  showGameOver(score, highScore);
}

/**
 * Restarts game cleanly
 */
function restartGame() {
  resetGameState();
  lastTickTime = performance.now();
}

/**
 * Renders board, snake, and food
 */
function render() {
  if (!ctx || !canvas) return;

  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);

  // Clear canvas
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, width, height);

  // Subtle clean grid pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_WIDTH; i++) {
    const pos = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(width, pos);
    ctx.stroke();
  }

  // Draw Food
  drawFood(ctx, food, cellSize);

  // Draw Snake
  drawSnake();
}

/**
 * Draws snake body segments and head
 */
function drawSnake() {
  if (snake.length === 0) return;

  const total = snake.length;

  for (let i = total - 1; i >= 0; i--) {
    const segment = snake[i];
    const x = segment.x * cellSize;
    const y = segment.y * cellSize;
    const padding = 1.5;

    ctx.save();

    if (i === 0) {
      // Head
      ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#10b981';

      roundRect(ctx, x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2, 6);
      ctx.fill();

      // Eyes facing movement direction
      drawEyes(x, y, cellSize, currentDirection);
    } else {
      // Body
      const progress = i / total;
      const alpha = 0.95 - progress * 0.3;

      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;

      roundRect(ctx, x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2, 4);
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * Helper to draw eyes on the snake head
 */
function drawEyes(x, y, size, dir) {
  ctx.fillStyle = '#ffffff';
  let eye1 = { x: 0, y: 0 };
  let eye2 = { x: 0, y: 0 };
  let pupilOffset = { x: 0, y: 0 };
  const eyeRadius = size * 0.13;
  const pupilRadius = size * 0.07;

  if (dir.x === 1) { // Facing RIGHT
    eye1 = { x: x + size * 0.72, y: y + size * 0.28 };
    eye2 = { x: x + size * 0.72, y: y + size * 0.72 };
    pupilOffset = { x: size * 0.04, y: 0 };
  } else if (dir.x === -1) { // Facing LEFT
    eye1 = { x: x + size * 0.28, y: y + size * 0.28 };
    eye2 = { x: x + size * 0.28, y: y + size * 0.72 };
    pupilOffset = { x: -size * 0.04, y: 0 };
  } else if (dir.y === -1) { // Facing UP
    eye1 = { x: x + size * 0.28, y: y + size * 0.28 };
    eye2 = { x: x + size * 0.72, y: y + size * 0.28 };
    pupilOffset = { x: 0, y: -size * 0.04 };
  } else { // Facing DOWN
    eye1 = { x: x + size * 0.28, y: y + size * 0.72 };
    eye2 = { x: x + size * 0.72, y: y + size * 0.72 };
    pupilOffset = { x: 0, y: size * 0.04 };
  }

  ctx.beginPath();
  ctx.arc(eye1.x, eye1.y, eyeRadius, 0, Math.PI * 2);
  ctx.arc(eye2.x, eye2.y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(eye1.x + pupilOffset.x, eye1.y + pupilOffset.y, pupilRadius, 0, Math.PI * 2);
  ctx.arc(eye2.x + pupilOffset.x, eye2.y + pupilOffset.y, pupilRadius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draws rounded rectangle on canvas
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Main game loop driven by requestAnimationFrame
 * @param {DOMHighResTimeStamp} timestamp 
 */
function gameLoop(timestamp) {
  if (!lastTickTime) lastTickTime = timestamp;

  const elapsed = timestamp - lastTickTime;

  if (elapsed >= currentSpeed) {
    update();
    lastTickTime = timestamp;
  }

  render();

  animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Game initialization
 */
function init() {
  canvas = document.getElementById('game-board');
  if (!canvas) return;

  ctx = canvas.getContext('2d');

  loadHighScore();
  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 150);
  });

  // Setup UI buttons
  initUI({
    onRestart: restartGame,
    onTogglePause: togglePause
  });

  // Setup Touch Swipe & Keyboard controls
  setupControls({
    targetElement: canvas,
    onValidDirection: onDirectionInput,
    onTogglePause: togglePause,
    onRestart: restartGame,
    canAcceptInput: () => !isGameOver && !isPaused
  });

  // Start fresh game
  resetGameState();

  // Start loop
  lastTickTime = performance.now();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(gameLoop);
}

// Run on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
