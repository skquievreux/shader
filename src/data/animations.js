export const ANIMATION_REGISTRY = {
    'energy-field': {
        name: 'Freude und Energie',
        category: 'particles',
        description: 'Dynamische Partikelanimation mit interaktiven Effekten',
        thumbnail: 'thumbnails/energy-field.png',
        component: 'EnergyFieldWrapper',
        tags: ['particles', 'interactive', 'energy', 'colorful'],
        difficulty: 'beginner',
        controls: [
            { id: 'particles', type: 'range', label: 'Anzahl Partikel', min: 50, max: 500, defaultValue: 200 },
            { id: 'speed', type: 'range', label: 'Geschwindigkeit', min: 1, max: 10, defaultValue: 5 },
            { id: 'color', type: 'color', label: 'Farbe', defaultValue: '#ff6b6b' }
        ]
    },
    'blue-sky': {
        name: 'Blauer Himmel',
        category: 'nature',
        description: 'Entspannende Wolkenanimation mit Wind-Effekten',
        thumbnail: 'thumbnails/blue-sky.png',
        component: 'BlueSkyWrapper',
        tags: ['nature', 'clouds', 'relaxing', 'weather'],
        difficulty: 'beginner',
        controls: [
            { id: 'clouds', type: 'range', label: 'Wolkendichte', min: 5, max: 30, defaultValue: 15 },
            { id: 'speed', type: 'range', label: 'Windgeschwindigkeit', min: 1, max: 10, defaultValue: 3 },
            { id: 'color', type: 'color', label: 'Himmelsfarbe', defaultValue: '#4dabf7' }
        ]
    },
    'firework': {
        name: 'Feuerwerk',
        category: 'particles',
        description: 'Beeindruckende Feuerwerksanimation mit Explosionen',
        thumbnail: 'thumbnails/firework.png',
        component: 'FireworkWrapper',
        tags: ['particles', 'explosions', 'celebration', 'colorful'],
        difficulty: 'beginner',
        controls: [
            { id: 'frequency', type: 'range', label: 'Häufigkeit', min: 1, max: 10, defaultValue: 5 },
            { id: 'particles', type: 'range', label: 'Partikelgröße', min: 20, max: 200, defaultValue: 100 },
            { id: 'color', type: 'color', label: 'Grundfarbe', defaultValue: '#cc5de8' }
        ]
    },
    'water-waves': {
        name: 'Wasserwellen',
        category: 'nature',
        description: 'Beruhigende Wellenanimation mit Splash-Effekten',
        thumbnail: 'thumbnails/water-waves.png',
        component: 'WaterWavesWrapper',
        tags: ['nature', 'water', 'waves', 'relaxing'],
        difficulty: 'beginner',
        controls: [
            { id: 'height', type: 'range', label: 'Wellenhöhe', min: 1, max: 50, defaultValue: 20 },
            { id: 'speed', type: 'range', label: 'Geschwindigkeit', min: 1, max: 10, defaultValue: 3 },
            { id: 'color', type: 'color', label: 'Wasserfarbe', defaultValue: '#15aabf' }
        ]
    },
    'aurora': {
        name: 'Aurora Borealis',
        category: 'nature',
        description: 'Faszinierende Nordlicht-Animation mit Lichtbändern',
        thumbnail: 'thumbnails/aurora.png',
        component: 'AuroraWrapper',
        tags: ['nature', 'aurora', 'northern-lights', 'atmospheric'],
        difficulty: 'intermediate',
        controls: [
            { id: 'intensity', type: 'range', label: 'Intensität', min: 1, max: 10, defaultValue: 5 },
            { id: 'speed', type: 'range', label: 'Geschwindigkeit', min: 1, max: 10, defaultValue: 3 },
            { id: 'baseColor', type: 'color', label: 'Grundfarbe', defaultValue: '#00ff88' }
        ]
    },
    'chakra-animation': {
        name: 'Chakra Animation',
        category: 'geometric',
        description: 'Geometrische Muster mit spirituellen Symbolen',
        thumbnail: 'thumbnails/chakra-animation.png',
        component: 'ChakraAnimationWrapper',
        tags: ['geometric', 'spiritual', 'meditation', 'symbols'],
        difficulty: 'beginner',
        controls: [
            { id: 'rotationSpeed', type: 'range', label: 'Rotationsgeschwindigkeit', min: 1, max: 20, defaultValue: 5 },
            { id: 'scale', type: 'range', label: 'Größe', min: 0.5, max: 2, step: 0.1, defaultValue: 1 }
        ]
    },
    'star-field': {
        name: 'Star Field',
        category: 'cosmic',
        description: 'Kosmisches Sternenfeld mit Parallax-Effekt und Sternschnuppen',
        thumbnail: 'thumbnails/star-field.png',
        component: 'StarFieldWrapper',
        tags: ['cosmic', 'stars', 'parallax', 'meteors', 'space'],
        difficulty: 'intermediate',
        controls: [
            { id: 'speed', type: 'range', label: 'Geschwindigkeit', min: 1, max: 20, defaultValue: 5 },
            { id: 'starCount', type: 'range', label: 'Anzahl Sterne', min: 100, max: 2000, defaultValue: 800 }
        ]
    },
    'rain': {
        name: 'Rain',
        category: 'weather',
        description: 'Realistischer Regen mit Splash-Effekten und Pfützenbildung',
        thumbnail: 'thumbnails/rain.png',
        component: 'RainWrapper',
        tags: ['weather', 'rain', 'splashes', 'puddles', 'realistic'],
        difficulty: 'intermediate',
        controls: [
            { id: 'intensity', type: 'range', label: 'Intensität', min: 1, max: 50, defaultValue: 20 },
            { id: 'wind', type: 'range', label: 'Wind', min: -10, max: 10, defaultValue: 0 },
            { id: 'speed', type: 'range', label: 'Fallgeschwindigkeit', min: 5, max: 30, defaultValue: 15 }
        ]
    },
    'lightning': {
        name: 'Lightning',
        category: 'weather',
        description: 'Dynamische Blitzelektrische Entladungen mit Verzweigungen',
        thumbnail: 'thumbnails/lightning.png',
        component: 'LightningWrapper',
        tags: ['weather', 'lightning', 'thunder', 'storms', 'dramatic'],
        difficulty: 'advanced',
        controls: [
            { id: 'frequency', type: 'range', label: 'Gewitter-Häufigkeit', min: 1, max: 10, defaultValue: 2 },
            { id: 'intensity', type: 'range', label: 'Blitz-Intensität', min: 1, max: 5, defaultValue: 3 }
        ]
    },
    'smoke': {
        name: 'Smoke',
        category: 'particles',
        description: 'Realistische Rauchsimulation mit Turbulenzen und Windeinfluss',
        thumbnail: 'thumbnails/smoke.png',
        component: 'SmokeWrapper',
        tags: ['particles', 'smoke', 'turbulence', 'wind', 'realistic'],
        difficulty: 'advanced',
        controls: [
            { id: 'density', type: 'range', label: 'Dichte', min: 1, max: 20, defaultValue: 5 },
            { id: 'wind', type: 'range', label: 'Wind', min: -5, max: 5, defaultValue: 1 }
        ]
    },
    'fractal-tree': {
        name: 'Fractal Tree',
        category: 'organic',
        description: 'Organische Wachstumsanimationen mit rekursiver Baumgenerierung',
        thumbnail: 'thumbnails/fractal-tree.png',
        component: 'FractalTreeWrapper',
        tags: ['organic', 'fractal', 'tree', 'growth', 'nature'],
        difficulty: 'advanced',
        controls: [
            { id: 'angle', type: 'range', label: 'Verzweigungswinkel', min: 10, max: 90, defaultValue: 25 },
            { id: 'depth', type: 'range', label: 'Tiefe', min: 5, max: 12, defaultValue: 10 }
        ]
    },
    'kaleidoscope': {
        name: 'Kaleidoscope',
        category: 'geometric',
        description: 'Geometrische Symmetriemuster mit interaktiver Mustererzeugung',
        thumbnail: 'thumbnails/kaleidoscope.png',
        component: 'KaleidoscopeWrapper',
        tags: ['geometric', 'symmetry', 'patterns', 'interactive', 'colorful'],
        difficulty: 'intermediate',
        controls: [
            { id: 'segments', type: 'range', label: 'Segmente', min: 4, max: 24, defaultValue: 12 },
            { id: 'rotationSpeed', type: 'range', label: 'Rotation', min: 0, max: 10, defaultValue: 2 }
        ]
    },
    'plasma': {
        name: 'Plasma',
        category: 'abstract',
        description: 'Elektrische Energieeffekte mit mathematischen Plasma-Funktionen',
        thumbnail: 'thumbnails/plasma.png',
        component: 'PlasmaWrapper',
        tags: ['abstract', 'plasma', 'energy', 'mathematical', 'colorful'],
        difficulty: 'advanced',
        controls: [
            { id: 'scale', type: 'range', label: 'Zoom', min: 10, max: 100, defaultValue: 40 },
            { id: 'speed', type: 'range', label: 'Geschwindigkeit', min: 1, max: 10, defaultValue: 2 }
        ]
    },
    'matrix-rain': {
        name: 'Matrix Rain',
        category: 'abstract',
        description: 'Cyberpunk-ähnliche digitale Regeneffekte mit Zeichenfällen',
        thumbnail: 'thumbnails/matrix-rain.png',
        component: 'MatrixRainWrapper',
        tags: ['abstract', 'matrix', 'cyberpunk', 'digital', 'text'],
        difficulty: 'intermediate',
        controls: [
            { id: 'density', type: 'range', label: 'Dichte', min: 10, max: 50, defaultValue: 20 },
            { id: 'speed', type: 'range', label: 'Fallgeschwindigkeit', min: 1, max: 10, defaultValue: 5 },
            { id: 'color', type: 'color', label: 'Matrix Farbe', defaultValue: '#00ff00' }
        ]
    }
};

export const ANIMATION_CATEGORIES = {
    'particles': {
        name: 'Particle-Systeme',
        icon: '🌟',
        color: '#ff6b6b'
    },
    'nature': {
        name: 'Natur-Phänomene',
        icon: '🌍',
        color: '#4dabf7'
    },
    'weather': {
        name: 'Wetter-Effekte',
        icon: '🌦️',
        color: '#15aabf'
    },
    'cosmic': {
        name: 'Kosmische Effekte',
        icon: '🌌',
        color: '#2b5797'
    },
    'organic': {
        name: 'Organische Muster',
        icon: '🌳',
        color: '#51cf66'
    },
    'geometric': {
        name: 'Geometrische Muster',
        icon: '🔮',
        color: '#9b59b6'
    },
    'abstract': {
        name: 'Abstrakte Kunst',
        icon: '🎨',
        color: '#e74c3c'
    }
};

export const DIFFICULTY_LEVELS = {
    'beginner': {
        name: 'Anfänger',
        color: '#51cf66'
    },
    'intermediate': {
        name: 'Fortgeschritten',
        color: '#f39c12'
    },
    'advanced': {
        name: 'Fortgeschritten',
        color: '#e74c3c'
    }
};

