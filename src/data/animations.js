export const ANIMATION_REGISTRY = {
    'energy-field': {
        name: 'Freude und Energie',
        category: 'particles',
        description: 'Dynamische Partikelanimation mit interaktiven Effekten',
        thumbnail: 'thumbnails/energy-field.png',
        component: 'EnergyFieldWrapper',
        tags: ['particles', 'interactive', 'energy', 'colorful'],
        difficulty: 'beginner'
    },
    'blue-sky': {
        name: 'Blauer Himmel',
        category: 'nature',
        description: 'Entspannende Wolkenanimation mit Wind-Effekten',
        thumbnail: 'thumbnails/blue-sky.png',
        component: 'BlueSkyWrapper',
        tags: ['nature', 'clouds', 'relaxing', 'weather'],
        difficulty: 'beginner'
    },
    'firework': {
        name: 'Feuerwerk',
        category: 'particles',
        description: 'Beeindruckende Feuerwerksanimation mit Explosionen',
        thumbnail: 'thumbnails/firework.png',
        component: 'FireworkWrapper',
        tags: ['particles', 'explosions', 'celebration', 'colorful'],
        difficulty: 'beginner'
    },
    'water-waves': {
        name: 'Wasserwellen',
        category: 'nature',
        description: 'Beruhigende Wellenanimation mit Splash-Effekten',
        thumbnail: 'thumbnails/water-waves.png',
        component: 'WaterWavesWrapper',
        tags: ['nature', 'water', 'waves', 'relaxing'],
        difficulty: 'beginner'
    },
    'aurora': {
        name: 'Aurora Borealis',
        category: 'nature',
        description: 'Faszinierende Nordlicht-Animation mit Lichtbändern',
        thumbnail: 'thumbnails/aurora.png',
        component: 'AuroraWrapper',
        tags: ['nature', 'aurora', 'northern-lights', 'atmospheric'],
        difficulty: 'intermediate'
    },
    'chakra-animation': {
        name: 'Chakra Animation',
        category: 'geometric',
        description: 'Geometrische Muster mit spirituellen Symbolen',
        thumbnail: 'thumbnails/chakra-animation.png',
        component: 'ChakraAnimationWrapper',
        tags: ['geometric', 'spiritual', 'meditation', 'symbols'],
        difficulty: 'beginner'
    },
    'star-field': {
        name: 'Star Field',
        category: 'cosmic',
        description: 'Kosmisches Sternenfeld mit Parallax-Effekt und Sternschnuppen',
        thumbnail: 'thumbnails/star-field.png',
        component: 'StarFieldWrapper',
        tags: ['cosmic', 'stars', 'parallax', 'meteors', 'space'],
        difficulty: 'intermediate'
    },
    'rain': {
        name: 'Rain',
        category: 'weather',
        description: 'Realistischer Regen mit Splash-Effekten und Pfützenbildung',
        thumbnail: 'thumbnails/rain.png',
        component: 'RainWrapper',
        tags: ['weather', 'rain', 'splashes', 'puddles', 'realistic'],
        difficulty: 'intermediate'
    },
    'lightning': {
        name: 'Lightning',
        category: 'weather',
        description: 'Dynamische Blitzelektrische Entladungen mit Verzweigungen',
        thumbnail: 'thumbnails/lightning.png',
        component: 'LightningWrapper',
        tags: ['weather', 'lightning', 'thunder', 'storms', 'dramatic'],
        difficulty: 'advanced'
    },
    'smoke': {
        name: 'Smoke',
        category: 'particles',
        description: 'Realistische Rauchsimulation mit Turbulenzen und Windeinfluss',
        thumbnail: 'thumbnails/smoke.png',
        component: 'SmokeWrapper',
        tags: ['particles', 'smoke', 'turbulence', 'wind', 'realistic'],
        difficulty: 'advanced'
    },
    'fractal-tree': {
        name: 'Fractal Tree',
        category: 'organic',
        description: 'Organische Wachstumsanimationen mit rekursiver Baumgenerierung',
        thumbnail: 'thumbnails/fractal-tree.png',
        component: 'FractalTreeWrapper',
        tags: ['organic', 'fractal', 'tree', 'growth', 'nature'],
        difficulty: 'advanced'
    },
    'kaleidoscope': {
        name: 'Kaleidoscope',
        category: 'geometric',
        description: 'Geometrische Symmetriemuster mit interaktiver Mustererzeugung',
        thumbnail: 'thumbnails/kaleidoscope.png',
        component: 'KaleidoscopeWrapper',
        tags: ['geometric', 'symmetry', 'patterns', 'interactive', 'colorful'],
        difficulty: 'intermediate'
    },
    'plasma': {
        name: 'Plasma',
        category: 'abstract',
        description: 'Elektrische Energieeffekte mit mathematischen Plasma-Funktionen',
        thumbnail: 'thumbnails/plasma.png',
        component: 'PlasmaWrapper',
        tags: ['abstract', 'plasma', 'energy', 'mathematical', 'colorful'],
        difficulty: 'advanced'
    },
    'matrix-rain': {
        name: 'Matrix Rain',
        category: 'abstract',
        description: 'Cyberpunk-ähnliche digitale Regeneffekte mit Zeichenfällen',
        thumbnail: 'thumbnails/matrix-rain.png',
        component: 'MatrixRainWrapper',
        tags: ['abstract', 'matrix', 'cyberpunk', 'digital', 'text'],
        difficulty: 'intermediate'
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
