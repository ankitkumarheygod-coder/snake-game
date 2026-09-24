# 🐍 Mobile-First Snake Game

A high-performance, mobile-first Snake Game designed specifically for Android and mobile screens. Control the Snake smoothly using touch swipe gestures on the board, featuring wrap-around boundaries, intelligent self-collision detection, and a fluid 60FPS canvas loop.

---

## 📁 Project Structure

```text
snake-game/
│
├── index.html          # Clean HTML structure without inline styles or scripts
│
├── css/
│   └── style.css       # Clean, modern dark theme & responsive board layout
│
├── js/
│   ├── game.js         # Core game state, wrap-around logic, and requestAnimationFrame loop
│   ├── controls.js     # Touch swipe recognition, input buffering & keyboard controls
│   ├── food.js         # Safe food generation & vibrant apple rendering
│   └── ui.js           # Score, Best score (localStorage), Pause & Game Over screens
│
└── README.md           # Documentation & instructions
```

---

## 🎮 Key Features & Rules

1. **Touch Swipe Controls (No On-Screen Buttons)**:
   - **No D-pad**, no direction buttons, and no extra bottom panel cluttering the mobile view.
   - User controls the snake by swiping on the board:
     - **Swipe Up**: Snake turns UP
     - **Swipe Down**: Snake turns DOWN
     - **Swipe Left**: Snake turns LEFT
     - **Swipe Right**: Snake turns RIGHT
   - **Minimum Swipe Distance**: 25px threshold prevents accidental touches.
   - **One Swipe = One Turn**: Each gesture triggers exactly one direction change.
   - `touch-action: none` ensures the webpage never scrolls while swiping.

2. **Wrap-Around Outer Boundaries**:
   - **Wall collision never causes Game Over**.
   - Crossing any wall safely wraps the Snake to the opposite edge:
     - Exiting Left $\rightarrow$ Enters Right
     - Exiting Right $\rightarrow$ Enters Left
     - Exiting Top $\rightarrow$ Enters Bottom
     - Exiting Bottom $\rightarrow$ Enters Top

3. **Self-Collision Game Over**:
   - Game Over occurs **only** when the Snake's head bites into any segment of its own body.

4. **Input Queue & Anti-Reversal Protection**:
   - Instant 180° reversals are blocked (e.g., swiping Left while moving Right is ignored).
   - Rapid consecutive swipes (e.g., Up then Left) are queued and smoothly executed one per tick.

5. **Score & Best Score**:
   - Food increases score by **+10 points** and increases body length by 1 segment.
   - High score is automatically persisted in `localStorage`.
   - Restart cleanly resets current score to 0 while preserving the Best score.

6. **Desktop Support**:
   - Full keyboard support: Arrow keys and **W / A / S / D**.
   - `Space` or `P` toggles pause.
   - `Enter` restarts when Game Over.

---

## 🚀 How to Run

Open `index.html` directly in your browser or run any static web server (such as Vite, Live Server, or Python `http.server`).
