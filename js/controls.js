/**
 * Snake Game - Controls Module
 * Handles touch swipe gestures and desktop keyboard controls.
 * Features:
 * - One swipe per touch gesture
 * - 25px minimum swipe threshold to prevent accidental taps
 * - Input queue buffering (up to 2 pending moves)
 * - 180-degree immediate reversal protection
 */

export const DIRECTIONS = {
  UP: { x: 0, y: -1, name: 'UP' },
  DOWN: { x: 0, y: 1, name: 'DOWN' },
  LEFT: { x: -1, y: 0, name: 'LEFT' },
  RIGHT: { x: 1, y: 0, name: 'RIGHT' },
};

/**
 * Checks if two directions are exact opposites
 * @param {{x: number, y: number}} d1 
 * @param {{x: number, y: number}} d2 
 * @returns {boolean}
 */
export function isOpposite(d1, d2) {
  if (!d1 || !d2) return false;
  return d1.x === -d2.x && d1.y === -d2.y;
}

/**
 * Sets up touch swipe and keyboard controls
 * @param {Object} options
 * @param {HTMLElement} options.targetElement - Element to listen for touch gestures (Canvas)
 * @param {Function} options.onValidDirection - Callback when a valid, non-reverse direction is detected
 * @param {Function} options.onTogglePause - Callback to toggle pause
 * @param {Function} options.onRestart - Callback to restart game
 * @param {Function} options.canAcceptInput - Checks if game is in a state to accept move inputs
 */
export function setupControls({
  targetElement,
  onValidDirection,
  onTogglePause,
  onRestart,
  canAcceptInput
}) {
  const MIN_SWIPE_DISTANCE = 25; // 25px threshold as specified (20-30px)

  let startX = 0;
  let startY = 0;
  let swipeRecognized = false;
  let isTouching = false;

  /* -------------------------------------------------------------
     1. Touch Swipe System (Mobile Primary Control)
     ------------------------------------------------------------- */
  if (targetElement) {
    targetElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        swipeRecognized = false;
        isTouching = true;
      }
    }, { passive: true });

    targetElement.addEventListener('touchmove', (e) => {
      // Prevent browser scrolling and gesture zooming while touching the game board
      if (isTouching && e.cancelable) {
        e.preventDefault();
      }

      // Check if threshold is reached during move for responsive turning
      if (isTouching && !swipeRecognized && e.touches.length === 1) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const dx = currentX - startX;
        const dy = currentY - startY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx >= MIN_SWIPE_DISTANCE || absDy >= MIN_SWIPE_DISTANCE) {
          processSwipe(dx, dy);
          swipeRecognized = true; // One swipe = One turn!
        }
      }
    }, { passive: false });

    const handleTouchEnd = (e) => {
      if (!isTouching) return;

      // If user quickly lifted finger and threshold wasn't handled in touchmove yet
      if (!swipeRecognized && e.changedTouches.length === 1) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const dx = endX - startX;
        const dy = endY - startY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx >= MIN_SWIPE_DISTANCE || absDy >= MIN_SWIPE_DISTANCE) {
          processSwipe(dx, dy);
        }
      }

      isTouching = false;
      swipeRecognized = false;
    };

    targetElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    targetElement.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  }

  /**
   * Translates dx & dy into directional command
   */
  function processSwipe(dx, dy) {
    if (canAcceptInput && !canAcceptInput()) return;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      // Horizontal swipe
      if (dx > 0) {
        onValidDirection(DIRECTIONS.RIGHT);
      } else {
        onValidDirection(DIRECTIONS.LEFT);
      }
    } else if (absDy > absDx) {
      // Vertical swipe
      if (dy > 0) {
        onValidDirection(DIRECTIONS.DOWN);
      } else {
        onValidDirection(DIRECTIONS.UP);
      }
    }
  }

  /* -------------------------------------------------------------
     2. Keyboard Controls (Desktop Support)
     ------------------------------------------------------------- */
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        if (!canAcceptInput || canAcceptInput()) {
          onValidDirection(DIRECTIONS.UP);
        }
        break;

      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        if (!canAcceptInput || canAcceptInput()) {
          onValidDirection(DIRECTIONS.DOWN);
        }
        break;

      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        if (!canAcceptInput || canAcceptInput()) {
          onValidDirection(DIRECTIONS.LEFT);
        }
        break;

      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        if (!canAcceptInput || canAcceptInput()) {
          onValidDirection(DIRECTIONS.RIGHT);
        }
        break;

      case ' ':
      case 'p':
      case 'P':
        e.preventDefault();
        if (onTogglePause) onTogglePause();
        break;

      case 'Enter':
        e.preventDefault();
        if (onRestart) onRestart();
        break;

      default:
        break;
    }
  });
}
