# DropchipAI - Installations- und Setup-Anleitung

## 🚀 Schnellstart

DropchipAI ist eine KI-gestützte Dropshipping-Automatisierungslösung, die E-Commerce-Prozesse über Plattformen wie Shopify und eBay optimiert.

## 📋 Systemanforderungen

- **Python:** 3.11 oder höher
- **Node.js:** 18.0 oder höher (für Frontend)
- **Betriebssystem:** Windows, macOS, Linux
- **RAM:** Mindestens 4GB (8GB empfohlen)
- **Speicher:** Mindestens 2GB freier Speicherplatz

## 🔧 Installation

### 1. Repository herunterladen

Entpacken Sie die ZIP-Datei in ein Verzeichnis Ihrer Wahl:

```bash
unzip DropchipAI.zip
cd DropchipAI
```

### 2. Backend-Setup

#### Python-Dependencies installieren

```bash
cd backend
pip install -r requirements.txt
```

#### Konfiguration einrichten

1. **Kopieren Sie die Beispiel-Konfigurationsdateien:**
   ```bash
   cp config/credentials.yaml.example config/credentials.yaml
   cp config/settings.yaml.example config/settings.yaml
   ```

2. **Bearbeiten Sie `config/credentials.yaml`** und fügen Sie Ihre API-Schlüssel hinzu:
   ```yaml
   shopify:
     shop_url: "ihr-shop.myshopify.com"
     api_key: "ihr_shopify_api_key"
     password: "ihr_shopify_password"
   
   ebay:
     app_id: "ihre_ebay_app_id"
     cert_id: "ihre_ebay_cert_id"
     dev_id: "ihre_ebay_dev_id"
     auth_token: "ihr_ebay_auth_token"
     sandbox_mode: true  # false für Produktion
   ```

3. **Passen Sie `config/settings.yaml`** nach Bedarf an:
   ```yaml
   ai:
     min_profit_margin: 0.3  # 30% Mindestgewinnmarge
     min_trend_score: 70     # Mindest-Trend-Score
   ```

### 3. Frontend-Setup (Optional)

Das Frontend ist eine React-Anwendung für die grafische Benutzeroberfläche.

```bash
cd frontend
npm install
```

## 🚀 Erste Schritte

### Backend starten

```bash
cd backend
python main.py --keywords "Smart Watch" "Wireless Earbuds" --log-level INFO
```

### Frontend starten (Optional)

```bash
cd frontend
npm start
```

Das Frontend ist dann unter `http://localhost:3000` verfügbar.

## 📖 Verwendung

### Kommandozeilen-Interface

```bash
# Grundlegende Produktrecherche
python main.py --keywords "Smartphone Hülle" "Bluetooth Kopfhörer"

# Mit Debug-Logging
python main.py --keywords "Fitness Tracker" --log-level DEBUG

# Mit eigener Konfigurationsdatei
python main.py --config /pfad/zu/ihrer/config.yaml --keywords "Gaming Maus"
```

### Verfügbare Kommandos

- `--keywords`: Schlüsselwörter für die Produktrecherche (erforderlich)
- `--log-level`: Log-Level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- `--config`: Pfad zu einer benutzerdefinierten Konfigurationsdatei

## 🔑 API-Konfiguration

### Shopify API einrichten

1. Gehen Sie zu Ihrem Shopify Admin-Panel
2. Navigieren Sie zu "Apps" → "App and sales channel settings"
3. Klicken Sie auf "Develop apps"
4. Erstellen Sie eine neue App
5. Konfigurieren Sie die erforderlichen Berechtigungen:
   - `read_products`, `write_products`
   - `read_orders`, `write_orders`
   - `read_inventory`, `write_inventory`
6. Kopieren Sie API-Schlüssel und Passwort in `config/credentials.yaml`

### eBay API einrichten

1. Registrieren Sie sich bei [eBay Developers](https://developer.ebay.com/)
2. Erstellen Sie eine neue Anwendung
3. Holen Sie sich Ihre App-ID, Cert-ID und Dev-ID
4. Generieren Sie ein Auth-Token
5. Kopieren Sie alle Werte in `config/credentials.yaml`

## 📁 Projektstruktur

```
DropchipAI/
├── backend/                 # Python-Backend
│   ├── src/
│   │   ├── ai/             # KI-Module
│   │   │   ├── product_research.py
│   │   │   ├── supplier_scorer.py
│   │   │   └── listing_generator.py
│   │   ├── api/            # API-Integrationen
│   │   │   ├── shopify/
│   │   │   └── ebay/
│   │   ├── core/           # Kernkomponenten
│   │   └── utils/          # Hilfsfunktionen
│   ├── config/             # Konfigurationsdateien
│   ├── logs/               # Log-Dateien
│   ├── data/               # Datenverzeichnis
│   ├── main.py             # Haupteinstiegspunkt
│   └── requirements.txt    # Python-Dependencies
├── frontend/               # React-Frontend
│   ├── components/         # React-Komponenten
│   ├── pages/              # Seiten
│   ├── services/           # API-Services
│   └── package.json        # Node.js-Dependencies
├── tests/                  # Tests
├── README.md               # Hauptdokumentation
└── INSTALLATION.md         # Diese Datei
```

## 🔧 Fehlerbehebung

### Häufige Probleme

#### "Module not found" Fehler
```bash
# Stellen Sie sicher, dass Sie im richtigen Verzeichnis sind
cd backend
python -m pip install -r requirements.txt
```

#### API-Authentifizierungsfehler
- Überprüfen Sie Ihre API-Schlüssel in `config/credentials.yaml`
- Stellen Sie sicher, dass die API-Berechtigungen korrekt konfiguriert sind
- Für eBay: Verwenden Sie zunächst den Sandbox-Modus

#### Keine Produkte gefunden
- Überprüfen Sie Ihre Suchbegriffe
- Passen Sie die Mindestkriterien in `config/settings.yaml` an:
  ```yaml
  ai:
    min_profit_margin: 0.2  # Niedrigere Gewinnmarge
    min_trend_score: 50     # Niedrigerer Trend-Score
  ```

### Log-Dateien

Log-Dateien werden in `backend/logs/` gespeichert:
- `dropchipai_YYYYMMDD.log`: Tägliche Log-Dateien
- Verwenden Sie `--log-level DEBUG` für detaillierte Informationen

## 🛡️ Sicherheit

### Wichtige Sicherheitshinweise

1. **Niemals API-Schlüssel in die Versionskontrolle eincheck**
2. **Verwenden Sie starke Passwörter für alle Accounts**
3. **Aktivieren Sie 2FA für alle E-Commerce-Plattformen**
4. **Überprüfen Sie regelmäßig die API-Berechtigungen**
5. **Verwenden Sie HTTPS für alle API-Aufrufe**

### Datenschutz

- Alle sensiblen Daten werden lokal gespeichert
- Keine Daten werden an Dritte weitergegeben
- API-Aufrufe erfolgen direkt an die jeweiligen Plattformen

## 📞 Support

### Dokumentation
- Lesen Sie die vollständige Dokumentation in `README.md`
- Schauen Sie sich die Beispiele in den Modulen an

### Logs analysieren
```bash
# Aktuelle Logs anzeigen
tail -f backend/logs/dropchipai_$(date +%Y%m%d).log

# Fehler suchen
grep "ERROR" backend/logs/dropchipai_*.log
```

### Häufige Lösungen

1. **Neustart des Systems:**
   ```bash
   # Backend neu starten
   cd backend
   python main.py --keywords "Test"
   ```

2. **Cache leeren:**
   ```bash
   # Python-Cache leeren
   find . -name "__pycache__" -type d -exec rm -rf {} +
   ```

3. **Dependencies neu installieren:**
   ```bash
   pip install --upgrade -r requirements.txt
   ```

## 🚀 Produktionsbereitschaft

### Vor dem Live-Gang

1. **Testen Sie alle Funktionen im Sandbox-Modus**
2. **Überprüfen Sie alle Konfigurationen**
3. **Erstellen Sie Backups Ihrer Konfigurationsdateien**
4. **Setzen Sie `sandbox_mode: false` in der eBay-Konfiguration**
5. **Überwachen Sie die ersten Läufe genau**

### Monitoring

- Überwachen Sie die Log-Dateien regelmäßig
- Setzen Sie Alerts für kritische Fehler
- Überprüfen Sie die API-Rate-Limits

---

**Viel Erfolg mit DropchipAI! 🎉**

