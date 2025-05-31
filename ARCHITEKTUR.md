# Architektur der Energiefeld-Animationen

## Überblick

Die Anwendung ist in separate JavaScript-Module aufgeteilt, die jeweils eine bestimmte Animation handhaben. Die Hauptseite `index.html` dient als zentrale Oberfläche für die Darstellung und Konfiguration aller Animationen. Das System folgt einem modularen, objektorientierten Ansatz mit konsistenten APIs zwischen allen Animationskomponenten.

## Architektonische Prinzipien

### 1. **Modulare Struktur**
- Jede Animation ist als eigenständiges ES6-Modul implementiert
- Konsistente Klassen-basierte Architektur
- Keine Abhängigkeiten zwischen den Animationsmodulen
- Einfache Erweiterbarkeit für neue Animationen

### 2. **Performance-First Design**
- Optimierte Canvas-Rendering mit `requestAnimationFrame`
- Effiziente Partikel-Management-Systeme
- Memory-optimierte Algorithmen
- Responsive Canvas-Größenanpassung

### 3. **Einheitliche API**
- Standardisierte Methoden: `init()`, `update()`, `draw()`, `animate()`
- Konsistente Parameter-Handling
- Einheitliche Event-Listener-Patterns
- Gemeinsame Utility-Funktionen

## Komponenten-Architektur

### **Core Files**

1. **index.html** - Hauptanwendung
   - Zentrale Benutzeroberfläche für alle Animationen
   - Responsive Grid-Layout für Animation-Container
   - Modal-System für Code-Export
   - Gemeinsame Canvas-Verwaltung

2. **embed.html** - Einbettungs-Interface
   - Minimalistische Vollbild-Darstellung
   - URL-Parameter-basierte Konfiguration
   - Cross-Domain-Kommunikation via PostMessage
   - Vollbild-Kontrollen

3. **styles.css** - Design-System
   - CSS-Variable-basiertes Theming
   - Responsive Design mit Mobile-First Approach
   - Modernes UI mit Glassmorphism-Effekten
   - Dark Mode Vorbereitung

### **Animation-Module**

4. **energy-field.js** - Partikel-Animation
   - **Klasse**: `EnergyField`
   - **Features**: Interaktive Partikel mit Mausabstoßung, Verbindungslinien
   - **Parameter**: Partikelanzahl (50-500), Geschwindigkeit (1-10), Farbe
   - **Algorithmus**: Physik-basierte Bewegung mit Kollisionserkennung

5. **blue-sky.js** - Wolken-Animation
   - **Klasse**: `BlueSky`
   - **Features**: Parallax-Wolkenschichten, Windeffekte
   - **Parameter**: Wolkendichte (5-30), Windgeschwindigkeit (1-10), Himmelsfarbe
   - **Algorithmus**: Layered Parallax mit Perlin-Noise-artigen Effekten

6. **firework.js** - Feuerwerk-Animation
   - **Klasse**: `Firework`
   - **Features**: Raketen-Physik, Explosionspartikel, Click-to-Launch
   - **Parameter**: Häufigkeit (1-10), Partikelgröße (20-200), Grundfarbe
   - **Algorithmus**: Ballistische Physik mit Gravitationseffekten

7. **water-waves.js** - Wellen-Animation
   - **Klasse**: `WaterWaves`
   - **Features**: Sinuswellen-Überlagerung, Splash-Effekte
   - **Parameter**: Wellenhöhe (1-50), Geschwindigkeit (1-10), Wasserfarbe
   - **Algorithmus**: Mathematische Wellengleichungen mit Interferenz

8. **aurora.js** - Nordlicht-Animation ✨ **NEU**
   - **Klasse**: `Aurora`
   - **Features**: Mehrschichtige Lichtbänder, Partikeleffekte, Sternenfeld
   - **Parameter**: Intensität (1-10), Bewegungsgeschwindigkeit (1-10), Grundfarbe
   - **Algorithmus**: Komplexe Sinus-Überlagerungen mit Rauschfunktionen

## Technische Implementation

### **Canvas-Rendering-Pipeline**

```javascript
class AnimationBase {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.setupEventListeners();
        this.setupControls();
        this.init();
        this.animate();
    }

    init() { /* Initialisierung der Animationsdaten */ }
    update() { /* Physik und Logik Updates */ }
    draw() { /* Canvas-Rendering */ }
    animate() { 
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
```

### **Parameter-Management-System**

Jede Animation implementiert ein einheitliches Parameter-System:

```javascript
setupControls() {
    const slider = document.getElementById('animation-parameter');
    if (slider) {
        slider.addEventListener('input', () => {
            this.parameter = slider.value;
            this.updateParameter();
        });
    }
}
```

### **Event-Handling-Architecture**

- **Mouse/Touch Events**: Konsistente Interaktionserkennung
- **Resize Events**: Adaptive Canvas-Größenanpassung
- **Parameter Updates**: Real-time Konfigurationsänderungen
- **Cross-Domain Communication**: PostMessage für Embed-Kommunikation

## Aurora-Animation: Detaillierte Architektur ✨

### **Rendering-Layers**
1. **Hintergrund-Gradient**: Dynamischer Himmelsverlauf
2. **Sternenfeld**: Prozedural generierte Sterne mit Twinkling
3. **Aurora-Bänder**: Multi-Layer-Lichtströme mit Bézier-Kurven
4. **Partikeleffekte**: Glühende Partikelsysteme
5. **Glow-Effekte**: Radiale Gradienten für Leuchteffekte

### **Mathematische Grundlagen**
- **Wellenfunktionen**: Überlagerung mehrerer Sinuswellen für organische Bewegung
- **Rauschfunktionen**: Perlin-Noise-ähnliche Algorithmen für natürliche Variationen
- **Farbinterpolation**: HSL-basierte Farbübergänge
- **Physik-Simulation**: Partikel-Bewegung mit Gravitationseinfluss

### **Performance-Optimierungen**
- **Adaptive Partikelanzahl**: Basierend auf Intensitäts-Parameter
- **Effiziente Kurven-Berechnung**: Cached Bézier-Punkte
- **Selective Rendering**: Culling für nicht-sichtbare Elemente
- **Memory Management**: Objektpooling für Partikel

## Einbettungs-System

### **URL-Parameter-Schema**
```
embed.html?animation=aurora&intensity=8&speed=5&color=00ff88
```

### **Parameter-Validierung**
- Range-Checking für alle numerischen Parameter
- Hex-Color-Validierung für Farbwerte
- Fallback auf Standardwerte bei ungültigen Parametern

### **Cross-Domain-Kommunikation**
```javascript
// Dynamische Konfiguration via PostMessage
window.addEventListener('message', (event) => {
    const config = JSON.parse(event.data);
    if (config.type === 'animation-config') {
        this.applyConfiguration(config);
    }
});
```

## Erweiterbarkeit

### **Neue Animation hinzufügen**

1. **Erstellen der Animation-Klasse**:
   ```javascript
   class NewAnimation {
       constructor(canvasId) { /* Standard-Pattern */ }
       // Implementierung der Standard-Methoden
   }
   ```

2. **Integration in index.html**:
   - HTML-Section für Controls hinzufügen
   - JavaScript-Import einbinden
   - Modal-System erweitern

3. **Embed-Unterstützung**:
   - Switch-Case in embed.html erweitern
   - Parameter-Handling implementieren

4. **Dokumentation aktualisieren**:
   - README.md Parameter-Sektion
   - ARCHITEKTUR.md Komponenten-Liste

## Entwicklungsrichtlinien

### **Code-Standards**
- **ES6+ Syntax**: Moderne JavaScript-Features
- **Konsistente Namenskonventionen**: camelCase für Variablen, PascalCase für Klassen
- **Dokumentierte APIs**: JSDoc-Kommentare für öffentliche Methoden
- **Error Handling**: Graceful Degradation bei Fehlern

### **Performance-Richtlinien**
- **60fps Target**: Alle Animationen optimiert für 60fps
- **Memory Efficiency**: Vermeidung von Memory Leaks
- **Battery Optimization**: Effiziente Algorithmen für mobile Geräte
- **Responsive Design**: Adaptive Rendering-Qualität

### **Browser-Kompatibilität**
- **Modern Standards**: HTML5 Canvas, ES6+, CSS Grid
- **Progressive Enhancement**: Graceful Fallbacks
- **Touch Support**: Mobile-optimierte Interaktionen
- **Accessibility**: ARIA-konforme Steuerelemente

## Zukünftige Erweiterungen

### **Geplante Features**
- **WebGL-Renderer**: Hardware-beschleunigte Animationen
- **Audio-Reaktivität**: Sound-responsive Animationen
- **VR/AR-Support**: Immersive Animationserlebnisse
- **AI-gesteuerte Effekte**: Machine Learning für procedural Animationen

### **Performance-Verbesserungen**
- **Web Workers**: Background-Threading für komplexe Berechnungen
- **OffscreenCanvas**: Separate Rendering-Threads
- **WASM-Integration**: High-Performance Algorithmen
- **GPU-Compute**: WebGPU für parallele Berechnungen

Die Architektur ist darauf ausgelegt, sowohl für einfache Einbettungen als auch für komplexe, interaktive Anwendungen skalierbar zu sein, während sie gleichzeitig eine hohe Performance und Benutzerfreundlichkeit gewährleistet.