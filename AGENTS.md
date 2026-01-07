# 🎨 Shader Project - Animation & Visualization Library

**Projekt:** Canvas-basierte Animationen mit Vanilla JavaScript  
**Technologie:** HTML5 Canvas, ES6+, keine externen Dependencies  
**Status:** Active Development  

---

## 🚀 Build/Test Commands

```bash
# Development & Testing
npm start              # Opens index.html in browser
npm run dev           # Starts Python HTTP server on port 8000
npm run demo          # Opens aurora-demo.html
npm test              # Opens both index.html and aurora-demo.html for visual testing

# Code Quality (if applicable)
npm run lint          # Run ESLint (Next.js project)
npm run test:ui       # Run Playwright tests with UI
npm run test:debug    # Run Playwright tests in debug mode
```

---

## 🎯 Project Standards

### JavaScript/Canvas Animations

```typescript
// ✅ REQUIRED: Class-based animation structure
class AnimationName {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d', { 
      willReadFrequently: true 
    })!;
  }

  init(): void {
    // Initialize animation state
  }

  update(): void {
    // Update animation state
  }

  draw(): void {
    // Draw current frame
  }

  animate(): void {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
```

### Code Style Guidelines

```yaml
JavaScript/TypeScript:
  - Use ES6+ classes with consistent API: init(), update(), draw(), animate()
  - camelCase for variables/functions, PascalCase for classes
  - Use `const` by default, `let` only for reassignment
  - Canvas context: getContext('2d', { willReadFrequently: true })
  - Performance: requestAnimationFrame for 60fps animations
  - Support both mouse and touch events
  - ESLint: Unused vars warn with `_` prefix, `any` allowed for flexibility

File Structure:
  - One animation per `.js` file with matching class name
  - German comments and documentation preferred
  - No external dependencies - pure vanilla JavaScript
  - Canvas IDs: kebab-case matching animation file

Error Handling:
  - Graceful degradation for unsupported features
  - Parameter validation with fallback defaults
  - Canvas resize handling with re-initialization
  - Proper cleanup in destroy() method

Naming Conventions:
  - Animation files: kebab-case (energy-field.js)
  - Canvas IDs: kebab-case matching animation
  - Parameters: descriptive English names (particleCount, intensity)
  - Event handlers: handle + action (handleClick, handleMouseMove)
```

---

## 📁 File Organization

```
project-root/
├── animations/
│   ├── aurora.js              # Aurora borealis animation
│   ├── energy-field.js        # Energy field visualization
│   ├── firework.js            # Firework effects
│   ├── matrix-rain.js         # Matrix-style rain
│   └── star-field.js          # Star field animation
├── demos/
│   ├── aurora-demo.html       # Aurora showcase
│   ├── index.html             # Main demo page
│   └── performance-test.html  # Performance testing
├── styles/
│   ├── styles.css             # Base styles
│   ├── landing-styles.css     # Landing page styles
│   └── performance-styles.css # Performance test styles
├── utils/
│   ├── performance-monitor.js  # FPS monitoring
│   ├── resource-pool.js       # Resource management
│   └── adaptive-quality.js    # Adaptive quality
├── package.json              # Project configuration
└── README.md                 # Documentation
```

---

## 🎨 Animation Standards

### Performance Requirements

```typescript
// ✅ GOOD: Performance-optimized animation
class OptimizedAnimation {
  private particles: Particle[] = [];
  private lastTime = 0;
  private targetFPS = 60;

  animate(currentTime: number): void {
    // Frame rate limiting for consistent performance
    if (currentTime - this.lastTime < 1000 / this.targetFPS) {
      return;
    }
    this.lastTime = currentTime;

    // Clear canvas efficiently
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Batch operations when possible
    this.ctx.save();
    // ... draw operations
    this.ctx.restore();
  }
}
```

### Responsive Canvas Handling

```typescript
// ✅ REQUIRED: Responsive canvas setup
private setupCanvas(): void {
  const resizeCanvas = () => {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}
```

### Event Handling

```typescript
// ✅ GOOD: Mouse + touch event support
private setupEvents(): void {
  // Mouse events
  this.canvas.addEventListener('mousemove', (e) => {
    this.handleInteraction(e.clientX, e.clientY);
  });

  // Touch events
  this.canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    this.handleInteraction(touch.clientX, touch.clientY);
    e.preventDefault(); // Prevent scrolling
  });
}

private handleInteraction(x: number, y: number): void {
  // Centralized interaction handling
}
```

---

## 🔧 Development Guidelines

### Animation Initialization

```typescript
// ✅ STANDARD: Animation bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const animations: AnimationName[] = [];

  // Initialize animations
  const aurora = new AuroraAnimation('aurora-canvas');
  const energyField = new EnergyField('energy-canvas');
  
  animations.push(aurora, energyField);

  // Start animations
  animations.forEach(animation => {
    animation.init();
    animation.animate();
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    animations.forEach(animation => animation.destroy());
  });
});
```

### Configuration Pattern

```typescript
// ✅ RECOMMENDED: Configuration objects
interface AnimationConfig {
  particleCount: number;
  speed: number;
  color: string;
  intensity: number;
}

const defaultConfig: AnimationConfig = {
  particleCount: 100,
  speed: 1.0,
  color: '#ffffff',
  intensity: 0.5
};

class ConfigurableAnimation {
  constructor(
    canvasId: string, 
    private config: Partial<AnimationConfig> = {}
  ) {
    this.config = { ...defaultConfig, ...config };
  }
}
```

---

## 📊 Performance Monitoring

```typescript
// ✅ OPTIONAL: FPS and performance tracking
class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;

  update(): void {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      console.log(`FPS: ${this.fps}`);
    }
  }

  getFPS(): number {
    return this.fps;
  }
}
```

---

## 🧪 Testing Guidelines

### Visual Testing

```bash
# Manual visual testing checklist
□ Animation runs smoothly at 60fps
□ Responsive on mobile devices
□ Touch events work correctly
□ No memory leaks (check browser dev tools)
□ Performance degrades gracefully
□ Canvas resizes properly
□ Multiple animations can run simultaneously
```

### Cross-Browser Compatibility

```yaml
✅ SUPPORTED:
  - Chrome/Chromium (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)
  - Mobile Chrome/Safari

⚠️ TEST CAREFULLY:
  - Canvas 2D context support
  - requestAnimationFrame performance
  - Touch event handling
  - High DPI displays (devicePixelRatio)
```

---

## 📋 Pre-Commit Checklist

```yaml
Code Quality:
□ JavaScript syntax is valid
□ Animation class follows standard API
□ Event handlers include both mouse and touch support
□ Canvas setup includes responsive handling
□ Performance optimizations implemented
□ Memory cleanup in destroy() method

File Organization:
□ File naming follows kebab-case convention
□ Canvas ID matches animation file name
□ German comments for complex logic
□ No external dependencies added
□ Configuration objects are properly typed

Testing:
□ Visual testing completed
□ Cross-browser compatibility checked
□ Performance measured (target: 60fps)
□ Mobile responsiveness verified
□ Memory leak testing performed
```

---

## 🚨 Common Pitfalls to Avoid

```yaml
❌ CRITICAL ERRORS:
  - Forgetting to cancelAnimationFrame in cleanup
  - Not handling high DPI displays properly
  - Memory leaks from unclosed event listeners
  - Missing touch event support for mobile
  - Hard-coded canvas dimensions

⚠️ WARNINGS:
  - Inefficient canvas clearing (use fillRect with alpha)
  - Missing error handling for unsupported features
  - No performance monitoring for optimization
  - Not using requestAnimationFrame consistently
```

---

## 📞 Support & Documentation

- **Main Documentation:** README.md
- **Performance Tools:** utils/performance-monitor.js
- **Resource Management:** utils/resource-pool.js
- **Quality Control:** utils/adaptive-quality.js
- **Examples:** demos/ directory

**For animation-specific questions:** Check existing animations for patterns, then follow the established class structure and API conventions.