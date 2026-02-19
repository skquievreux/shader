/**
 * Resource Pooling System für Shader Animationen
 * Optimiert Memory-Nutzung durch Wiederverwendung von Objekten
 */

class ResourcePool {
    constructor(createFn, resetFn, initialSize = 10, maxSize = 100) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.initialSize = initialSize;
        this.maxSize = maxSize;
        
        this.pool = [];
        this.active = new Set();
        this.stats = {
            created: 0,
            reused: 0,
            destroyed: 0,
            peakUsage: 0
        };
        
        // Initiale Befüllung
        this.preload();
    }
    
    /**
     * Lädt initiale Objekte in den Pool
     */
    preload() {
        for (let i = 0; i < this.initialSize; i++) {
            const obj = this.createFn();
            this.pool.push(obj);
            this.stats.created++;
        }
    }
    
    /**
     * Holt ein Objekt aus dem Pool
     */
    acquire() {
        let obj;
        
        if (this.pool.length > 0) {
            obj = this.pool.pop();
            this.stats.reused++;
        } else {
            obj = this.createFn();
            this.stats.created++;
        }
        
        this.active.add(obj);
        this.updatePeakUsage();
        
        return obj;
    }
    
    /**
     * Gibt ein Objekt an den Pool zurück
     */
    release(obj) {
        if (!this.active.has(obj)) {
            return; // Objekt nicht im Pool
        }
        
        this.active.delete(obj);
        
        // Objekt zurücksetzen
        if (this.resetFn) {
            this.resetFn(obj);
        }
        
        // Pool nicht überfüllen
        if (this.pool.length < this.maxSize) {
            this.pool.push(obj);
        } else {
            this.stats.destroyed++;
        }
    }
    
    /**
     * Gibt alle aktiven Objekte frei
     */
    releaseAll() {
        this.active.forEach(obj => {
            this.release(obj);
        });
    }
    
    /**
     * Aktualisiert Peak Usage
     */
    updatePeakUsage() {
        const currentUsage = this.active.size;
        if (currentUsage > this.stats.peakUsage) {
            this.stats.peakUsage = currentUsage;
        }
    }
    
    /**
     * Gibt Pool-Statistiken zurück
     */
    getStats() {
        return {
            ...this.stats,
            poolSize: this.pool.length,
            activeCount: this.active.size,
            efficiency: this.stats.reused / (this.stats.created + this.stats.reused) || 0
        };
    }
    
    /**
     * Leert den Pool
     */
    clear() {
        this.pool = [];
        this.active.clear();
        this.stats.destroyed += this.active.size;
    }
}

/**
 * Particle Pool für Partikel-Animationen
 */
class ParticlePool extends ResourcePool {
    constructor(initialSize = 200, maxSize = 1000) {
        super(
            // Create Function
            () => ({
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                radius: Math.random() * 3 + 1,
                color: '#ffffff',
                alpha: 1,
                life: 1,
                maxLife: 1
            }),
            // Reset Function
            (particle) => {
                particle.x = 0;
                particle.y = 0;
                particle.vx = 0;
                particle.vy = 0;
                particle.alpha = 1;
                particle.life = 1;
            },
            initialSize,
            maxSize
        );
    }
    
    /**
     * Erstellt ein Partikel mit spezifischen Eigenschaften
     */
    createParticle(x, y, vx, vy, color, radius) {
        const particle = this.acquire();
        particle.x = x;
        particle.y = y;
        particle.vx = vx;
        particle.vy = vy;
        particle.color = color;
        particle.radius = radius || particle.radius;
        return particle;
    }
}

/**
 * Gradient Pool für Canvas-Gradienten
 */
class GradientPool extends ResourcePool {
    constructor(initialSize = 30, maxSize = 100) {
        super(
            // Create Function
            () => ({
                gradient: null,
                type: 'linear',
                x1: 0, y1: 0, x2: 0, y2: 0,
                colors: [],
                key: '',
                lastUsed: 0
            }),
            // Reset Function
            (gradientObj) => {
                gradientObj.gradient = null;
                gradientObj.type = 'linear';
                gradientObj.x1 = 0; gradientObj.y1 = 0; gradientObj.x2 = 0; gradientObj.y2 = 0;
                gradientObj.colors = [];
                gradientObj.key = '';
                gradientObj.lastUsed = 0;
            },
            initialSize,
            maxSize
        );
        
        // Cache für Gradient-Keys
        this.cache = new Map();
        this.maxCacheAge = 60000; // 1 Minute
    }
    
    /**
     * Holt einen Gradient aus dem Cache oder Pool
     */
    getGradient(ctx, type, x1, y1, x2, y2, colors) {
        const key = `${type}-${x1}-${y1}-${x2}-${y2}-${JSON.stringify(colors)}`;
        const now = Date.now();
        
        // Cache prüfen
        if (this.cache.has(key)) {
            const cached = this.cache.get(key);
            if (now - cached.lastUsed < this.maxCacheAge) {
                cached.lastUsed = now;
                return cached.gradient;
            } else {
                // Alten Cache-Eintrag entfernen
                this.cache.delete(key);
                this.release(cached);
            }
        }
        
        // Neuen Gradient erstellen
        let gradient;
        if (type === 'linear') {
            gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        } else {
            gradient = ctx.createRadialGradient(x1, y1, 0, x2, y2, Math.abs(x2 - x1) || 100);
        }
        
        colors.forEach((color, index) => {
            gradient.addColorStop(index / (colors.length - 1), color.color || color);
        });
        
        // Im Cache speichern
        const gradientObj = this.acquire();
        gradientObj.gradient = gradient;
        gradientObj.type = type;
        gradientObj.x1 = x1; gradientObj.y1 = y1; gradientObj.x2 = x2; gradientObj.y2 = y2;
        gradientObj.colors = colors;
        gradientObj.key = key;
        gradientObj.lastUsed = now;
        
        this.cache.set(key, gradientObj);
        
        return gradient;
    }
    
    /**
     * Bereinigt alten Cache
     */
    cleanupCache() {
        const now = Date.now();
        const toDelete = [];
        
        this.cache.forEach((gradientObj, key) => {
            if (now - gradientObj.lastUsed > this.maxCacheAge) {
                toDelete.push(key);
                this.release(gradientObj);
            }
        });
        
        toDelete.forEach(key => this.cache.delete(key));
    }
    
    /**
     * Gibt Cache-Statistiken zurück
     */
    getCacheStats() {
        return {
            cacheSize: this.cache.size,
            maxCacheAge: this.maxCacheAge,
            ...this.getStats()
        };
    }
}

/**
 * Animation Pool für Animation-Objekte
 */
class AnimationPool extends ResourcePool {
    constructor(initialSize = 5, maxSize = 20) {
        super(
            // Create Function
            () => ({
                id: '',
                type: '',
                canvas: null,
                ctx: null,
                active: false,
                quality: 'high',
                lastUpdate: 0
            }),
            // Reset Function
            (animation) => {
                animation.id = '';
                animation.type = '';
                animation.canvas = null;
                animation.ctx = null;
                animation.active = false;
                animation.quality = 'high';
                animation.lastUpdate = 0;
            },
            initialSize,
            maxSize
        );
    }
    
    /**
     * Erstellt eine Animation mit Canvas
     */
    createAnimation(id, type, canvasElement) {
        const animation = this.acquire();
        animation.id = id;
        animation.type = type;
        animation.canvas = canvasElement;
        animation.ctx = canvasElement.getContext('2d', { willReadFrequently: true });
        animation.active = true;
        animation.lastUpdate = performance.now();
        return animation;
    }
}

/**
 * Resource Manager für alle Pools
 */
class ResourceManager {
    constructor() {
        this.pools = {
            particles: new ParticlePool(200, 1000),
            gradients: new GradientPool(30, 100),
            animations: new AnimationPool(5, 20)
        };
        
        this.stats = {
            totalMemory: 0,
            peakMemory: 0,
            gcCount: 0
        };
        
        // Cleanup Intervall
        this.cleanupInterval = setInterval(() => {
            this.performCleanup();
        }, 30000); // Alle 30 Sekunden
        
        // Memory Monitoring
        this.setupMemoryMonitoring();
    }
    
    /**
     * Holt Partikel aus dem Pool
     */
    getParticle(x, y, vx, vy, color, radius) {
        return this.pools.createParticle(x, y, vx, vy, color, radius);
    }
    
    /**
     * Gibt Partikel an den Pool zurück
     */
    releaseParticle(particle) {
        this.pools.release(particle);
    }
    
    /**
     * Holt Gradient aus dem Pool
     */
    getGradient(ctx, type, x1, y1, x2, y2, colors) {
        return this.pools.gradients.getGradient(ctx, type, x1, y1, x2, y2, colors);
    }
    
    /**
     * Holt Animation aus dem Pool
     */
    getAnimation(id, type, canvasElement) {
        return this.pools.animations.createAnimation(id, type, canvasElement);
    }
    
    /**
     * Gibt Animation an den Pool zurück
     */
    releaseAnimation(animation) {
        this.pools.animations.release(animation);
    }
    
    /**
     * Führt Cleanup durch
     */
    performCleanup() {
        console.log('🧹 Resource Manager Cleanup gestartet');
        
        // Gradient Cache cleanup
        this.pools.gradients.cleanupCache();
        
        // Memory prüfen
        this.checkMemoryUsage();
        
        // Garbage Collection anfordern
        this.requestGarbageCollection();
    }
    
    /**
     * Setup für Memory Monitoring
     */
    setupMemoryMonitoring() {
        if (performance.memory) {
            setInterval(() => {
                this.updateMemoryStats();
            }, 5000); // Alle 5 Sekunden
        }
    }
    
    /**
     * Aktualisiert Memory-Statistiken
     */
    updateMemoryStats() {
        if (performance.memory) {
            const memory = performance.memory;
            this.stats.totalMemory = memory.usedJSHeapSize;
            
            if (this.stats.totalMemory > this.stats.peakMemory) {
                this.stats.peakMemory = this.stats.totalMemory;
            }
        }
    }
    
    /**
     * Prüft Memory-Nutzung
     */
    checkMemoryUsage() {
        if (performance.memory) {
            const memory = performance.memory;
            const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            
            if (usageRatio > 0.8) {
                console.warn('💾 Hohe Memory-Nutzung:', usageRatio);
                this.emergencyCleanup();
            }
        }
    }
    
    /**
     * Führt Notfall-Cleanup durch
     */
    emergencyCleanup() {
        console.log('🚨 Emergency Cleanup gestartet');
        
        // Alle Pools leeren
        Object.values(this.pools).forEach(pool => {
            pool.releaseAll();
            pool.clear();
        });
        
        // Garbage Collection anfordern
        this.requestGarbageCollection();
    }
    
    /**
     * Fordert Garbage Collection an
     */
    requestGarbageCollection() {
        if (window.gc) {
            window.gc();
            this.stats.gcCount++;
        }
    }
    
    /**
     * Gibt alle Pool-Statistiken zurück
     */
    getAllStats() {
        return {
            pools: {
                particles: this.pools.particles.getStats(),
                gradients: this.pools.gradients.getCacheStats(),
                animations: this.pools.animations.getStats()
            },
            memory: this.stats,
            summary: this.generateSummary()
        };
    }
    
    /**
     * Generiert Zusammenfassung
     */
    generateSummary() {
        const poolStats = this.getAllStats().pools;
        
        return {
            totalObjectsCreated: Object.values(poolStats).reduce((sum, stat) => sum + stat.created, 0),
            totalObjectsReused: Object.values(poolStats).reduce((sum, stat) => sum + stat.reused, 0),
            averageEfficiency: Object.values(poolStats).reduce((sum, stat) => sum + stat.efficiency, 0) / Object.keys(poolStats).length,
            memoryUsageMB: Math.round(this.stats.totalMemory / 1024 / 1024),
            peakMemoryMB: Math.round(this.stats.peakMemory / 1024 / 1024),
            gcCount: this.stats.gcCount
        };
    }
    
    /**
     * Stoppt den Resource Manager
     */
    stop() {
        clearInterval(this.cleanupInterval);
        this.emergencyCleanup();
    }
}

// Globale Instanz erstellen
window.ResourceManager = new ResourceManager();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResourcePool, ParticlePool, GradientPool, AnimationPool, ResourceManager };
}