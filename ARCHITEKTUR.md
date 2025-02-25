# Architektur der Energiefeld-Animationen

## Überblick

Die Anwendung ist in separate JavaScript-Module aufgeteilt, die jeweils eine bestimmte Animation handhaben. Die Hauptseite `index.html` dient als zentrale Oberfläche für die Darstellung und Konfiguration aller Animationen.

## Komponenten

1. **index.html**
   - Dient als Einstiegspunkt der Anwendung.
   - Enthält alle Benutzeroberflächen-Elemente für die Konfiguration der Animationen.
   - Lädt die jeweiligen JavaScript-Module für jede Animation.

2. **energy-field.js**
   - Implementiert die "Freude und Energie"-Animation.
   - Bietet Parameter für Radius, Geschwindigkeit und Farbe.
   - Kann als Iframe in andere Seiten eingebunden werden.

3. **blue-sky.js**
   - Implementiert die Wolkenanimation.
   - Parameter: Wolken-Geschwindigkeit und -Größe.
   - Kann als Iframe verwendet werden.

4. **firework.js**
   - Implementiert die Feuerwerk-Animation.
   - Parameter: Geschwindigkeit und Farbe.
   - Kann als Iframe eingebunden werden.

5. **water-waves.js**
   - Implementiert die Wasserwellen-Animation.
   - Parameter: Wellen-Geschwindigkeit und -Höhe.
   - Kann als Iframe verwendet werden.

## Weitere Features

- **Konfigurierbarkeit**: Jede Animation kann über Slider und Farbauswahlfelder angepasst werden.
- **Code-Kopie**: Jede Animation kann als Iframe-Code kopiert und in andere Webseiten eingebunden werden.
- **Weichzeichnung**: Optional kann eine Weichzeichnung für jede Animation aktiviert werden.

## Entwicklung

Die Anwendung ist in reinem JavaScript geschrieben und verwendet HTML5-Canvas für die Darstellung der Animationen. Es sind keine externen Bibliotheken oder Frameworks erforderlich, was die Implementierung einfach und effizient macht.