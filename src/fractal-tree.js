/**
 * Fractal Tree Animation
 * Erzeugt organische Wachstumsanimationen mit rekursiver Baumgenerierung
 */

import { AdaptiveQuality } from './adaptive-quality.js';

export class FractalTree {
    constructor(canvasOrId) {
        // Canvas einrichten
        if (typeof canvasOrId === 'string') {
            this.canvas = document.getElementById(canvasOrId);
        } else {
            this.canvas = canvasOrId;
        }
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.frameSkip = 0;
        this.lastGrowthUpdate = 0;
        this.adaptiveQuality = new AdaptiveQuality();

        // Parameter mit Standardwerten
        this.branches = [];
        this.leaves = [];
        this.config = {
            maxDepth: 10,
            branchAngle: 25,
            branchLengthRatio: 0.75,
            thickness: 15,
            growthSpeed: 0.02,
            windStrength: 0.3,
            season: 'spring', // spring, summer, autumn, winter
            leafDensity: 0.8,
            backgroundColor: '#87CEEB',
            trunkColor: '#654321',
            leafColors: {
                spring: ['#90EE90', '#98FB98', '#00FF00', '#7CFC00'],
                summer: ['#228B22', '#32CD32', '#00FF00', '#7FFF00'],
                autumn: ['#FF8C00', '#FF6347', '#FFD700', '#FF4500'],
                winter: ['#F0F8FF', '#E6E6FA', '#B0E0E6', '#ADD8E6']
            }
        };

        // Wachstums-Parameter
        this.growthProgress = 0;
        this.windTime = 0;
        this.targetGrowthProgress = 1;

        // Initialisierung
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.resize();
        this.createTree();
        this.createGradientCache();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.groundLevel = this.canvas.height * 0.9;
    }

    createTree() {
        this.branches = [];
        this.leaves = [];
        this.growthProgress = 0;

        // Hauptstamm erstellen
        const trunk = {
            startX: this.canvas.width / 2,
            startY: this.groundLevel,
            endX: this.canvas.width / 2,
            endY: this.groundLevel - this.config.thickness * 8,
            thickness: this.config.thickness,
            depth: 0,
            angle: -Math.PI / 2, // Nach oben
            growthFactor: 0,
            children: []
        };

        this.branches.push(trunk);
        this.generateBranches(trunk);
    }

    generateBranches(parent) {
        if (parent.depth >= this.config.maxDepth) {
            // Blätter erstellen
            if (Math.random() < this.config.leafDensity) {
                this.createLeaves(parent);
            }
            return;
        }

        // Anzahl der Äste basierend auf Tiefe
        const branchCount = parent.depth === 0 ? 2 : (Math.random() < 0.7 ? 2 : 3);

        for (let i = 0; i < branchCount; i++) {
            const angleVariation = (Math.random() - 0.5) * 20;
            const baseAngle = parent.angle + (i - (branchCount - 1) / 2) * this.config.branchAngle;
            const angle = (baseAngle + angleVariation) * Math.PI / 180;

            const length = (parent.thickness * 8) * this.config.branchLengthRatio * (0.8 + Math.random() * 0.4);
            const thickness = parent.thickness * this.config.branchLengthRatio * (0.7 + Math.random() * 0.3);

            const branch = {
                startX: parent.endX,
                startY: parent.endY,
                endX: parent.endX + Math.cos(angle) * length,
                endY: parent.endY + Math.sin(angle) * length,
                thickness: thickness,
                depth: parent.depth + 1,
                angle: angle,
                growthFactor: 0,
                parent: parent,
                children: []
            };

            parent.children.push(branch);
            this.branches.push(branch);

            // Rekursiv weitere Äste generieren
            this.generateBranches(branch);
        }
    }

    createLeaves(branch) {
        const leafCount = Math.floor(Math.random() * 3 + 2);
        const seasonColors = this.config.leafColors[this.config.season];

        for (let i = 0; i < leafCount; i++) {
            const position = Math.random();
            const x = branch.startX + (branch.endX - branch.startX) * position;
            const y = branch.startY + (branch.endY - branch.startY) * position;

            this.leaves.push({
                x: x,
                y: y,
                size: Math.random() * 4 + 2,
                color: seasonColors[Math.floor(Math.random() * seasonColors.length)],
                angle: Math.random() * Math.PI * 2,
                growthFactor: 0,
                swayPhase: Math.random() * Math.PI * 2,
                swaySpeed: Math.random() * 0.02 + 0.01,
                branch: branch
            });
        }
    }

    createGradientCache() {
        // Jahreszeiten-basierte Gradienten
        const seasons = ['spring', 'summer', 'autumn', 'winter'];

        seasons.forEach(season => {
            // Blatt-Gradienten
            const leafColors = this.config.leafColors[season];
            leafColors.forEach((color, index) => {
                const key = `leaf_${season}_${index}`;
                if (!this.gradientCache.has(key)) {
                    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
                    gradient.addColorStop(0, color);
                    gradient.addColorStop(0.7, color);
                    gradient.addColorStop(1, 'transparent');
                    this.gradientCache.set(key, gradient);
                }
            });

            // Hintergrund-Gradienten
            const bgKey = `background_${season}`;
            if (!this.gradientCache.has(bgKey)) {
                const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);

                switch (season) {
                    case 'spring':
                        gradient.addColorStop(0, '#87CEEB');
                        gradient.addColorStop(0.5, '#98FB98');
                        gradient.addColorStop(1, '#90EE90');
                        break;
                    case 'summer':
                        gradient.addColorStop(0, '#00BFFF');
                        gradient.addColorStop(0.5, '#87CEEB');
                        gradient.addColorStop(1, '#228B22');
                        break;
                    case 'autumn':
                        gradient.addColorStop(0, '#FF8C00');
                        gradient.addColorStop(0.5, '#FFD700');
                        gradient.addColorStop(1, '#8B4513');
                        break;
                    case 'winter':
                        gradient.addColorStop(0, '#F0F8FF');
                        gradient.addColorStop(0.5, '#E6E6FA');
                        gradient.addColorStop(1, '#B0C4DE');
                        break;
                }

                this.gradientCache.set(bgKey, gradient);
            }
        });
    }

    updateGrowth() {
        if (this.growthProgress < this.targetGrowthProgress) {
            this.growthProgress += this.config.growthSpeed;
            this.growthProgress = Math.min(this.growthProgress, this.targetGrowthProgress);

            // Wachstum auf alle Äste anwenden
            this.branches.forEach(branch => {
                const depthFactor = 1 - (branch.depth / this.config.maxDepth) * 0.3;
                branch.growthFactor = Math.min(1, this.growthProgress * depthFactor);

                // Endposition basierend auf Wachstum aktualisieren
                const targetLength = Math.sqrt(
                    Math.pow(branch.endX - branch.startX, 2) +
                    Math.pow(branch.endY - branch.startY, 2)
                );
                const currentLength = targetLength * branch.growthFactor;
                const angle = Math.atan2(branch.endY - branch.startY, branch.endX - branch.startX);

                branch.currentEndX = branch.startX + Math.cos(angle) * currentLength;
                branch.currentEndY = branch.startY + Math.sin(angle) * currentLength;
            });

            // Blätter wachsen lassen
            this.leaves.forEach(leaf => {
                leaf.growthFactor = Math.min(1, this.growthProgress * 1.2);
            });
        }
    }

    updateWind() {
        this.windTime += 0.02;

        // Windeinfluss auf Äste
        this.branches.forEach(branch => {
            const windEffect = Math.sin(this.windTime + branch.depth * 0.5) * this.config.windStrength;
            const windAngle = windEffect * 0.1;

            if (branch.currentEndX !== undefined) {
                const length = Math.sqrt(
                    Math.pow(branch.endX - branch.startX, 2) +
                    Math.pow(branch.endY - branch.startY, 2)
                );
                const baseAngle = Math.atan2(branch.endY - branch.startY, branch.endX - branch.startX);
                const newAngle = baseAngle + windAngle;

                branch.swayEndX = branch.startX + Math.cos(newAngle) * length * branch.growthFactor;
                branch.swayEndY = branch.startY + Math.sin(newAngle) * length * branch.growthFactor;
            }
        });

        // Windeinfluss auf Blätter
        this.leaves.forEach(leaf => {
            leaf.swayPhase += leaf.swaySpeed;
            const swayAmount = Math.sin(leaf.swayPhase) * this.config.windStrength * 2;
            leaf.swayX = leaf.x + swayAmount;
            leaf.swayY = leaf.y + Math.abs(swayAmount) * 0.3;
        });
    }

    drawBackground() {
        const bgKey = `background_${this.config.season}`;
        const gradient = this.gradientCache.get(bgKey);

        if (gradient) {
            this.ctx.fillStyle = gradient;
        } else {
            this.ctx.fillStyle = this.config.backgroundColor;
        }

        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Boden zeichnen
        const groundGradient = this.ctx.createLinearGradient(0, this.groundLevel, 0, this.canvas.height);
        groundGradient.addColorStop(0, '#8B7355');
        groundGradient.addColorStop(1, '#654321');
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, this.groundLevel, this.canvas.width, this.canvas.height - this.groundLevel);
    }

    drawBranch(branch) {
        if (branch.growthFactor <= 0) return;

        this.ctx.save();

        // Astfarbe basierend auf Tiefe
        const colorFactor = 1 - (branch.depth / this.config.maxDepth) * 0.5;
        const r = Math.floor(101 * colorFactor + 50);
        const g = Math.floor(67 * colorFactor + 30);
        const b = Math.floor(33 * colorFactor + 20);

        this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        this.ctx.lineWidth = branch.thickness * branch.growthFactor;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(branch.startX, branch.startY);

        // Endposition verwenden (mit Windeinfluss)
        const endX = branch.swayEndX !== undefined ? branch.swayEndX : branch.currentEndX;
        const endY = branch.swayEndY !== undefined ? branch.swayEndY : branch.currentEndY;

        if (endX !== undefined && endY !== undefined) {
            this.ctx.lineTo(endX, endY);
        } else {
            this.ctx.lineTo(branch.endX, branch.endY);
        }

        this.ctx.stroke();

        this.ctx.restore();

        // Rekursiv Kinder zeichnen
        branch.children.forEach(child => this.drawBranch(child));
    }

    drawLeaves() {
        this.leaves.forEach(leaf => {
            if (leaf.growthFactor <= 0) return;

            this.ctx.save();

            const x = leaf.swayX !== undefined ? leaf.swayX : leaf.x;
            const y = leaf.swayY !== undefined ? leaf.swayY : leaf.y;
            const size = leaf.size * leaf.growthFactor;

            // Blattfarbe mit Transparenz
            this.ctx.globalAlpha = leaf.growthFactor * 0.9;

            // Blatt als Ellipse zeichnen
            this.ctx.fillStyle = leaf.color;
            this.ctx.translate(x, y);
            this.ctx.rotate(leaf.angle);

            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Leichter Glow-Effekt
            this.ctx.globalAlpha = leaf.growthFactor * 0.3;
            this.ctx.strokeStyle = leaf.color;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();

            this.ctx.restore();
        });
    }

    update() {
        this.updateGrowth();
        this.updateWind();
    }

    draw() {
        this.drawBackground();

        // Baum zeichnen
        this.branches.forEach(branch => {
            if (branch.depth === 0) {
                this.drawBranch(branch);
            }
        });

        // Blätter zeichnen
        if (this.config.season !== 'winter') {
            this.drawLeaves();
        }
    }

    animate() {
        if (this.adaptiveQuality && this.adaptiveQuality.shouldSkipFrame()) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        this.update();
        this.draw();

        this.isRunning = true;
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        // Klick für Wachstums-Reset
        this.canvas.addEventListener('click', () => {
            this.growthProgress = 0;
            this.targetGrowthProgress = 1;
        });

        // Maus-Interaktion für Wind
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const targetWindStrength = (mouseX - this.canvas.width / 2) / (this.canvas.width / 2) * 2;
            this.config.windStrength += (targetWindStrength - this.config.windStrength) * 0.1;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.config.windStrength = 0.3;
        });

        // Touch-Events für Mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const touchX = touch.clientX - rect.left;
            const targetWindStrength = (touchX - this.canvas.width / 2) / (this.canvas.width / 2) * 2;
            this.config.windStrength += (targetWindStrength - this.config.windStrength) * 0.1;
        });

        this.canvas.addEventListener('touchend', () => {
            this.config.windStrength = 0.3;
        });

        // Window-Resize
        window.addEventListener('resize', () => {
            this.resize();
            this.createTree();
        });

        // Performance-Monitoring
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.registerAnimation('fractal-tree', this);
        }
    }

    // Steuerungsmethoden
    setSeason(season) {
        if (['spring', 'summer', 'autumn', 'winter'].includes(season)) {
            this.config.season = season;
            this.createGradientCache();
            if (season === 'winter') {
                this.leaves = []; // Winter hat keine Blätter
            } else {
                this.createTree(); // Baum mit neuen Blättern neu generieren
            }
        }
    }

    setGrowthSpeed(speed) {
        this.config.growthSpeed = Math.max(0.001, Math.min(0.1, speed));
    }

    setWindStrength(strength) {
        this.config.windStrength = Math.max(0, Math.min(3, strength));
    }

    setMaxDepth(depth) {
        this.config.maxDepth = Math.max(5, Math.min(15, depth));
        this.createTree();
    }

    setLeafDensity(density) {
        this.config.leafDensity = Math.max(0, Math.min(1, density));
        this.createTree();
    }

    // Cleanup-Methode
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;

        // Event-Listener entfernen
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('resize', this.handleResize);

        // Cache leeren
        this.gradientCache.clear();

        // Arrays leeren
        this.branches = [];
        this.leaves = [];
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;
    }

    resume() {
        if (!this.isRunning) {
            this.animate();
        }
    }
}
