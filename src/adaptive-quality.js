/**
 * Adaptive Quality System für Performance-Optimierung
 * Passt die Rendering-Qualität basierend auf der Performance an
 */

export class AdaptiveQuality {
    constructor() {
        this.fps = 60;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.quality = 'high';
        this.qualityLevels = {
            low: { particleMultiplier: 0.5, frameSkip: 3, detailLevel: 0.5 },
            medium: { particleMultiplier: 0.75, frameSkip: 2, detailLevel: 0.75 },
            high: { particleMultiplier: 1.0, frameSkip: 1, detailLevel: 1.0 }
        };
        this.adjustmentInterval = 2000; // Alle 2 Sekunden anpassen
        this.lastAdjustment = 0;
    }

    update() {
        const now = performance.now();
        this.frameCount++;

        // FPS alle 100ms berechnen
        if (now - this.lastTime >= 100) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
        }

        // Qualität alle adjustmentInterval anpassen
        if (now - this.lastAdjustment >= this.adjustmentInterval) {
            this.adjustQuality();
            this.lastAdjustment = now;
        }
    }

    adjustQuality() {
        if (this.fps < 25) {
            this.quality = 'low';
        } else if (this.fps < 40) {
            this.quality = 'medium';
        } else if (this.fps > 55) {
            this.quality = 'high';
        }
    }

    shouldSkipFrame() {
        const currentLevel = this.qualityLevels[this.quality];
        return this.frameCount % currentLevel.frameSkip !== 0;
    }

    getParticleMultiplier() {
        return this.qualityLevels[this.quality].particleMultiplier;
    }

    getDetailLevel() {
        return this.qualityLevels[this.quality].detailLevel;
    }

    getCurrentQuality() {
        return this.quality;
    }

    getFPS() {
        return this.fps;
    }
}