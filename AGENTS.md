# 🎨 Shader Project - Agent Guidelines

## 🚀 Commands
```bash
npm start          # Opens landing.html in browser
npm run dev        # Python HTTP server on port 8000
npm run demo       # Opens landing.html (alias)
npm test           # Visual testing - opens landing.html
```

## 🎯 Code Style

### Animation Classes
```javascript
class AnimationName {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  init() { /* Initialize state */ }
  update() { /* Update animation state */ }
  draw() { /* Draw current frame */ }
  animate() { 
    this.update(); 
    this.draw(); 
    requestAnimationFrame(() => this.animate()); 
  }
  resize() { /* Handle canvas resize */ }
}

// Bootstrap pattern
document.addEventListener('DOMContentLoaded', () => {
  const animation = new AnimationName('canvas-id');
  animation.init();
  animation.animate();
});
```

### Standards
- **Files**: kebab-case.js (matching canvas ID)
- **Classes**: PascalCase, camelCase for methods/properties
- **Dependencies**: None - pure vanilla JavaScript
- **Events**: Support both mouse and touch events
- **Performance**: requestAnimationFrame, responsive canvas with devicePixelRatio
- **Comments**: German preferred for complex logic
- **Error handling**: Graceful degradation, validate parameters
- **Memory**: Proper cleanup, remove event listeners

### Canvas Setup
```javascript
resize() {
  const rect = this.canvas.getBoundingClientRect();
  this.canvas.width = rect.width * window.devicePixelRatio;
  this.canvas.height = rect.height * window.devicePixelRatio;
  this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
```

## 📁 Structure
- One animation per .js file in root
- Matching HTML files for demos
- No external dependencies
- Performance optimizations with SpatialGrid, AdaptiveQuality utilities