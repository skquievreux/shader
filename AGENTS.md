# AGENTS.md

## Build/Test Commands
- `npm start` - Opens index.html in browser
- `npm run dev` - Starts Python HTTP server on port 8000
- `npm run demo` - Opens aurora-demo.html
- `npm test` - Opens both index.html and aurora-demo.html for visual testing

## Code Style Guidelines

### JavaScript/TypeScript
- Use ES6+ classes for all animations with consistent API: `init()`, `update()`, `draw()`, `animate()`
- camelCase for variables/functions, PascalCase for classes
- Use `const` by default, `let` only when reassignment needed
- Canvas context: `getContext('2d', { willReadFrequently: true })`
- Performance: `requestAnimationFrame` for 60fps animations
- Event handling: Support both mouse and touch events

### CSS/HTML
- CSS variables for theming in `:root`
- Mobile-first responsive design
- Use semantic HTML5 elements
- Grid/Flexbox for layouts

### File Structure
- One animation per `.js` file with matching class name
- German comments and documentation preferred
- No external dependencies - vanilla JavaScript only

### Error Handling
- Graceful degradation for unsupported features
- Parameter validation with fallback defaults
- Canvas resize handling with re-initialization

### Naming Conventions
- Animation files: kebab-case (e.g., `energy-field.js`)
- Canvas IDs: kebab-case matching animation
- Parameters: descriptive English names (e.g., `particleCount`, `intensity`)