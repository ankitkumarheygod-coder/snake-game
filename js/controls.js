// js/controls.js

const SWIPE_THRESHOLD = 25;
let inputQueue = [];
let currentDir = { x: 1, y: 0 }; // default right

let touchStartX = 0;
let touchStartY = 0;

export function initControls(canvas) {
    // Touch Events (Mobile)
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Stop browser scrolling on board
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;
        handleInput(touchEndX - touchStartX, touchEndY - touchStartY);
    }, { passive: false });

    // Keyboard Events (Desktop Support)
    window.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': case 'w': case 'W': handleKey({x: 0, y: -1}); break;
            case 'ArrowDown': case 's': case 'S': handleKey({x: 0, y: 1}); break;
            case 'ArrowLeft': case 'a': case 'A': handleKey({x: -1, y: 0}); break;
            case 'ArrowRight': case 'd': case 'D': handleKey({x: 1, y: 0}); break;
        }
    });
}

function handleInput(dx, dy) {
    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

    let newDir = null;
    if (Math.abs(dx) > Math.abs(dy)) {
        newDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 }; // Right or Left
    } else {
        newDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 }; // Down or Up
    }

    if (newDir) addInput(newDir);
}

function handleKey(newDir) {
    addInput(newDir);
}

function addInput(newDir) {
    if (inputQueue.length >= 2) return; // Input queue limit (max 2 pending)

    let lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : currentDir;

    // 180 Degree Reverse Protection
    if (newDir.x !== 0 && newDir.x === -lastDir.x) return;
    if (newDir.y !== 0 && newDir.y === -lastDir.y) return;

    // Prevent same consecutive directions
    if (newDir.x === lastDir.x && newDir.y === lastDir.y) return;

    inputQueue.push(newDir);
}

export function getNextDirection() {
    if (inputQueue.length > 0) {
        currentDir = inputQueue.shift();
    }
    return currentDir;
}

export function resetControls() {
    inputQueue = [];
    currentDir = { x: 1, y: 0 };
}
