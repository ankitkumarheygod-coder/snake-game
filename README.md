# Mobile Snake Game (GitHub Pages Ready)

A modern, mobile-first, zero-dependency classic Snake Game built purely with HTML, CSS, and Vanilla JavaScript (ES Modules).

## 🚀 Features
- **Mobile-First Touch Controls**: 100% control by swiping anywhere on the game board. NO on-screen buttons!
- **Accidental Touch Prevention**: Smart input queue and swipe threshold (~25px).
- **Wrap-Around Boundary**: Hitting the wall doesn't end the game; the snake wraps around to the other side.
- **Self-Collision Logic**: Game over ONLY happens if the snake hits its own body.
- **High DPI Rendering**: Sharp canvas graphics natively scaled for high pixel-density mobile screens.
- **Save State**: Best Score is cached natively in `localStorage`.

## 🛠️ Setup / Deployment
This game doesn't require any build system, bundler (like Webpack or Vite), or server. 

### To Deploy on GitHub Pages:
1. Create a new GitHub repository.
2. Upload all the files maintaining the exact folder structure:
   - `index.html`
   - `css/style.css`
   - `js/game.js`, `js/controls.js`, `js/food.js`, `js/ui.js`
3. Go to **Settings > Pages**.
4. Set the source branch to `main` (or `master`) and folder to `/(root)`.
5. Click Save. Within a minute, your game will be live via the given URL!

## 🎮 How to Play
- **Mobile**: Swipe `Up`, `Down`, `Left`, or `Right` directly on the game board. 
- **Desktop**: Use `Arrow Keys` or `W, A, S, D`.
- **Rules**: Eat the red food to grow and speed up. Avoid hitting your own green body!
