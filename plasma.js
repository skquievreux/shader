/**
 * Plasma Animation
 * Erzeugt elektrische Energieeffekte mit mathematischen Plasma-Funktionen
 */

class Plasma {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.frameSkip = 0;
        this.lastPlasmaUpdate = 0;
        this.adaptiveQuality = new AdaptiveQuality();
        
        // Parameter mit Standardwerten
        this.config = {
            resolution: 4, // Pixelgröße für Plasma-Berechnung
            colorScheme: 'electric', // electric, fire, ice, rainbow, matrix
            speed: 0.02,
            intensity: 1.0,
            zoom: 1.0,
            backgroundColor: '#000000',
            plasmaColors: {
                electric: ['#0000FF', '#00FFFF', '#FFFFFF', '#FF00FF', '#FF0000'],
                fire: ['#FF0000', '#FF7F00', '#FFFF00', '#FFFFFF', '#FF8C00'],
                ice: ['#00FFFF', '#87CEEB', '#FFFFFF', '#B0E0E6', '#4682B4'],
                rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
                matrix: ['#00FF00', '#00FF7F', '#00FFFF', '#7FFF00', '#FFFFFF']
            }
        };
        
        // Plasma-Parameter
        this.time = 0;
        this.plasmaData = null;
        this.imageData = null;
        this.colorPalette = [];
        
        // Energiezentren für interaktive Effekte
        this.energyCenters = [];
        
        // Initialisierung
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createColorPalette();
        this.createPlasmaBuffer();
        this.createGradientCache();
    }
    
    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        
        // Plasma-Daten neu erstellen
        this.createPlasmaBuffer();
    }
    
    createColorPalette() {
        this.colorPalette = [];
        const colors = this.config.plasmaColors[this.config.colorScheme];
        
        // Farbverlauf für Plasma erstellen
        for (let i = 0; i < 256; i++) {
            const position = i / 255;
            const colorIndex = Math.floor(position * (colors.length - 1));
            const localPosition = (position * (colors.length - 1)) % 1;
            
            // Farbinterpolation
            const color1 = this.hexToRgb(colors[colorIndex]);
            const color2 = this.hexToRgb(colors[Math.min(colorIndex + 1, colors.length - 1)]);
            
            const r = Math.floor(color1.r + (color2.r - color1.r) * localPosition);
            const g = Math.floor(color1.g + (color2.g - color1.g) * localPosition);
            const b = Math.floor(color1.b + (color2.b - color1.b) * localPosition);
            
            this.colorPalette.push({ r, g, b });
        }
    }
    
    createPlasmaBuffer() {
        const width = Math.ceil(this.canvas.width / this.config.resolution);
        const height = Math.ceil(this.canvas.height / this.config.resolution);
        
        this.plasmaData = new Float32Array(width * height);
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }
    
    createGradientCache() {
        // Hintergrund-Gradienten für verschiedene Farbschemata
        Object.keys(this.config.plasmaColors).forEach(scheme => {
            const key = `bg_${scheme}`;
            if (!this.gradientCache.has(key)) {
                const gradient = this.ctx.createRadialGradient(
                    this.canvas.width / 2, this.canvas.height / 2, 0,
                    this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
                );
                
                const colors = this.config.plasmaColors[scheme];
                colors.forEach((color, index) => {
                    const position = index / (colors.length - 1);
                    gradient.addColorStop(position, color + '20'); // Mit Transparenz
                });
                
                this.gradientCache.set(key, gradient);
            }
        });
    }
    
    calculatePlasma(x, y, time) {
        const width = Math.ceil(this.canvas.width / this.config.resolution);
        const height = Math.ceil(this.canvas.height / this.config.resolution);
        
        // Normalisierte Koordinaten
        const nx = x / width;
        const ny = y / height;
        
        // Plasma-Funktionen (kombination verschiedener mathematischer Funktionen)
        let plasma = 0;
        
        // Funktion 1: Sinuswellen
        plasma += Math.sin(nx * Math.PI * 4 + time);
        
        // Funktion 2: Kosinuswellen mit Phasenverschiebung
        plasma += Math.sin((ny * Math.PI * 3) + time * 1.5);
        
        // Funktion 3: Kombinierte Sinus/Kosinus
        plasma += Math.sin((nx + ny) * Math.PI * 2 + time * 0.5);
        
        // Funktion 4: Radiale Wellen
        const centerX = 0.5 + Math.sin(time * 0.3) * 0.1;
        const centerY = 0.5 + Math.cos(time * 0.2) * 0.1;
        const distance = Math.sqrt((nx - centerX) ** 2 + (ny - centerY) ** 2);
        plasma += Math.sin(distance * Math.PI * 8 - time * 2);
        
        // Funktion 5: Turbulenz
        plasma += Math.sin(nx * Math.PI * 6 + time) * Math.cos(ny * Math.PI * 4 + time * 0.7);
        
        // Energiezentren einbeziehen
        this.energyCenters.forEach(center => {
            const distToCenter = Math.sqrt((nx - center.x) ** 2 + (ny - center.y) ** 2);
            const influence = Math.sin(distToCenter * Math.PI * 10 - time * 3) * center.intensity;
            plasma += influence * Math.exp(-distToCenter * 5); // Abfallende Einflussnahme
        });
        
        // Normalisieren auf 0-1 Bereich
        plasma = (plasma + 4) / 8; // Durchschnitt und Normalisierung
        plasma = Math.max(0, Math.min(1, plasma));
        
        return plasma;
    }
    
    updatePlasma() {
        const width = Math.ceil(this.canvas.width / this.config.resolution);
        const height = Math.ceil(this.canvas.height / this.config.resolution);
        
        // Plasma für jeden Pixel berechnen
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;
                this.plasmaData[index] = this.calculatePlasma(x, y, this.time);
            }
        }
    }
    
    updateEnergyCenters() {
        // Energiezentren aktualisieren
        this.energyCenters.forEach(center => {
            center.x += center.vx;
            center.y += center.vy;
            center.intensity = 0.5 + Math.sin(this.time * center.pulseSpeed) * 0.5;
            
            // Randbegrenzung mit Wrap-around
            if (center.x < 0) center.x = 1;
            if (center.x > 1) center.x = 0;
            if (center.y < 0) center.y = 1;
            if (center.y > 1) center.y = 0;
        });
    }
    
    renderPlasma() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const data = this.imageData.data;
        const plasmaWidth = Math.ceil(width / this.config.resolution);
        
        // Plasma-Daten in Image-Data umwandeln
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const plasmaX = Math.floor(x / this.config.resolution);
                const plasmaY = Math.floor(y / this.config.resolution);
                const plasmaIndex = plasmaY * plasmaWidth + plasmaX;
                
                const plasmaValue = this.plasmaData[plasmaIndex];
                const colorIndex = Math.floor(plasmaValue * 255);
                const color = this.colorPalette[colorIndex];
                
                const pixelIndex = (y * width + x) * 4;
                data[pixelIndex] = color.r;
                data[pixelIndex + 1] = color.g;
                data[pixelIndex + 2] = color.b;
                data[pixelIndex + 3] = 255; // Alpha
            }
        }
        
        this.ctx.putImageData(this.imageData, 0, 0);
    }
    
    drawEnergyCenters() {
        this.energyCenters.forEach(center => {
            const x = center.x * this.canvas.width;
            const y = center.y * this.canvas.height;
            
            // Glow-Effekt für Energiezentrum
            this.ctx.save();
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 50);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${center.intensity * 0.8})`);
            gradient.addColorStop(0.3, `rgba(255, 255, 255, ${center.intensity * 0.4})`);
            gradient.addColorStop(0.6, `rgba(255, 255, 255, ${center.intensity * 0.2})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 50, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Kern
            this.ctx.fillStyle = `rgba(255, 255, 255, ${center.intensity})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawBackground() {
        // Hintergrund mit Gradient
        const bgKey = `bg_${this.config.colorScheme}`;
        const gradient = this.gradientCache.get(bgKey);
        
        if (gradient) {
            this.ctx.fillStyle = gradient;
        } else {
            this.ctx.fillStyle = this.config.backgroundColor;
        }
        
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    update() {
        this.time += this.config.speed;
        this.updatePlasma();
        this.updateEnergyCenters();
    }
    
    draw() {
        this.drawBackground();
        this.renderPlasma();
        this.drawEnergyCenters();
    }
    
    animate() {
        if (this.adaptiveQuality && this.adaptiveQuality.shouldSkipFrame()) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        // Maus-Interaktion für Energiezentren
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / this.canvas.width;
            const y = (e.clientY - rect.top) / this.canvas.height;
            
            // Neues Energiezentrum hinzufügen (max 5)
            if (this.energyCenters.length < 5) {
                this.energyCenters.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 0.01,
                    vy: (Math.random() - 0.5) * 0.01,
                    intensity: 1.0,
                    pulseSpeed: Math.random() * 0.05 + 0.02
                });
            }
        });
        
        // Rechtsklick entfernt Energiezentrum
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.energyCenters.length > 0) {
                this.energyCenters.pop();
            }
        });
        
        // Touch-Events für Mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = (touch.clientX - rect.left) / this.canvas.width;
            const y = (touch.clientY - rect.top) / this.canvas.height;
            
            if (this.energyCenters.length < 5) {
                this.energyCenters.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 0.01,
                    vy: (Math.random() - 0.5) * 0.01,
                    intensity: 1.0,
                    pulseSpeed: Math.random() * 0.05 + 0.02
                });
            }
        });
        
        // Window-Resize
        window.addEventListener('resize', () => {
            this.resize();
        });
        
        // Performance-Monitoring
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.registerAnimation('plasma', this);
        }
    }
    
    // Steuerungsmethoden
    setColorScheme(scheme) {
        if (this.config.plasmaColors[scheme]) {
            this.config.colorScheme = scheme;
            this.createColorPalette();
            this.createGradientCache();
        }
    }
    
    setSpeed(speed) {
        this.config.speed = Math.max(0, Math.min(0.1, speed));
    }
    
    setIntensity(intensity) {
        this.config.intensity = Math.max(0.1, Math.min(2, intensity));
    }
    
    setResolution(resolution) {
        this.config.resolution = Math.max(1, Math.min(10, resolution));
        this.createPlasmaBuffer();
    }
    
    setZoom(zoom) {
        this.config.zoom = Math.max(0.5, Math.min(3, zoom));
    }
    
    clearEnergyCenters() {
        this.energyCenters = [];
    }
    
    // Cleanup-Methode
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Event-Listener entfernen
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('resize', this.handleResize);
        
        // Cache leeren
        this.gradientCache.clear();
        
        // Arrays leeren
        this.energyCenters = [];
        this.plasmaData = null;
        this.imageData = null;
        this.colorPalette = [];
    }
}

// Globale Initialisierungsfunktion
function initPlasma(canvasId) {
    return new Plasma(canvasId);
}

// Export für Module-Systeme
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Plasma, initPlasma };
}