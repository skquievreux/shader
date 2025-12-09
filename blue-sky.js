/**
 * Blauer Himmel Animation
 * Erzeugt eine Wolkenanimation, die den Himmel darstellt
 */

class BlueSky {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.adaptiveQuality = new AdaptiveQuality();
        
        // Parameter mit Standardwerten
        this.clouds = [];
        this.cloudCount = 15;
        this.windSpeed = 3;
        this.skyColor = '#4dabf7';
        
        // Canvas-Größe anpassen
        this.resize();
        
        // Event-Listener
        window.addEventListener('resize', () => this.resize());
        
        // Steuerelemente einrichten
        this.setupControls();
        
        // Animation initialisieren
        this.init();
        this.animate();
    }
    
    resize() {
        // Canvas auf Elterngrößen anpassen
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        
        // Bei Größenänderung Wolken neu initialisieren
        if (this.clouds.length > 0) {
            this.init();
        }
    }
    
init() {
        // Wolken erstellen (adaptive Anzahl)
        this.clouds = [];
        const adaptiveCount = Math.floor(this.cloudCount * this.adaptiveQuality.getParticleMultiplier());
        for (let i = 0; i < adaptiveCount; i++) {
            this.addCloud(true);
        }
    }
    
    addCloud(isInitial = false) {
        // Zufällige Größe für die Wolke
        const scale = Math.random() * 0.5 + 0.5;
        
        // Position bestimmen
        const x = isInitial 
            ? Math.random() * this.canvas.width 
            : -150 * scale;
        const y = Math.random() * (this.canvas.height * 0.7);
        
        // Wolkenobjekt erstellen
        const cloud = {
            x,
            y,
            scale,
            speed: (Math.random() * 0.5 + 0.5) * this.windSpeed,
            opacity: Math.random() * 0.3 + 0.7,
            sections: []
        };
        
        // 3-5 Abschnitte für die Wolke erstellen
        const sectionCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < sectionCount; i++) {
            cloud.sections.push({
                radius: Math.random() * 40 + 30,
                offsetX: Math.random() * 100 - 20,
                offsetY: Math.random() * 20
            });
        }
        
        this.clouds.push(cloud);
        return cloud;
    }
    
    setupControls() {
        // Steuerelemente für Wolkendichte
        const cloudSlider = document.getElementById('sky-clouds');
        if (cloudSlider) {
            cloudSlider.addEventListener('input', () => {
                this.cloudCount = parseInt(cloudSlider.value);
                this.init();
            });
        }
        
        // Steuerelemente für Windgeschwindigkeit
        const speedSlider = document.getElementById('sky-speed');
        if (speedSlider) {
            speedSlider.addEventListener('input', () => {
                this.windSpeed = parseInt(speedSlider.value);
                this.clouds.forEach(cloud => {
                    cloud.speed = (Math.random() * 0.5 + 0.5) * this.windSpeed;
                });
            });
        }
        
        // Steuerelemente für Himmelsfarbe
        const colorPicker = document.getElementById('sky-color');
        if (colorPicker) {
            colorPicker.addEventListener('input', () => {
                this.skyColor = colorPicker.value;
            });
        }
    }
    
// Gradient-Caching für Performance
    getCachedGradient(type, x1, y1, x2, y2, colors) {
        const key = `${type}-${x1}-${y1}-${x2}-${y2}-${JSON.stringify(colors)}`;
        if (!this.gradientCache.has(key)) {
            const gradient = type === 'linear' 
                ? this.ctx.createLinearGradient(x1, y1, x2, y2)
                : this.ctx.createRadialGradient(x1, y1, colors[0].radius || 0, x2, y2, colors[0].radius || 100);
            
            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1), color.color);
            });
            
            this.gradientCache.set(key, gradient);
            
            // Cache begrenzen
            if (this.gradientCache.size > 30) {
                const firstKey = this.gradientCache.keys().next().value;
                this.gradientCache.delete(firstKey);
            }
        }
        return this.gradientCache.get(key);
    }

    // Hilfsfunktion für Farbmanipulation mit Transparenz
    getCloudColor(opacity) {
        return `rgba(255, 255, 255, ${opacity})`;
    }
    
    drawCloud(cloud) {
        this.ctx.save();
        
        // Alle Abschnitte der Wolke zeichnen
        cloud.sections.forEach(section => {
            this.ctx.beginPath();
            this.ctx.arc(
                cloud.x + section.offsetX * cloud.scale, 
                cloud.y + section.offsetY * cloud.scale, 
                section.radius * cloud.scale, 
                0, 
                Math.PI * 2
            );
            this.ctx.fillStyle = this.getCloudColor(cloud.opacity);
            this.ctx.fill();
        });
        
        this.ctx.restore();
    }
    
draw() {
        this.adaptiveQuality.update();
        
        // Frame überspringen bei niedriger Qualität
        if (this.adaptiveQuality.shouldSkipFrame()) return;
        
        this.ctx.save();
        
        // Himmelshintergrund zeichnen (cached)
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.skyColor);
        let skyGradient;
        
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            
            skyGradient = this.getCachedGradient('linear', 0, 0, 0, this.canvas.height, [
                { color: `rgba(${r + 30 > 255 ? 255 : r + 30}, ${g + 30 > 255 ? 255 : g + 30}, ${b + 30 > 255 ? 255 : b + 30}, 1)` },
                { color: `rgba(${r}, ${g}, ${b}, 1)` },
                { color: `rgba(${r - 20 < 0 ? 0 : r - 20}, ${g - 10 < 0 ? 0 : g - 10}, ${b < 0 ? 0 : b}, 1)` }
            ]);
        } else {
            skyGradient = this.getCachedGradient('linear', 0, 0, 0, this.canvas.height, [
                { color: '#7cc0ff' },
                { color: '#4dabf7' },
                { color: '#3b95d3' }
            ]);
        }
        
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sonne zeichnen
        this.drawSun();
        
        // Alle Wolken zeichnen
        this.clouds.forEach(cloud => {
            this.drawCloud(cloud);
            
            // Wolken bewegen
            cloud.x += cloud.speed;
            
            // Wenn die Wolke das Canvas verlässt, neue erstellen
            if (cloud.x > this.canvas.width + 200 * cloud.scale) {
                // Index der aktuellen Wolke finden
                const index = this.clouds.indexOf(cloud);
                if (index !== -1) {
                    // Alte Wolke entfernen und neue hinzufügen
                    this.clouds.splice(index, 1);
                    this.addCloud();
                }
            }
        });
        
        this.ctx.restore();
    }
    
drawSun() {
        const sunX = this.canvas.width * 0.85;
        const sunY = this.canvas.height * 0.2;
        const sunRadius = 40;
        
        // Sonnenglow (cached)
        const glowGradient = this.getCachedGradient('radial', sunX, sunY, sunX, sunY, sunRadius * 2.5, [
            { color: 'rgba(255, 255, 200, 0.6)' },
            { color: 'rgba(255, 255, 200, 0.2)' },
            { color: 'rgba(255, 255, 200, 0)' }
        ]);
        
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, sunRadius * 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = glowGradient;
        this.ctx.fill();
        
        // Sonne (cached)
        const sunGradient = this.getCachedGradient('radial', 
            sunX - sunRadius * 0.2, sunY - sunRadius * 0.2, 
            sunX, sunY, sunRadius, [
            { color: '#fff9c4' },
            { color: '#ffd600' },
            { color: '#ffab00' }
        ]);
        
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = sunGradient;
        this.ctx.fill();
    }
    
animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Cleanup Methode für Memory Management
    destroy() {
        cancelAnimationFrame(this.animationId);
        this.gradientCache.clear();
        window.removeEventListener('resize', () => this.resize());
    }
}

// Funktion zum Initialisieren der Animation
function initBlueSky(canvasId) {
    return new BlueSky(canvasId);
}

// Automatische Initialisierung bei DOM-Bereitschaft
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('blue-sky-canvas');
    if (canvas) {
        console.log('Blue sky canvas found, initializing animation...');
        try {
            window.blueSkyAnimation = initBlueSky('blue-sky-canvas');
        } catch (e) {
            console.error('Error initializing blue sky animation:', e);
        }
    } else {
        console.error('Blue sky canvas element not found');
    }
});