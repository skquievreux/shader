/**
 * Matrix Rain Animation
 * Erzeugt cyberpunk-ähnliche digitale Regeneffekte mit Zeichenfällen
 */

class MatrixRain {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.frameSkip = 0;
        this.lastMatrixUpdate = 0;
        this.adaptiveQuality = new AdaptiveQuality();
        
        // Parameter mit Standardwerten
        this.columns = [];
        this.config = {
            columnCount: 100,
            dropSpeed: 2,
            fontSize: 14,
            fadeSpeed: 0.05,
            colorScheme: 'matrix', // matrix, blue, red, rainbow, cyber
            backgroundColor: '#000000',
            characterDensity: 0.8,
            glowIntensity: 0.8
        };
        
        // Zeichen-Sets für verschiedene Effekte
        this.characterSets = {
            matrix: 'ｱｲｳｴﾵﾶﾷｸｹｺｻｼﾽﾾ﾿0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            blue: '01ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾅｼﾍﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789',
            red: '血殺死地獄鬼怨魔神仏死無道悪魔界獄堕獄魔神仏死無道悪魔界獄堕',
            rainbow: '★☆♠♣♥♦♪♫☀☁☂☃☄☽☾◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥◦◧◨◩',
            cyber: '░▒▓│┤╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▀▐█▌▄▌▐▀▄▌▄▌▐▀▄▌▄▌▐▀▄▌▄▌▐▀▄▌▄▌▐▀▄▌▄▌▐▀▄▌'
        };
        
        // Farbschemata
        this.colorSchemes = {
            matrix: {
                primary: '#00FF00',
                secondary: '#00CC00',
                tertiary: '#009900',
                glow: '#00FF00',
                text: '#FFFFFF'
            },
            blue: {
                primary: '#00FFFF',
                secondary: '#00CCCC',
                tertiary: '#009999',
                glow: '#00FFFF',
                text: '#FFFFFF'
            },
            red: {
                primary: '#FF0000',
                secondary: '#CC0000',
                tertiary: '#990000',
                glow: '#FF0000',
                text: '#FFFF00'
            },
            rainbow: {
                primary: '#FF00FF',
                secondary: '#00FFFF',
                tertiary: '#FFFF00',
                glow: '#FF00FF',
                text: '#FFFFFF'
            },
            cyber: {
                primary: '#00FF41',
                secondary: '#00CC33',
                tertiary: '#009926',
                glow: '#00FF41',
                text: '#FFFFFF'
            }
        };
        
        // Zeit für Animationen
        this.time = 0;
        
        // Initialisierung
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createColumns();
        this.createGradientCache();
    }
    
    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        
        // Spalten bei Größenänderung neu erstellen
        this.createColumns();
    }
    
    createColumns() {
        this.columns = [];
        const columnWidth = this.canvas.width / this.config.columnCount;
        
        for (let i = 0; i < this.config.columnCount; i++) {
            this.columns.push({
                x: i * columnWidth,
                drops: [],
                speed: this.config.dropSpeed + (Math.random() - 0.5) * 1,
                characterSet: this.characterSets[this.config.colorScheme],
                colors: this.colorSchemes[this.config.colorScheme]
            });
            
            // Initiale Tropfen erstellen
            const dropCount = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < dropCount; j++) {
                this.columns[i].drops.push(this.createDrop(i, j * 20));
            }
        }
    }
    
    createDrop(columnIndex, yOffset = 0) {
        const column = this.columns[columnIndex];
        const characterSet = column.characterSet;
        const colors = column.colors;
        
        return {
            y: -yOffset,
            speed: column.speed + (Math.random() - 0.5) * 0.5,
            characters: [],
            opacity: 1.0,
            length: Math.floor(Math.random() * 15) + 10,
            glowPhase: Math.random() * Math.PI * 2,
            glowSpeed: Math.random() * 0.1 + 0.05
        };
    }
    
    createGradientCache() {
        // Glow-Gradienten für verschiedene Farbschemata
        Object.keys(this.colorSchemes).forEach(scheme => {
            const colors = this.colorSchemes[scheme];
            const key = `glow_${scheme}`;
            
            if (!this.gradientCache.has(key)) {
                const gradient = this.ctx.createLinearGradient(0, 0, 0, 50);
                gradient.addColorStop(0, colors.glow);
                gradient.addColorStop(0.5, colors.primary);
                gradient.addColorStop(1, 'transparent');
                this.gradientCache.set(key, gradient);
            }
        });
    }
    
    updateColumns() {
        this.columns.forEach((column, columnIndex) => {
            // Neue Tropfen erstellen
            if (Math.random() < this.config.characterDensity * 0.02) {
                column.drops.push(this.createDrop(columnIndex));
            }
            
            // Bestehende Tropfen aktualisieren
            column.drops = column.drops.filter(drop => {
                // Position aktualisieren
                drop.y += drop.speed;
                
                // Zeichen generieren
                if (drop.characters.length < drop.length) {
                    if (Math.random() < this.config.characterDensity) {
                        const charIndex = Math.floor(Math.random() * column.characterSet.length);
                        drop.characters.push({
                            char: column.characterSet[charIndex],
                            y: drop.y,
                            opacity: 1.0,
                            color: this.getCharacterColor(column.colors, drop.characters.length)
                        });
                    }
                }
                
                // Zeichen-Opacity aktualisieren (Fade-Effekt)
                drop.characters.forEach((char, index) => {
                    const age = drop.characters.length - index;
                    char.opacity = Math.max(0, 1 - (age / drop.length) * this.config.fadeSpeed);
                });
                
                // Glow-Animation
                drop.glowPhase += drop.glowSpeed;
                
                // Tropfen entfernen wenn außerhalb des Bildschirms
                return drop.y < this.canvas.height + 50;
            });
        });
    }
    
    getCharacterColor(colors, position) {
        if (position === 0) {
            return colors.text; // Erste Zeichen leuchten
        } else if (position === 1) {
            return colors.primary; // Zweite Zeichen primärfarbe
        } else if (position < 5) {
            return colors.secondary; // Mittlere Zeichen sekundärfarbe
        } else {
            return colors.tertiary; // Ältere Zeichen tertiärfarbe
        }
    }
    
    drawBackground() {
        // Schwarzer Hintergrund mit leichtem Gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.5, '#0a0a0a');
        gradient.addColorStop(1, '#000000');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawColumns() {
        this.columns.forEach(column => {
            column.drops.forEach(drop => {
                drop.characters.forEach((charData, index) => {
                    const y = charData.y;
                    const x = column.x;
                    
                    // Zeichen zeichnen
                    this.ctx.save();
                    
                    // Glow-Effekt
                    if (index === 0) { // Nur für das erste Zeichen
                        const glowIntensity = Math.sin(drop.glowPhase) * 0.3 + 0.7;
                        this.ctx.globalAlpha = charData.opacity * glowIntensity * this.config.glowIntensity;
                        
                        const glowKey = `glow_${this.config.colorScheme}`;
                        const gradient = this.gradientCache.get(glowKey);
                        
                        if (gradient) {
                            this.ctx.fillStyle = gradient;
                            this.ctx.fillRect(x - 10, y - 10, 20, 50);
                        }
                    }
                    
                    // Zeichen selbst
                    this.ctx.globalAlpha = charData.opacity;
                    this.ctx.fillStyle = charData.color;
                    this.ctx.font = `${this.config.fontSize}px monospace`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    
                    // Zeichen mit leichtem Schatten
                    this.ctx.shadowBlur = 2;
                    this.ctx.shadowColor = charData.color;
                    
                    this.ctx.fillText(charData.char, x, y);
                    
                    this.ctx.restore();
                });
            });
        });
    }
    
    drawScanlines() {
        // Subtile Scanline-Effekte für retro Look
        this.ctx.save();
        this.ctx.globalAlpha = 0.1;
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.lineWidth = 1;
        
        for (let y = 0; y < this.canvas.height; y += 3) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawDigitalNoise() {
        // Leichtes digitales Rauschen
        this.ctx.save();
        this.ctx.globalAlpha = 0.05;
        
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const brightness = Math.random();
            
            this.ctx.fillStyle = brightness > 0.5 ? '#00FF00' : '#000000';
            this.ctx.fillRect(x, y, 2, 2);
        }
        
        this.ctx.restore();
    }
    
    update() {
        this.time += 0.016; // ~60fps
        this.updateColumns();
    }
    
    draw() {
        this.drawBackground();
        this.drawColumns();
        
        // Optionale Effekte basierend auf Zeit
        if (Math.sin(this.time * 0.5) > 0) {
            this.drawScanlines();
        }
        
        if (Math.random() < 0.1) {
            this.drawDigitalNoise();
        }
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
        // Maus-Interaktion für Geschwindigkeitsänderung
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            const speedFactor = mouseY / this.canvas.height;
            
            this.columns.forEach(column => {
                column.speed = this.config.dropSpeed * (0.5 + speedFactor * 2);
            });
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.columns.forEach(column => {
                column.speed = this.config.dropSpeed;
            });
        });
        
        // Klick für neue Tropfen-Welle
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const columnIndex = Math.floor(clickX / (this.canvas.width / this.config.columnCount));
            
            if (columnIndex >= 0 && columnIndex < this.columns.length) {
                // Mehrere Tropfen gleichzeitig erstellen
                for (let i = 0; i < 5; i++) {
                    this.columns[columnIndex].drops.push(this.createDrop(columnIndex, i * 10));
                }
            }
        });
        
        // Touch-Events für Mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const touchY = touch.clientY - rect.top;
            const speedFactor = touchY / this.canvas.height;
            
            this.columns.forEach(column => {
                column.speed = this.config.dropSpeed * (0.5 + speedFactor * 2);
            });
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const touchX = touch.clientX - rect.left;
            const columnIndex = Math.floor(touchX / (this.canvas.width / this.config.columnCount));
            
            if (columnIndex >= 0 && columnIndex < this.columns.length) {
                for (let i = 0; i < 3; i++) {
                    this.columns[columnIndex].drops.push(this.createDrop(columnIndex, i * 10));
                }
            }
        });
        
        // Window-Resize
        window.addEventListener('resize', () => {
            this.resize();
        });
        
        // Performance-Monitoring
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.registerAnimation('matrix-rain', this);
        }
    }
    
    // Steuerungsmethoden
    setColorScheme(scheme) {
        if (this.characterSets[scheme] && this.colorSchemes[scheme]) {
            this.config.colorScheme = scheme;
            this.createColumns();
            this.createGradientCache();
        }
    }
    
    setDropSpeed(speed) {
        this.config.dropSpeed = Math.max(0.5, Math.min(10, speed));
        this.columns.forEach(column => {
            column.speed = this.config.dropSpeed;
        });
    }
    
    setFontSize(size) {
        this.config.fontSize = Math.max(8, Math.min(30, size));
    }
    
    setColumnCount(count) {
        this.config.columnCount = Math.max(20, Math.min(200, count));
        this.createColumns();
    }
    
    setCharacterDensity(density) {
        this.config.characterDensity = Math.max(0.1, Math.min(1, density));
    }
    
    setGlowIntensity(intensity) {
        this.config.glowIntensity = Math.max(0, Math.min(2, intensity));
    }
    
    // Cleanup-Methode
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Event-Listener entfernen
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('resize', this.handleResize);
        
        // Cache leeren
        this.gradientCache.clear();
        
        // Arrays leeren
        this.columns = [];
    }
}

// Globale Initialisierungsfunktion
function initMatrixRain(canvasId) {
    return new MatrixRain(canvasId);
}

// Export für Module-Systeme
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MatrixRain, initMatrixRain };
}