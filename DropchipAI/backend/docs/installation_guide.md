# DropchipAi Installationsanleitung

Diese Anleitung führt Sie durch die Installation und Einrichtung des DropchipAi-Systems auf Ihrem lokalen Computer, damit Sie es im vollen Umfang testen können.

## Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [Backend-Installation](#backend-installation)
3. [Frontend-Installation](#frontend-installation)
4. [Konfiguration](#konfiguration)
5. [Starten des Systems](#starten-des-systems)
6. [Testen der Funktionen](#testen-der-funktionen)
7. [Fehlerbehebung](#fehlerbehebung)

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass folgende Software auf Ihrem Computer installiert ist:

### Für das Backend:
- Python 3.8 oder höher
- pip (Python-Paketmanager)
- Git

### Für das Frontend:
- Node.js 14 oder höher
- npm 6 oder höher
- Git

## Backend-Installation

1. **Repository klonen**

   Öffnen Sie ein Terminal oder eine Kommandozeile und führen Sie folgende Befehle aus:

   ```bash
   git clone https://github.com/yourusername/DropchipAi.git
   cd DropchipAi
   ```

   Falls Sie das Projekt bereits als ZIP-Datei heruntergeladen haben, entpacken Sie es und navigieren Sie zum Projektverzeichnis.

2. **Python-Umgebung einrichten**

   Es wird empfohlen, eine virtuelle Umgebung zu verwenden:

   ```bash
   # Virtuelle Umgebung erstellen
   python -m venv venv

   # Virtuelle Umgebung aktivieren
   # Unter Windows:
   venv\Scripts\activate
   # Unter macOS/Linux:
   source venv/bin/activate
   ```

3. **Abhängigkeiten installieren**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Konfigurationsdatei erstellen**

   Erstellen Sie eine Datei `config/credentials.yaml` mit Ihren API-Schlüsseln:

   ```yaml
   shopify:
     shop_url: "your-store.myshopify.com"
     api_key: "your_api_key"
     password: "your_password"

   ebay:
     app_id: "your_app_id"
     dev_id: "your_dev_id"
     cert_id: "your_cert_id"
     auth_token: "your_auth_token"
     sandbox_mode: true  # Auf false setzen für Produktionsumgebung
   ```

   Für Testzwecke können Sie zunächst Dummy-Werte verwenden oder die Sandbox-Modi der APIs nutzen.

## Frontend-Installation

1. **Node.js-Abhängigkeiten installieren**

   ```bash
   cd frontend
   npm install
   ```

   Dieser Befehl installiert alle erforderlichen JavaScript-Bibliotheken, die im `package.json`-File definiert sind.

2. **Umgebungsvariablen konfigurieren**

   Erstellen Sie eine Datei `.env` im Frontend-Verzeichnis:

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENV=development
   ```

## Konfiguration

### Backend-Konfiguration

1. **Einstellungen anpassen**

   Öffnen Sie die Datei `backend/config/settings.yaml` und passen Sie die Einstellungen nach Bedarf an:

   ```yaml
   server:
     host: "0.0.0.0"
     port: 5000
     debug: true

   database:
     type: "sqlite"  # Für Entwicklung
     path: "db/dropchip.db"

   logging:
     level: "DEBUG"
     file: "logs/dropchip.log"
   ```

### Frontend-Konfiguration

1. **API-Endpunkt konfigurieren**

   Stellen Sie sicher, dass die API-URL in der `.env`-Datei korrekt auf Ihren lokalen Backend-Server zeigt.

## Starten des Systems

### Backend starten

1. **Server starten**

   Navigieren Sie zum Backend-Verzeichnis und führen Sie aus:

   ```bash
   # Stellen Sie sicher, dass die virtuelle Umgebung aktiviert ist
   python main.py
   ```

   Der Server sollte nun auf Port 5000 laufen und Ausgaben im Terminal anzeigen.

### Frontend starten

1. **Entwicklungsserver starten**

   Öffnen Sie ein neues Terminal, navigieren Sie zum Frontend-Verzeichnis und führen Sie aus:

   ```bash
   npm start
   ```

   Der React-Entwicklungsserver sollte starten und automatisch einen Browser öffnen mit der URL `http://localhost:3000`.

## Testen der Funktionen

Nachdem beide Komponenten gestartet sind, können Sie das System testen:

1. **Registrierung und Anmeldung**
   - Öffnen Sie `http://localhost:3000` in Ihrem Browser
   - Klicken Sie auf "Registrieren" und erstellen Sie ein Testkonto
   - Melden Sie sich mit Ihren Anmeldedaten an

2. **Dashboard erkunden**
   - Nach der Anmeldung werden Sie zum Dashboard weitergeleitet
   - Erkunden Sie die verschiedenen Bereiche und Funktionen

3. **Produktrecherche testen**
   - Navigieren Sie zum Bereich "Produktrecherche"
   - Geben Sie Suchbegriffe ein (z.B. "Smart Watch", "Wireless Earbuds")
   - Testen Sie die Filterfunktionen

4. **Lieferantenbewertung testen**
   - Wählen Sie ein Produkt aus der Recherche
   - Prüfen Sie die Lieferantenbewertungen und -vergleiche

5. **Workflow-Automatisierung testen**
   - Erstellen Sie einen einfachen Workflow
   - Testen Sie verschiedene Trigger und Aktionen

6. **E-Commerce-Integrationen testen**
   - Verbinden Sie Ihre Test-Shopify- oder eBay-Konten
   - Testen Sie das Erstellen von Produktlistings

## Fehlerbehebung

### Häufige Probleme und Lösungen

1. **Backend startet nicht**
   - Überprüfen Sie, ob alle Abhängigkeiten installiert sind
   - Prüfen Sie die Konfigurationsdateien auf Fehler
   - Überprüfen Sie die Logs im Verzeichnis `backend/logs`

2. **Frontend zeigt Verbindungsfehler**
   - Stellen Sie sicher, dass das Backend läuft
   - Überprüfen Sie die API-URL in der `.env`-Datei
   - Prüfen Sie die Browser-Konsole auf JavaScript-Fehler

3. **API-Fehler bei Integrationen**
   - Überprüfen Sie die API-Schlüssel in `config/credentials.yaml`
   - Stellen Sie sicher, dass die APIs im Sandbox-Modus sind für Tests
   - Prüfen Sie die Berechtigungen Ihrer API-Schlüssel

4. **Datenbank-Fehler**
   - Für SQLite: Überprüfen Sie die Schreibrechte im Verzeichnis `backend/db`
   - Stellen Sie sicher, dass das Datenbankschema korrekt initialisiert wurde

### Support

Falls Sie weitere Hilfe benötigen:
- Überprüfen Sie die Dokumentation im `docs`-Verzeichnis
- Konsultieren Sie die technische Dokumentation für detaillierte Informationen zur Architektur
- Prüfen Sie die Testdateien im `tests`-Verzeichnis für Beispiele zur Verwendung der Komponenten

## Nächste Schritte

Nach erfolgreicher Installation und Testung können Sie:
- Eigene Anpassungen am Code vornehmen
- Neue Funktionen entwickeln
- Die Benutzeroberfläche anpassen
- Weitere E-Commerce-Plattformen integrieren

Viel Erfolg beim Testen und Verwenden von DropchipAi!
