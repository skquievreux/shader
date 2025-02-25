/**
 * Energiefeld-Animation
 * Erzeugt ein dynamisches Energiefeld mit bewegenden Partikeln
 */

class EnergyField {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Parameter mit Standardwerten
        this.particles = [];
        this.particleCount = 200;
        this.speed = 5;
        this.baseColor = '#ff6b6b';
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseRadius = 100;
        
        // Canvas-Größe anpassen
        this.resize();
        
        // Event-Listener
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        
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
        
        // Bei Größenänderung Partikel neu initialisieren
        if (this.particles.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Partikel erstellen
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                speedX: Math.random() * this.speed - this.speed / 2,
                speedY: Math.random() * this.speed - this.speed / 2,
                lastX: 0,
                lastY: 0
            });
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    handleTouchMove(e) {
        if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.mouseY = e.touches[0].clientY - rect.top;
            e.preventDefault();
        }
    }
    
    setupControls() {
        // Steuerelemente für Partikelanzahl
        const particleSlider = document.getElementById('energy-particles');
        if (particleSlider) {
            particleSlider.addEventListener('input', () => {
                this.particleCount = parseInt(particleSlider.value);
                this.init();
            });
        }
        
        // Steuerelemente für Geschwindigkeit
        const speedSlider = document.getElementById('energy-speed');
        if (speedSlider) {
            speedSlider.addEventListener('input', () => {
                this.speed = parseInt(speedSlider.value);
                this.init();
            });
        }
        
        // Steuerelemente für Farbe
        const colorPicker = document.getElementById('energy-color');
        if (colorPicker) {
            colorPicker.addEventListener('input', () => {
                this.baseColor = colorPicker.value;
            });
        }
    }
    
    // Hilfsfunktion für Farbmanipulation mit Transparenz
    getColor(opacity) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.baseColor);
        if (!result) return `rgba(255, 107, 107, ${opacity})`;
        
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    draw() {
        // Canvas löschen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Jedes Partikel zeichnen
        this.particles.forEach(particle => {
            // Aktuelle Position speichern
            particle.lastX = particle.x;
            particle.lastY = particle.y;
            
            // Position aktualisieren
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Prüfen, ob Partikel in der Nähe des Mauszeigers ist
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouseRadius) {
                // Partikel vom Mauszeiger abstoßen
                const angle = Math.atan2(dy, dx);
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                particle.speedX -= Math.cos(angle) * force * 0.5;
                particle.speedY -= Math.sin(angle) * force * 0.5;
            }
            
            // Geschwindigkeit begrenzen
            const maxSpeed = this.speed * 0.5;
            const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (currentSpeed > maxSpeed) {
                particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
                particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
            }
            
            // Begrenzung am Rand des Canvas
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX = -particle.speedX;
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY = -particle.speedY;
            }
            
            // Partikel zeichnen
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.getColor(0.7);
            this.ctx.fill();
            
            // Linie zum letzten Punkt zeichnen
            const lineOpacity = Math.min(1, Math.sqrt(
                Math.pow(particle.x - particle.lastX, 2) + 
                Math.pow(particle.y - particle.lastY, 2)
            ) / 5);
            
            if (lineOpacity > 0.1) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.lastX, particle.lastY);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.strokeStyle = this.getColor(lineOpacity * 0.5);
                this.ctx.lineWidth = particle.radius * 0.5;
                this.ctx.stroke();
            }
        });
        
        // Verbindungen zwischen nahe gelegenen Partikeln zeichnen
        this.drawConnections();
    }
    
    drawConnections() {
        // Maximale Distanz für Verbindungen
        const maxDistance = 70;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Transparenz basierend auf Distanz
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    
                    // Linie zeichnen
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = this.getColor(opacity);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Funktion zum Initialisieren der Animation
function initEnergyField(canvasId) {
    return new EnergyField(canvasId);
}

// Automatische Initialisierung bei DOM-Bereitschaft
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('energy-field-canvas');
    if (canvas) {
        console.log('Energy field canvas found, initializing animation...');
        try {
            window.energyFieldAnimation = initEnergyField('energy-field-canvas');
        } catch (e) {
            console.error('Error initializing energy field animation:', e);
        }
    } else {
        console.error('Energy field canvas element not found');
    }
});