/**
 * Blauer Himmel Animation
 * Erzeugt eine Wolkenanimation, die den Himmel darstellt
 */

class BlueSky {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
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
        // Wolken erstellen
        this.clouds = [];
        for (let i = 0; i < this.cloudCount; i++) {
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
        // Himmelshintergrund zeichnen
        const skyGradient = this.ctx.createLinearGradient(
            0, 0, 
            0, this.canvas.height
        );
        
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.skyColor);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            
            // Hellerer Himmel oben
            skyGradient.addColorStop(0, `rgba(${r + 30 > 255 ? 255 : r + 30}, ${g + 30 > 255 ? 255 : g + 30}, ${b + 30 > 255 ? 255 : b + 30}, 1)`);
            // Originalfarbe in der Mitte
            skyGradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 1)`);
            // Leicht dunklerer Himmel unten
            skyGradient.addColorStop(1, `rgba(${r - 20 < 0 ? 0 : r - 20}, ${g - 10 < 0 ? 0 : g - 10}, ${b < 0 ? 0 : b}, 1)`);
        } else {
            skyGradient.addColorStop(0, '#7cc0ff');
            skyGradient.addColorStop(0.6, '#4dabf7');
            skyGradient.addColorStop(1, '#3b95d3');
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
    }
    
    drawSun() {
        const sunX = this.canvas.width * 0.85;
        const sunY = this.canvas.height * 0.2;
        const sunRadius = 40;
        
        // Sonnenglow
        const glowGradient = this.ctx.createRadialGradient(
            sunX, sunY, 0,
            sunX, sunY, sunRadius * 2.5
        );
        glowGradient.addColorStop(0, 'rgba(255, 255, 200, 0.6)');
        glowGradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.2)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, sunRadius * 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = glowGradient;
        this.ctx.fill();
        
        // Sonne
        const sunGradient = this.ctx.createRadialGradient(
            sunX - sunRadius * 0.2, sunY - sunRadius * 0.2, 0,
            sunX, sunY, sunRadius
        );
        sunGradient.addColorStop(0, '#fff9c4');
        sunGradient.addColorStop(0.8, '#ffd600');
        sunGradient.addColorStop(1, '#ffab00');
        
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = sunGradient;
        this.ctx.fill();
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
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