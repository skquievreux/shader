# Energiefeld-Animationen

Eine Sammlung interaktiver Canvas-Animationen für Webprojekte. Diese Bibliothek bietet fünf verschiedene Animationen, die einfach in jede Webseite eingebunden werden können.

> **Version 2.1.1** - Bugfix Release mit korrigierten Embed-URLs und Copyright-Informationen

![Energiefeld-Animationen](https://via.placeholder.com/800x400?text=Energiefeld-Animationen)

## Funktionen

- **Freude und Energie**: Eine dynamische Partikelanimation mit konfigurierbarer Farbe und Dichte
- **Blauer Himmel**: Eine entspannende Wolkenanimation mit anpassbarer Windgeschwindigkeit
- **Feuerwerk**: Eine beeindruckende Feuerwerksanimation mit einstellbarer Frequenz und Farbe
- **Wasserwellen**: Eine beruhigende Wellenanimation mit interaktiven Splash-Effekten
- **Aurora Borealis**: Eine faszinierende Nordlicht-Animation mit fließenden Lichtbändern und pulsierenden Partikeln

Alle Animationen sind vollständig anpassbar über eine intuitive Benutzeroberfläche und können als Iframe in andere Webseiten eingebettet werden.

## Demo

Eine Live-Demo ist verfügbar unter: [https://shader.runitfast.xyz](https://shader.runitfast.xyz)

### Embed Testseite
Testen Sie die Einbettungsfunktionalität: [https://shader.runitfast.xyz/embed-test.html](https://shader.runitfast.xyz/embed-test.html)

## Installation

1. Klonen Sie das Repository:
   ```bash
   git clone https://github.com/ihr-benutzername/energiefeld-animationen.git
   ```

2. Öffnen Sie die `index.html` in einem modernen Webbrowser oder hosten Sie die Dateien auf einem Webserver.

## Verwendung

### Lokale Verwendung

Öffnen Sie einfach die `index.html` in einem Webbrowser, um alle Animationen zu sehen und zu konfigurieren.

### Einbetten in andere Webseiten

Jede Animation kann als Iframe in andere Webseiten eingebettet werden:

```html
<iframe src="https://shader.runitfast.xyz/embed.html?animation=energy-field&particles=200&speed=5&color=ff6b6b" 
        width="500" height="300" frameborder="0"></iframe>
```

### Parameter für Einbettung

Alle Animationen unterstützen folgende URL-Parameter:

- **animation**: Die zu verwendende Animation (`energy-field`, `blue-sky`, `firework`, `water-waves`, `aurora`)

Zusätzliche Parameter je nach Animation:

#### Freude und Energie (energy-field)
- **particles**: Anzahl der Partikel (50-500)
- **speed**: Geschwindigkeit (1-10)
- **color**: Farbe im Hex-Format ohne # (z.B. ff6b6b)

#### Blauer Himmel (blue-sky)
- **clouds**: Wolkendichte (5-30)
- **speed**: Windgeschwindigkeit (1-10)
- **color**: Himmelsfarbe im Hex-Format ohne # (z.B. 4dabf7)

#### Feuerwerk (firework)
- **frequency**: Häufigkeit (1-10)
- **particles**: Partikelgröße (20-200)
- **color**: Grundfarbe im Hex-Format ohne # (z.B. cc5de8)

#### Wasserwellen (water-waves)
- **height**: Wellenhöhe (1-50)
- **speed**: Wellengeschwindigkeit (1-10)
- **color**: Wasserfarbe im Hex-Format ohne # (z.B. 15aabf)

#### Aurora Borealis (aurora)
- **intensity**: Intensität der Aurora (1-10)
- **speed**: Bewegungsgeschwindigkeit (1-10)
- **color**: Grundfarbe im Hex-Format ohne # (z.B. 00ff88)

### Beispiele für Einbettung

```html
<!-- Aurora mit maximaler Intensität -->
<iframe src="https://shader.runitfast.xyz/embed.html?animation=aurora&intensity=10&speed=5&color=00ff88" 
        width="800" height="400" frameborder="0"></iframe>

<!-- Energiefeld mit vielen roten Partikeln -->
<iframe src="https://shader.runitfast.xyz/embed.html?animation=energy-field&particles=400&speed=7&color=ff0000" 
        width="600" height="300" frameborder="0"></iframe>

<!-- Sanfte blaue Wasserwellen -->
<iframe src="https://shader.runitfast.xyz/embed.html?animation=water-waves&height=10&speed=2&color=0088ff" 
        width="500" height="200" frameborder="0"></iframe>
```

## Projektstruktur

- **index.html**: Die Hauptseite mit allen Animationen
- **embed.html**: Seite für die Einbettung einzelner Animationen
- **styles.css**: Styling für die Benutzeroberfläche
- **energy-field.js**: Implementierung der "Freude und Energie"-Animation
- **blue-sky.js**: Implementierung der "Blauer Himmel"-Animation
- **firework.js**: Implementierung der "Feuerwerk"-Animation
- **water-waves.js**: Implementierung der "Wasserwellen"-Animation
- **aurora.js**: Implementierung der "Aurora Borealis"-Animation

## Technologien

- HTML5 Canvas mit erweiterten Rendering-Techniken
- Vanilla JavaScript (keine externen Abhängigkeiten)
- CSS3 mit modernen Features (CSS Grid, Flexbox, Variablen)
- Responsive Design
- Cross-Browser-Kompatibilität

## Besondere Features

### Aurora Borealis Animation
Die neue Aurora-Animation bietet:
- **Mehrschichtige Lichtbänder** mit realistischen Farbübergängen
- **Partikeleffekte** für zusätzliche Tiefe
- **Mausinteraktion** für dynamische Effekte
- **Sternenfeld-Hintergrund** für atmosphärische Darstellung
- **Mathematische Wellenformen** für natürliche Bewegungen
- **Adaptive Farbpaletten** basierend auf der Grundfarbe

## Browser-Kompatibilität

Die Animationen wurden getestet und funktionieren in folgenden Browsern:
- Chrome (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Edge (neueste Version)

## Performance

Alle Animationen sind für optimale Performance entwickelt:
- **RequestAnimationFrame** für smooth 60fps Animationen
- **Canvas-Optimierungen** für bessere Rendering-Performance
- **Responsive Canvas-Größenanpassung**
- **Effiziente Partikel-Management-Systeme**
- **Memory-optimierte Algorithmen**

## Entwicklung

### Lokalen Entwicklungsserver starten

Sie können einen einfachen HTTP-Server verwenden, um die Animationen lokal zu testen:

```bash
# Mit Python
python -m http.server

# Oder mit Node.js
npx http-server

# Oder mit Live Server (VS Code Extension)
Live Server Extension verwenden
```

### Environment Konfiguration

Das Projekt verwendet eine automatische Environment-Konfiguration:

- **Production**: `https://shader.runitfast.xyz`
- **Development**: Automatische Erkennung der localhost URL
- **Vercel Integration**: Unterstützt Environment Variables

Die `environment-config.js` Datei sorgt für korrekte URLs in allen Umgebungen.

### Neue Animation hinzufügen

1. Erstellen Sie eine neue `.js`-Datei nach dem Muster der bestehenden Animationen
2. Implementieren Sie eine ES6-Klasse mit `init()`, `update()`, `draw()` und `animate()` Methoden
3. Fügen Sie die Animation zu `index.html` und `embed.html` hinzu
4. Erweitern Sie die Parameter-Dokumentation

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz - siehe die [LICENSE](LICENSE) Datei für Details.

## Autor & Kontakt

Entwickelt von **Quievreux Consulting**

📧 **E-Mail**: [quievreux.consulting@gmail.com](mailto:quievreux.consulting@gmail.com)

**© 2025 DreamEdit. Alle Rechte vorbehalten.**

## Mitwirken

Beiträge sind willkommen! Bitte lesen Sie [CONTRIBUTING.md](CONTRIBUTING.md) für Details zum Prozess für Pull Requests.

## Hosting & Deployment

### Vercel Deployment

Für das Deployment auf Vercel können Sie folgende Environment Variables verwenden:

- `BASE_URL`: https://shader.runitfast.xyz
- `IS_PRODUCTION`: true

Die `environment-config.js` erkennt automatisch die korrekte Umgebung.

### Datei-Struktur für Hosting

```
├── index.html              # Hauptseite
├── embed.html              # Embed-Seite
├── embed-test.html         # Testseite für Embeds
├── environment-config.js   # Environment-Konfiguration
├── adaptive-quality.js     # Performance-Optimierung
├── *.js                    # Animationsdateien
├── styles.css              # Stylesheets
└── assets/                 # Statische Ressourcen
```

## Changelog

### Version 2.0.0
- ✨ **Neue Animation**: Aurora Borealis mit realistischen Nordlichteffekten
- 🔧 **Verbesserte Performance**: Optimierte Rendering-Algorithmen mit Gradient-Caching und Spatial Grid
- 📱 **Mobile Unterstützung**: Touch-Events für alle Animationen
- 🎨 **Erweiterte Farbpaletten**: Dynamische Farbsysteme
- 🌐 **Environment-Konfiguration**: Automatische URL-Anpassung für Development/Production
- 📊 **Adaptive Quality**: Performance-basierte Qualitätsoptimierung
- 🧪 **Embed-Testseite**: Komplette Testumgebung für Einbettungen
- 📚 **Erweiterte Dokumentation**: Vollständige API-Referenz und Hosting-Anleitung