/**
 * Snake Game - Food Module
 * Handles random food generation and food drawing logic.
 */

/**
 * Generates a random food coordinate {x, y} that does not collide with the snake body.
 * @param {number} gridWidth - Total columns on grid
 * @param {number} gridHeight - Total rows on grid
 * @param {Array<{x: number, y: number}>} snakeSegments - Array of current snake body segments
 * @returns {{x: number, y: number}} Safe food coordinates
 */
export function generateFood(gridWidth, gridHeight, snakeSegments) {
  const totalCells = gridWidth * gridHeight;

  // If snake occupies a significant portion of the board, calculate empty cells directly
  if (snakeSegments.length > totalCells * 0.5) {
    const occupied = new Set(snakeSegments.map(seg => `${seg.x},${seg.y}`));
    const emptyCells = [];

    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        if (!occupied.has(`${x},${y}`)) {
          emptyCells.push({ x, y });
        }
      }
    }

    if (emptyCells.length === 0) {
      return { x: 0, y: 0 }; // Board is completely full
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  // Fast random sampling
  let foodX = 0;
  let foodY = 0;
  let isOnSnake = true;
  let attempts = 0;

  while (isOnSnake && attempts < 150) {
    foodX = Math.floor(Math.random() * gridWidth);
    foodY = Math.floor(Math.random() * gridHeight);

    isOnSnake = snakeSegments.some(seg => seg.x === foodX && seg.y === foodY);
    attempts++;
  }

  // Fallback scan if random sampling hit snake every time
  if (isOnSnake) {
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        if (!snakeSegments.some(seg => seg.x === x && seg.y === y)) {
          return { x, y };
        }
      }
    }
  }

  return { x: foodX, y: foodY };
}

/**
 * Draws the food item on the canvas with a distinct red apple appearance.
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {{x: number, y: number}} food - Food coordinates
 * @param {number} cellSize - Pixel size of each grid cell
 */
export function drawFood(ctx, food, cellSize) {
  if (!food) return;

  const centerX = food.x * cellSize + cellSize / 2;
  const centerY = food.y * cellSize + cellSize / 2;
  const radius = cellSize * 0.38;

  ctx.save();

  // Glow
  ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
  ctx.shadowBlur = 8;

  // Red apple body
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(centerX, centerY + radius * 0.1, radius, 0, Math.PI * 2);
  ctx.fill();

  // Small leaf on top
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.ellipse(
    centerX + radius * 0.2,
    centerY - radius * 0.7,
    radius * 0.3,
    radius * 0.15,
    -Math.PI / 4,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Highlight reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.arc(centerX - radius * 0.3, centerY - radius * 0.2, radius * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
