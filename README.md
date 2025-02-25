# Energiefeld-Animationen

Eine Sammlung interaktiver Canvas-Animationen für Webprojekte. Diese Bibliothek bietet vier verschiedene Animationen, die einfach in jede Webseite eingebunden werden können.

![Energiefeld-Animationen](https://via.placeholder.com/800x400?text=Energiefeld-Animationen)

## Funktionen

- **Freude und Energie**: Eine dynamische Partikelanimation mit konfigurierbarer Farbe und Dichte
- **Blauer Himmel**: Eine entspannende Wolkenanimation mit anpassbarer Windgeschwindigkeit
- **Feuerwerk**: Eine beeindruckende Feuerwerksanimation mit einstellbarer Frequenz und Farbe
- **Wasserwellen**: Eine beruhigende Wellenanimation mit interaktiven Splash-Effekten

Alle Animationen sind vollständig anpassbar über eine intuitive Benutzeroberfläche und können als Iframe in andere Webseiten eingebettet werden.

## Demo

Eine Live-Demo ist verfügbar unter: [https://ihre-demo-url.com](https://ihre-demo-url.com)

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
<iframe src="https://ihre-domain.com/energiefeld-animationen/embed.html?animation=energy-field&particles=200&speed=5&color=ff6b6b" 
        width="500" height="300" frameborder="0"></iframe>
```

### Parameter für Einbettung

Alle Animationen unterstützen folgende URL-Parameter:

- **animation**: Die zu verwendende Animation (`energy-field`, `blue-sky`, `firework`, `water-waves`)

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

## Projektstruktur

- **index.html**: Die Hauptseite mit allen Animationen
- **embed.html**: Seite für die Einbettung einzelner Animationen
- **styles.css**: Styling für die Benutzeroberfläche
- **energy-field.js**: Implementierung der "Freude und Energie"-Animation
- **blue-sky.js**: Implementierung der "Blauer Himmel"-Animation
- **firework.js**: Implementierung der "Feuerwerk"-Animation
- **water-waves.js**: Implementierung der "Wasserwellen"-Animation

## Technologien

- HTML5 Canvas
- Vanilla JavaScript (keine externen Abhängigkeiten)
- CSS3

## Browser-Kompatibilität

Die Animationen wurden getestet und funktionieren in folgenden Browsern:
- Chrome (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Edge (neueste Version)

## Entwicklung

### Lokalen Entwicklungsserver starten

Sie können einen einfachen HTTP-Server verwenden, um die Animationen lokal zu testen:

```bash
# Mit Python
python -m http.server

# Oder mit Node.js
npx http-server
```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz - siehe die [LICENSE](LICENSE) Datei für Details.

## Autor

Ihr Name - [Ihre Website](https://ihre-website.com)

## Mitwirken

Beiträge sind willkommen! Bitte lesen Sie [CONTRIBUTING.md](CONTRIBUTING.md) für Details zum Prozess für Pull Requests.