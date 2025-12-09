/**
 * Wasserwellen-Animation
 * Erzeugt eine Wellenanimation, die den Ozean darstellt
 */

class WaterWaves {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.frameSkip = 0;
        this.adaptiveQuality = new AdaptiveQuality();
        
        // Parameter mit Standardwerten
        this.waveHeight = 20;
        this.waveSpeed = 4;
        this.waterColor = '#15aabf';
        this.time = 0;
        this.frequencyFactor = 0.03;
        this.mouseX = null;
        this.mouseY = null;
        this.mouseActive = false;
        this.mouseSplashTime = 0;
        this.splashes = [];
        
        // Canvas-Größe anpassen
        this.resize();
        
        // Event-Listener
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => { this.mouseActive = false; });
        this.canvas.addEventListener('mouseenter', () => { this.mouseActive = true; });
        this.canvas.addEventListener('click', (e) => this.createSplash(e));
        
        // Touch-Unterstützung
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.handleTouchMove(e);
                this.createSplash(e);
            }
        });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', () => { this.mouseActive = false; });
        
        // Steuerelemente einrichten
        this.setupControls();
        
        // Animation starten
        this.animate();
    }
    
    resize() {
        // Canvas auf Elterngrößen anpassen
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.mouseActive = true;
    }
    
    handleTouchMove(e) {
        if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.mouseY = e.touches[0].clientY - rect.top;
            this.mouseActive = true;
            e.preventDefault();
        }
    }
    
    createSplash(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        this.splashes.push({
            x,
            y,
            size: 0,
            maxSize: Math.random() * 40 + 30,
            speed: Math.random() * 2 + 3,
            opacity: 1
        });
        
        this.mouseSplashTime = this.time;
    }
    
    setupControls() {
        // Steuerelemente für Wellenhöhe
        const heightSlider = document.getElementById('waves-height');
        if (heightSlider) {
            heightSlider.addEventListener('input', () => {
                this.waveHeight = parseInt(heightSlider.value);
            });
        }
        
        // Steuerelemente für Wellengeschwindigkeit
        const speedSlider = document.getElementById('waves-speed');
        if (speedSlider) {
            speedSlider.addEventListener('input', () => {
                this.waveSpeed = parseInt(speedSlider.value);
            });
        }
        
        // Steuerelemente für Wasserfarbe
        const colorPicker = document.getElementById('waves-color');
        if (colorPicker) {
            colorPicker.addEventListener('input', () => {
                this.waterColor = colorPicker.value;
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

    // Funktion zur Farbmanipulation für Tiefeneffekt
    getColorVariation(depth) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.waterColor);
        if (!result) return '#15aabf';
        
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        
        // Dunklere Farbe für tieferes Wasser
        const depthFactor = 1 - Math.min(1, Math.max(0, depth));
        const newR = Math.max(0, r * depthFactor);
        const newG = Math.max(0, g * depthFactor);
        const newB = Math.max(0, b * depthFactor);
        
        return `rgb(${Math.floor(newR)}, ${Math.floor(newG)}, ${Math.floor(newB)})`;
    }
    
    // Wellenfunktion, die x- und Zeit-Parameter verwendet
    getWaveHeight(x, time, amplitude, frequency, phase) {
        return amplitude * Math.sin(x * frequency + time + phase);
    }
    
    // Zeichnet das Wasser basierend auf aktueller Zeit und Wellenparametern
    drawWater() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Mehrere Wellenschichten mit unterschiedlichen Parametern
        const layers = [
            { amplitude: this.waveHeight, frequency: this.frequencyFactor, phase: 0, speed: 1.0 },
            { amplitude: this.waveHeight * 0.6, frequency: this.frequencyFactor * 2, phase: 2, speed: 0.8 },
            { amplitude: this.waveHeight * 0.3, frequency: this.frequencyFactor * 3, phase: 4, speed: 1.2 }
        ];
        
        // Leicht transparenter Wasserhintergrund
        this.ctx.fillStyle = this.getColorVariation(0.9);
        this.ctx.fillRect(0, height * 0.4, width, height * 0.6);
        
        // Gradient für Wassertiefe
        const depthGradient = this.ctx.createLinearGradient(0, height * 0.4, 0, height);
        depthGradient.addColorStop(0, this.getColorVariation(0.5));
        depthGradient.addColorStop(1, this.getColorVariation(0.2));
        
        // Zeichnen jeder Wellenschicht
        layers.forEach((layer, layerIndex) => {
            const segmentWidth = 2; // Breite jedes Wellensegments
            const segmentCount = Math.ceil(width / segmentWidth);
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, height);
            this.ctx.lineTo(0, height * 0.6);
            
            // Berechne Wellenhöhe für jeden Punkt
            for (let i = 0; i <= segmentCount; i++) {
                const x = i * segmentWidth;
                const time = this.time * this.waveSpeed * layer.speed * 0.02;
                
                let waveY = 0;
                
                // Basiswellenfunktion
                waveY += this.getWaveHeight(x, time, layer.amplitude, layer.frequency, layer.phase);
                
                // Mausinteraktion, wenn aktiv
                if (this.mouseActive && this.mouseX !== null) {
                    const dx = x - this.mouseX;
                    const distanceFromMouse = Math.abs(dx);
                    if (distanceFromMouse < 150) {
                        // Mauseffekt verstärkt die Wellen nahe dem Mauszeiger
                        const influence = 1 - distanceFromMouse / 150;
                        waveY += Math.sin(dx * 0.05 + this.mouseSplashTime * 0.1) * layer.amplitude * influence * 0.7;
                    }
                }
                
                // Splash-Effekte einbeziehen
                this.splashes.forEach(splash => {
                    const dx = x - splash.x;
                    const distanceFromSplash = Math.abs(dx);
                    if (distanceFromSplash < splash.size * 2) {
                        const influence = 1 - distanceFromSplash / (splash.size * 2);
                        waveY += Math.sin(dx * 0.05 + splash.size * 0.2) * layer.amplitude * influence * 0.6 * splash.opacity;
                    }
                });
                
                // Y-Versatz basierend auf Ebene
                const layerOffset = layerIndex * 5;
                const y = height * 0.4 + waveY + layerOffset;
                
                this.ctx.lineTo(x, y);
            }
            
            // Pfad schließen
            this.ctx.lineTo(width, height);
            this.ctx.closePath();
            
            // Farbe basierend auf Ebene
            if (layerIndex === 0) {
                this.ctx.fillStyle = depthGradient;
            } else {
                // Transparentere Farben für höhere Ebenen
                const alpha = 0.9 - layerIndex * 0.2;
                const baseColor = this.getColorVariation(0.7 - layerIndex * 0.2);
                this.ctx.fillStyle = baseColor.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
            }
            
            this.ctx.fill();
        });
        
        // Zeichne Highlights auf den Wellen
        this.drawWaveHighlights();
    }
    
    // Zeichnet Highlights (Lichtreflexionen) auf den Wellen
    drawWaveHighlights() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const baseY = height * 0.4;
        
        this.ctx.beginPath();
        
        // Parameter für die Highlight-Welle
        const amplitude = this.waveHeight * 0.5;
        const frequency = this.frequencyFactor * 2;
        const phase = 1;
        const time = this.time * this.waveSpeed * 0.02;
        
        for (let x = 0; x < width; x += 10) {
            // Berechne Wellenhöhe
            const waveY = this.getWaveHeight(x, time, amplitude, frequency, phase);
            
            // Zufällige Variation für organisches Aussehen
            const variation = Math.random() * 3;
            
            // Zeichne kleine Highlights
            if (Math.random() > 0.7) {
                this.ctx.beginPath();
                this.ctx.arc(x, baseY + waveY, Math.random() * 2 + 1, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`;
                this.ctx.fill();
            }
            
            // Zeichne größere Reflexionen in zufälligen Abständen
            if (Math.random() > 0.95) {
                const gradientSize = Math.random() * 10 + 5;
                const gradient = this.ctx.createRadialGradient(
                    x, baseY + waveY + variation, 0,
                    x, baseY + waveY + variation, gradientSize
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                this.ctx.beginPath();
                this.ctx.arc(x, baseY + waveY + variation, gradientSize, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        }
    }
    
    // Zeichnet Splash-Effekte
    drawSplashes() {
        for (let i = this.splashes.length - 1; i >= 0; i--) {
            const splash = this.splashes[i];
            
            // Kreisringe für den Splash
            this.ctx.beginPath();
            this.ctx.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${splash.opacity * 0.5})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Innerer Kreis
            this.ctx.beginPath();
            this.ctx.arc(splash.x, splash.y, splash.size * 0.7, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${splash.opacity * 0.3})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // Splash-Animation aktualisieren
            splash.size += splash.speed;
            splash.opacity -= 0.02;
            
            // Splash entfernen, wenn nicht mehr sichtbar
            if (splash.opacity <= 0 || splash.size >= splash.maxSize) {
                this.splashes.splice(i, 1);
            }
        }
    }
    
    // Zeichnet den Himmel
    drawSky() {
        const height = this.canvas.height;
        
        // Himmelsgradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, height * 0.4);
        
        // Farben basierend auf Wasserfarbe anpassen
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.waterColor);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            
            // Hellere Farben für den Himmel
            skyGradient.addColorStop(0, `rgba(${Math.min(255, r + 100)}, ${Math.min(255, g + 100)}, ${Math.min(255, b + 100)}, 1)`);
            skyGradient.addColorStop(1, `rgba(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)}, 1)`);
        } else {
            skyGradient.addColorStop(0, '#87ceeb');
            skyGradient.addColorStop(1, '#b3e0ff');
        }
        
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, height * 0.4);
    }
    
    update() {
        this.time++;
    }
    
draw() {
        this.adaptiveQuality.update();
        
        // Frame überspringen bei niedriger Qualität
        if (this.adaptiveQuality.shouldSkipFrame()) return;
        
        this.ctx.save();
        
        // Canvas löschen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Himmel zeichnen
        this.drawSky();
        
        // Wasser zeichnen
        this.drawWater();
        
        // Splash-Effekte zeichnen
        this.drawSplashes();
        
        this.ctx.restore();
    }
    
animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Cleanup Methode für Memory Management
    destroy() {
        cancelAnimationFrame(this.animationId);
        this.gradientCache.clear();
        window.removeEventListener('resize', () => this.resize());
        this.canvas.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.removeEventListener('mouseleave', () => { this.mouseActive = false; });
        this.canvas.removeEventListener('mouseenter', () => { this.mouseActive = true; });
        this.canvas.removeEventListener('click', (e) => this.createSplash(e));
        this.canvas.removeEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.handleTouchMove(e);
                this.createSplash(e);
            }
        });
        this.canvas.removeEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.removeEventListener('touchend', () => { this.mouseActive = false; });
    }
}

// Funktion zum Initialisieren der Animation
function initWaterWaves(canvasId) {
    return new WaterWaves(canvasId);
}

// Automatische Initialisierung bei DOM-Bereitschaft
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('water-waves-canvas');
    if (canvas) {
        console.log('Water waves canvas found, initializing animation...');
        try {
            window.waterWavesAnimation = initWaterWaves('water-waves-canvas');
        } catch (e) {
            console.error('Error initializing water waves animation:', e);
        }
    } else {
        console.error('Water waves canvas element not found');
    }
});