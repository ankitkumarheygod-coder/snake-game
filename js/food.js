// js/food.js

export function generateFood(snake, gridSize) {
    let newFood;
    let isSafe = false;

    while (!isSafe) {
        newFood = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };

        isSafe = true;
        // Check if food overlaps with snake
        for (let part of snake) {
            if (part.x === newFood.x && part.y === newFood.y) {
                isSafe = false;
                break;
            }
        }
    }
    return newFood;
}

export function drawFood(ctx, food, cellSize) {
    let pad = Math.max(1, Math.floor(cellSize * 0.1));
    ctx.fillStyle = '#ef4444'; // Red food
    ctx.beginPath();
    // Draw food as a rounded circle-like object
    let x = food.x * cellSize + cellSize/2;
    let y = food.y * cellSize + cellSize/2;
    let radius = (cellSize / 2) - pad;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}
