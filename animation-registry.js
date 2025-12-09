/**
 * Animation Registry System
 * Zentrale Verwaltung aller Animationen mit Metadaten und Initialisierung
 */

const ANIMATION_REGISTRY = {
    // Bestehende Animationen
    'energy-field': {
        name: 'Freude und Energie',
        category: 'particles',
        description: 'Dynamische Partikelanimation mit interaktiven Effekten',
        thumbnail: 'thumbnails/energy-field.png',
        file: 'energy-field.js',
        initFunction: 'initEnergyField',
        controls: [
            { id: 'particles', label: 'Partikelanzahl', type: 'range', min: 50, max: 500, default: 200 },
            { id: 'speed', label: 'Geschwindigkeit', type: 'range', min: 1, max: 10, default: 5 },
            { id: 'color', label: 'Farbe', type: 'color', default: '#ff6b6b' }
        ],
        tags: ['particles', 'interactive', 'energy', 'colorful'],
        difficulty: 'beginner'
    },
    
    'blue-sky': {
        name: 'Blauer Himmel',
        category: 'nature',
        description: 'Entspannende Wolkenanimation mit Wind-Effekten',
        thumbnail: 'thumbnails/blue-sky.png',
        file: 'blue-sky.js',
        initFunction: 'initBlueSky',
        controls: [
            { id: 'clouds', label: 'Wolkendichte', type: 'range', min: 5, max: 30, default: 15 },
            { id: 'speed', label: 'Windgeschwindigkeit', type: 'range', min: 1, max: 10, default: 3 },
            { id: 'color', label: 'Himmelsfarbe', type: 'color', default: '#4dabf7' }
        ],
        tags: ['nature', 'clouds', 'relaxing', 'weather'],
        difficulty: 'beginner'
    },
    
    'firework': {
        name: 'Feuerwerk',
        category: 'particles',
        description: 'Beeindruckende Feuerwerksanimation mit Explosionen',
        thumbnail: 'thumbnails/firework.png',
        file: 'firework.js',
        initFunction: 'initFirework',
        controls: [
            { id: 'frequency', label: 'Häufigkeit', type: 'range', min: 1, max: 10, default: 3 },
            { id: 'particles', label: 'Partikelgröße', type: 'range', min: 20, max: 200, default: 100 },
            { id: 'color', label: 'Farbe', type: 'color', default: '#cc5de8' }
        ],
        tags: ['particles', 'explosions', 'celebration', 'colorful'],
        difficulty: 'beginner'
    },
    
    'water-waves': {
        name: 'Wasserwellen',
        category: 'nature',
        description: 'Beruhigende Wellenanimation mit Splash-Effekten',
        thumbnail: 'thumbnails/water-waves.png',
        file: 'water-waves.js',
        initFunction: 'initWaterWaves',
        controls: [
            { id: 'height', label: 'Wellenhöhe', type: 'range', min: 5, max: 50, default: 20 },
            { id: 'speed', label: 'Geschwindigkeit', type: 'range', min: 1, max: 10, default: 4 },
            { id: 'color', label: 'Wasserfarbe', type: 'color', default: '#15aabf' }
        ],
        tags: ['nature', 'water', 'waves', 'relaxing'],
        difficulty: 'beginner'
    },
    
    'aurora': {
        name: 'Aurora Borealis',
        category: 'nature',
        description: 'Faszinierende Nordlicht-Animation mit Lichtbändern',
        thumbnail: 'thumbnails/aurora.png',
        file: 'aurora.js',
        initFunction: 'initAurora',
        controls: [
            { id: 'intensity', label: 'Intensität', type: 'range', min: 1, max: 10, default: 5 },
            { id: 'speed', label: 'Geschwindigkeit', type: 'range', min: 1, max: 10, default: 3 },
            { id: 'color', label: 'Farbe', type: 'color', default: '#00ff88' }
        ],
        tags: ['nature', 'aurora', 'northern-lights', 'atmospheric'],
        difficulty: 'intermediate'
    },
    
    'chakra-animation': {
        name: 'Chakra Animation',
        category: 'geometric',
        description: 'Geometrische Muster mit spirituellen Symbolen',
        thumbnail: 'thumbnails/chakra-animation.png',
        file: 'chakra-animation.js',
        initFunction: 'initChakraAnimation',
        controls: [
            { id: 'complexity', label: 'Komplexität', type: 'range', min: 1, max: 10, default: 5 },
            { id: 'speed', label: 'Geschwindigkeit', type: 'range', min: 1, max: 10, default: 5 },
            { id: 'color', label: 'Farbe', type: 'color', default: '#9b59b6' }
        ],
        tags: ['geometric', 'spiritual', 'meditation', 'symbols'],
        difficulty: 'beginner'
    },
    
    // Neue Animationen
    'star-field': {
        name: 'Star Field',
        category: 'cosmic',
        description: 'Kosmisches Sternenfeld mit Parallax-Effekt und Sternschnuppen',
        thumbnail: 'thumbnails/star-field.png',
        file: 'star-field.js',
        initFunction: 'initStarField',
        controls: [
            { id: 'starCount', label: 'Sternenanzahl', type: 'range', min: 200, max: 2000, default: 800 },
            { id: 'meteorFrequency', label: 'Sternschnuppen-Häufigkeit', type: 'range', min: 0, max: 0.1, default: 0.02 },
            { id: 'parallaxStrength', label: 'Parallax-Stärke', type: 'range', min: 0, max: 2, default: 0.5 },
            { id: 'nebulaOpacity', label: 'Nebel-Deckkraft', type: 'range', min: 0, max: 1, default: 0.3 }
        ],
        tags: ['cosmic', 'stars', 'parallax', 'meteors', 'space'],
        difficulty: 'intermediate'
    },
    
    'rain': {
        name: 'Rain',
        category: 'weather',
        description: 'Realistischer Regen mit Splash-Effekten und Pfützenbildung',
        thumbnail: 'thumbnails/rain.png',
        file: 'rain.js',
        initFunction: 'initRain',
        controls: [
            { id: 'rainIntensity', label: 'Regenintensität', type: 'range', min: 50, max: 2000, default: 500 },
            { id: 'windForce', label: 'Windstärke', type: 'range', min: -10, max: 10, default: 0 },
            { id: 'splashIntensity', label: 'Splash-Intensität', type: 'range', min: 0, max: 2, default: 0.8 },
            { id: 'puddleFormation', label: 'Pfützenbildung', type: 'checkbox', default: true }
        ],
        tags: ['weather', 'rain', 'splashes', 'puddles', 'realistic'],
        difficulty: 'intermediate'
    },
    
    'lightning': {
        name: 'Lightning',
        category: 'weather',
        description: 'Dynamische Blitzelektrische Entladungen mit Verzweigungen',
        thumbnail: 'thumbnails/lightning.png',
        file: 'lightning.js',
        initFunction: 'initLightning',
        controls: [
            { id: 'boltFrequency', label: 'Blitz-Häufigkeit', type: 'range', min: 0, max: 0.1, default: 0.02 },
            { id: 'boltComplexity', label: 'Blitz-Komplexität', type: 'range', min: 0.1, max: 1, default: 0.7 },
            { id: 'branchProbability', label: 'Verzweigungswahrscheinlichkeit', type: 'range', min: 0, max: 1, default: 0.3 },
            { id: 'glowIntensity', label: 'Leuchtintensität', type: 'range', min: 0, max: 2, default: 0.8 }
        ],
        tags: ['weather', 'lightning', 'thunder', 'storms', 'dramatic'],
        difficulty: 'advanced'
    },
    
    'smoke': {
        name: 'Smoke',
        category: 'particles',
        description: 'Realistische Rauchsimulation mit Turbulenzen und Windeinfluss',
        thumbnail: 'thumbnails/smoke.png',
        file: 'smoke.js',
        initFunction: 'initSmoke',
        controls: [
            { id: 'particleCount', label: 'Partikelanzahl', type: 'range', min: 50, max: 500, default: 150 },
            { id: 'emissionRate', label: 'Emissionsrate', type: 'range', min: 1, max: 10, default: 3 },
            { id: 'windForce', label: 'Windstärke', type: 'vector', default: { x: 0.5, y: -0.2 } },
            { id: 'turbulence', label: 'Turbulenz', type: 'range', min: 0, max: 2, default: 0.8 }
        ],
        tags: ['particles', 'smoke', 'turbulence', 'wind', 'realistic'],
        difficulty: 'advanced'
    },
    
    'fractal-tree': {
        name: 'Fractal Tree',
        category: 'organic',
        description: 'Organische Wachstumsanimationen mit rekursiver Baumgenerierung',
        thumbnail: 'thumbnails/fractal-tree.png',
        file: 'fractal-tree.js',
        initFunction: 'initFractalTree',
        controls: [
            { id: 'maxDepth', label: 'Maximale Tiefe', type: 'range', min: 5, max: 15, default: 10 },
            { id: 'branchAngle', label: 'Astwinkel', type: 'range', min: 10, max: 45, default: 25 },
            { id: 'growthSpeed', label: 'Wachstumsgeschwindigkeit', type: 'range', min: 0.001, max: 0.1, default: 0.02 },
            { id: 'season', label: 'Jahreszeit', type: 'select', options: ['spring', 'summer', 'autumn', 'winter'], default: 'spring' },
            { id: 'windStrength', label: 'Windstärke', type: 'range', min: 0, max: 3, default: 0.3 }
        ],
        tags: ['organic', 'fractal', 'tree', 'growth', 'nature'],
        difficulty: 'advanced'
    },
    
    'kaleidoscope': {
        name: 'Kaleidoscope',
        category: 'geometric',
        description: 'Geometrische Symmetriemuster mit interaktiver Mustererzeugung',
        thumbnail: 'thumbnails/kaleidoscope.png',
        file: 'kaleidoscope.js',
        initFunction: 'initKaleidoscope',
        controls: [
            { id: 'symmetry', label: 'Symmetrieachsen', type: 'select', options: [4, 6, 8, 12], default: 6 },
            { id: 'particleCount', label: 'Partikelanzahl', type: 'range', min: 10, max: 200, default: 50 },
            { id: 'colorScheme', label: 'Farbschema', type: 'select', options: ['rainbow', 'ocean', 'sunset', 'forest', 'cosmic'], default: 'rainbow' },
            { id: 'rotationSpeed', label: 'Rotationsgeschwindigkeit', type: 'range', min: -0.05, max: 0.05, default: 0.005 }
        ],
        tags: ['geometric', 'symmetry', 'patterns', 'interactive', 'colorful'],
        difficulty: 'intermediate'
    },
    
    'plasma': {
        name: 'Plasma',
        category: 'abstract',
        description: 'Elektrische Energieeffekte mit mathematischen Plasma-Funktionen',
        thumbnail: 'thumbnails/plasma.png',
        file: 'plasma.js',
        initFunction: 'initPlasma',
        controls: [
            { id: 'resolution', label: 'Auflösung', type: 'range', min: 1, max: 10, default: 4 },
            { id: 'colorScheme', label: 'Farbschema', type: 'select', options: ['electric', 'fire', 'ice', 'rainbow', 'matrix'], default: 'electric' },
            { id: 'speed', label: 'Geschwindigkeit', type: 'range', min: 0, max: 0.1, default: 0.02 },
            { id: 'intensity', label: 'Intensität', type: 'range', min: 0.1, max: 2, default: 1.0 }
        ],
        tags: ['abstract', 'plasma', 'energy', 'mathematical', 'colorful'],
        difficulty: 'advanced'
    },
    
    'matrix-rain': {
        name: 'Matrix Rain',
        category: 'abstract',
        description: 'Cyberpunk-ähnliche digitale Regeneffekte mit Zeichenfällen',
        thumbnail: 'thumbnails/matrix-rain.png',
        file: 'matrix-rain.js',
        initFunction: 'initMatrixRain',
        controls: [
            { id: 'columnCount', label: 'Spaltenanzahl', type: 'range', min: 20, max: 200, default: 100 },
            { id: 'dropSpeed', label: 'Fallgeschwindigkeit', type: 'range', min: 0.5, max: 10, default: 2 },
            { id: 'fontSize', label: 'Schriftgröße', type: 'range', min: 8, max: 30, default: 14 },
            { id: 'colorScheme', label: 'Farbschema', type: 'select', options: ['matrix', 'blue', 'red', 'rainbow', 'cyber'], default: 'matrix' },
            { id: 'characterDensity', label: 'Zeichendichte', type: 'range', min: 0.1, max: 1, default: 0.8 }
        ],
        tags: ['abstract', 'matrix', 'cyberpunk', 'digital', 'text'],
        difficulty: 'intermediate'
    }
};

// Kategorien-Definitionen
const ANIMATION_CATEGORIES = {
    'particles': {
        name: 'Particle-Systeme',
        description: 'Animationen mit Partikelphysik und -effekten',
        icon: '🌟',
        color: '#ff6b6b'
    },
    'nature': {
        name: 'Natur-Phänomene',
        description: 'Organische Animationen aus der Natur',
        icon: '🌍',
        color: '#4dabf7'
    },
    'weather': {
        name: 'Wetter-Effekte',
        description: 'Atmosphärische Wetteranimationen',
        icon: '🌦️',
        color: '#15aabf'
    },
    'cosmic': {
        name: 'Kosmische Effekte',
        description: 'Weltraum- und Sternenanimationen',
        icon: '🌌',
        color: '#2b5797'
    },
    'organic': {
        name: 'Organische Muster',
        description: 'Biologische Wachstums- und Lebensanimationen',
        icon: '🌳',
        color: '#51cf66'
    },
    'geometric': {
        name: 'Geometrische Muster',
        description: 'Mathematische und symmetrische Animationen',
        icon: '🔮',
        color: '#9b59b6'
    },
    'abstract': {
        name: 'Abstrakte Kunst',
        description: 'Generative und mathematische Kunstformen',
        icon: '🎨',
        color: '#e74c3c'
    }
};

// Schwierigkeits-Level
const DIFFICULTY_LEVELS = {
    'beginner': {
        name: 'Anfänger',
        description: 'Einfach zu verstehen und zu kontrollieren',
        color: '#51cf66'
    },
    'intermediate': {
        name: 'Fortgeschritten',
        description: 'Moderate Komplexität mit erweiterten Funktionen',
        color: '#f39c12'
    },
    'advanced': {
        name: 'Fortgeschritten',
        description: 'Hohe Komplexität mit vielen Parametern',
        color: '#e74c3c'
    }
};

// Registry-Klasse für Animation-Management
class AnimationRegistry {
    constructor() {
        this.animations = ANIMATION_REGISTRY;
        this.categories = ANIMATION_CATEGORIES;
        this.difficulties = DIFFICULTY_LEVELS;
        this.loadedAnimations = new Set();
        this.activeAnimations = new Map();
    }
    
    // Animation nach ID abrufen
    getAnimation(id) {
        return this.animations[id] || null;
    }
    
    // Alle Animationen abrufen
    getAllAnimations() {
        return Object.entries(this.animations).map(([id, animation]) => ({
            id,
            ...animation
        }));
    }
    
    // Animationen nach Kategorie filtern
    getAnimationsByCategory(category) {
        return this.getAllAnimations().filter(animation => animation.category === category);
    }
    
    // Animationen nach Tag filtern
    getAnimationsByTag(tag) {
        return this.getAllAnimations().filter(animation => 
            animation.tags && animation.tags.includes(tag)
        );
    }
    
    // Animationen nach Schwierigkeit filtern
    getAnimationsByDifficulty(difficulty) {
        return this.getAllAnimations().filter(animation => 
            animation.difficulty === difficulty
        );
    }
    
    // Animation suchen
    searchAnimations(query) {
        const lowerQuery = query.toLowerCase();
        return this.getAllAnimations().filter(animation => 
            animation.name.toLowerCase().includes(lowerQuery) ||
            animation.description.toLowerCase().includes(lowerQuery) ||
            (animation.tags && animation.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    }
    
    // Animation initialisieren
    async initializeAnimation(id, canvasId) {
        const animation = this.getAnimation(id);
        if (!animation) {
            throw new Error(`Animation mit ID '${id}' nicht gefunden`);
        }
        
        // Prüfen ob Animation bereits geladen ist
        if (!this.loadedAnimations.has(id)) {
            await this.loadAnimationScript(animation.file);
            this.loadedAnimations.add(id);
        }
        
        // Animation initialisieren
        try {
            if (typeof window[animation.initFunction] === 'function') {
                const instance = window[animation.initFunction](canvasId);
                this.activeAnimations.set(id, instance);
                return instance;
            } else {
                throw new Error(`Initialisierungsfunktion '${animation.initFunction}' nicht gefunden`);
            }
        } catch (error) {
            console.error(`Fehler bei der Initialisierung von Animation '${id}':`, error);
            throw error;
        }
    }
    
    // Animation-Skript laden
    async loadAnimationScript(filename) {
        return new Promise((resolve, reject) => {
            // Prüfen ob Skript bereits geladen ist
            if (document.querySelector(`script[src="${filename}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = filename;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Fehler beim Laden von ${filename}`));
            document.head.appendChild(script);
        });
    }
    
    // Animation beenden
    destroyAnimation(id) {
        const instance = this.activeAnimations.get(id);
        if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
            this.activeAnimations.delete(id);
        }
    }
    
    // Alle aktiven Animationen beenden
    destroyAllAnimations() {
        for (const [id, instance] of this.activeAnimations) {
            if (typeof instance.destroy === 'function') {
                instance.destroy();
            }
        }
        this.activeAnimations.clear();
    }
    
    // Zufällige Animation auswählen
    getRandomAnimation() {
        const animations = this.getAllAnimations();
        const randomIndex = Math.floor(Math.random() * animations.length);
        return animations[randomIndex];
    }
    
    // Animation-Statistiken
    getStatistics() {
        const animations = this.getAllAnimations();
        const stats = {
            total: animations.length,
            byCategory: {},
            byDifficulty: {},
            loaded: this.loadedAnimations.size,
            active: this.activeAnimations.size
        };
        
        animations.forEach(animation => {
            stats.byCategory[animation.category] = (stats.byCategory[animation.category] || 0) + 1;
            stats.byDifficulty[animation.difficulty] = (stats.byDifficulty[animation.difficulty] || 0) + 1;
        });
        
        return stats;
    }
    
    // Export-Konfiguration für Embedding
    getEmbedConfig(id, customParams = {}) {
        const animation = this.getAnimation(id);
        if (!animation) {
            throw new Error(`Animation mit ID '${id}' nicht gefunden`);
        }
        
        const baseUrl = window.ShaderConfig ? window.ShaderConfig.getBaseUrl() : '';
        
        return {
            animationId: id,
            name: animation.name,
            embedUrl: `${baseUrl}/embed.html?animation=${id}`,
            scriptUrl: `${baseUrl}/${animation.file}`,
            initFunction: animation.initFunction,
            controls: animation.controls,
            defaultParams: animation.controls.reduce((params, control) => {
                params[control.id] = control.default;
                return params;
            }, {}),
            customParams: { ...customParams },
            thumbnail: `${baseUrl}/${animation.thumbnail}`,
            description: animation.description,
            tags: animation.tags,
            category: animation.category,
            difficulty: animation.difficulty
        };
    }
}

// Globale Registry-Instanz
const animationRegistry = new AnimationRegistry();

// Export für globale Verwendung
window.ANIMATION_REGISTRY = ANIMATION_REGISTRY;
window.ANIMATION_CATEGORIES = ANIMATION_CATEGORIES;
window.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;
window.animationRegistry = animationRegistry;

// Export für Module-Systeme
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ANIMATION_REGISTRY,
        ANIMATION_CATEGORIES,
        DIFFICULTY_LEVELS,
        AnimationRegistry,
        animationRegistry
    };
}