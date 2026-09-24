// js/game.js

import { initControls, getNextDirection, resetControls } from './controls.js';
import { generateFood, drawFood } from './food.js';
import { initUI, updateScore, showGameOver, showPause, hideAllOverlays, resetUIScore } from './ui.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 20;
let cellSize = 0;

// Game State
let snake = [];
let food = null;
let score = 0;
let isGameOver = false;
let isPaused = false;
let animationId = null;

// Timing / Loop
let lastTime = 0;
let moveInterval = 150; // Initial speed
let timeSinceLastMove = 0;

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Internal Canvas resolution for High DPI sharpness
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    cellSize = canvas.width / GRID_SIZE;
}

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    score = 0;
    moveInterval = 150;
    isGameOver = false;
    isPaused = false;
    timeSinceLastMove = 0;
    
    resetControls();
    resetUIScore();
    hideAllOverlays();
    
    food = generateFood(snake, GRID_SIZE);
    
    // Stop old loop to prevent duplicates
    if (animationId) cancelAnimationFrame(animationId);
    lastTime = performance.now();
    animationId = requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (isGameOver) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!isPaused) {
        timeSinceLastMove += deltaTime;

        if (timeSinceLastMove >= moveInterval) {
            update();
            timeSinceLastMove = 0; // reset
        }
        draw();
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

function update() {
    const direction = getNextDirection();
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // 1. Boundary Wrap-Around Logic (NO WALL GAME OVER)
    if (head.x < 0) head.x = GRID_SIZE - 1;
    else if (head.x >= GRID_SIZE) head.x = 0;
    
    if (head.y < 0) head.y = GRID_SIZE - 1;
    else if (head.y >= GRID_SIZE) head.y = 0;

    // 2. Self Collision Logic
    // Checking collision before adding head. 
    // We remove tail first to allow snake chasing its own moving tail.
    let isEating = (head.x === food.x && head.y === food.y);
    
    if (!isEating) {
        snake.pop(); // Remove tail
    }

    for (let part of snake) {
        if (part.x === head.x && part.y === head.y) {
            triggerGameOver();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // 3. Food Logic
    if (isEating) {
        score += 10;
        updateScore(score);
        food = generateFood(snake, GRID_SIZE);
        // Increase speed slightly
        moveInterval = Math.max(70, moveInterval - 2); 
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    snake.forEach((part, index) => {
        // High DPI padded cell logic
        let pad = Math.max(1, Math.floor(cellSize * 0.05));
        ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e'; // Head is slightly lighter green
        
        ctx.fillRect(
            part.x * cellSize + pad, 
            part.y * cellSize + pad, 
            cellSize - pad * 2, 
            cellSize - pad * 2
        );
    });

    // Draw Food
    drawFood(ctx, food, cellSize);
}

function triggerGameOver() {
    isGameOver = true;
    showGameOver(score);
}

function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    
    if (isPaused) {
        showPause();
    } else {
        hideAllOverlays();
        lastTime = performance.now(); // reset time to avoid lag jump
    }
}

// Setup App
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial Setup

initUI({
    onPauseToggle: togglePause,
    onResume: togglePause,
    onRestart: initGame
});

initControls(canvas);

// Start game initially
initGame();
