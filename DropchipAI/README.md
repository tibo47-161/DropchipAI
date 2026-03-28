# DropchipAI - KI-gestützte Dropshipping-Automatisierung

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**DropchipAI** ist eine revolutionäre KI-gestützte Dropshipping-Automatisierungslösung, die E-Commerce-Prozesse über Plattformen wie Shopify und eBay optimiert. Das System kombiniert künstliche Intelligenz mit E-Commerce-Automatisierung, um den zeitaufwändigen Prozess des Produktfindens, Listens und Verkaufens zu vereinfachen und zu optimieren.

## Hauptfunktionen

### KI-gestützte Features
- **Automatisierte Produktrecherche**: Identifizierung rentabler Produkte durch Marktanalyse und Google Trends
- **Intelligente Lieferantenbewertung**: Bewertung und Scoring von Lieferanten basierend auf Preis, Qualität und Lieferzeit
- **Content-Erstellung mit KI**: Automatische Generierung von SEO-optimierten Produktbeschreibungen

### Multi-Platform Integration
- **Shopify-Integration**: Vollautomatisches Produktlisting und Inventory-Management
- **eBay-Integration**: Automatisches Auktions-/Sofortkauf-Listing mit Kategorie-Optimierung
- **Erweiterbar**: Einfache Integration weiterer Plattformen

### Business Intelligence
- **Preisoptimierung**: Konkurrenzanalyse und dynamische Preisanpassung
- **Gewinnmargen-Analyse**: Automatische Berechnung optimaler Verkaufspreise
- **Trend-Analyse**: Identifikation von Trending-Produkten mit hohem Verkaufspotenzial

### Vollautomatisierung
- **End-to-End Workflow**: Von der Produktrecherche bis zum Listing
- **Fehlerbehandlung**: Robuste Fehlerbehandlung und Logging
- **Performance-Monitoring**: Überwachung und Optimierung der Systemleistung

## ️ Architektur

### Backend (Python)
```
backend/
 src/
 ai/ # KI-Module
 product_research.py # Produktrecherche mit Google Trends
 supplier_scorer.py # Lieferantenbewertung
 listing_generator.py # Content-Generierung
 api/ # API-Integrationen
 shopify/ # Shopify API-Connector
 ebay/ # eBay API-Connector
 core/ # Kernkomponenten
 DropchipCore.py # Hauptlogik
 automation.py # Automatisierungsmanager
 config_manager.py # Konfigurationsverwaltung
 utils/ # Hilfsfunktionen
 logger.py # Logging-System
 data_loader.py # Datenverarbeitung
 config/ # Konfigurationsdateien
 main.py # Haupteinstiegspunkt
 requirements.txt # Python-Dependencies
```

### Frontend (React)
```
frontend/
 components/ # React-Komponenten
 Dashboard.js # Haupt-Dashboard
 StockMonitor.js # Lagerbestandsüberwachung
 WorkflowAutomation.js # Workflow-Management
 contexts/ # React-Kontexte
 pages/ # Anwendungsseiten
 services/ # API-Services
 package.json # Node.js-Dependencies
```

## Schnellstart

### 1. Installation

```bash
# Repository entpacken
unzip DropchipAI.zip
cd DropchipAI

# Backend-Dependencies installieren
cd backend
pip install -r requirements.txt

# Frontend-Dependencies installieren (optional)
cd ../frontend
npm install
```

### 2. Konfiguration

```bash
# Konfigurationsdateien kopieren
cd backend
cp config/credentials.yaml.example config/credentials.yaml
cp config/settings.yaml.example config/settings.yaml
```

Bearbeiten Sie `config/credentials.yaml` und fügen Sie Ihre API-Schlüssel hinzu:

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
  sandbox_mode: true
```

### 3. Erste Ausführung

```bash
# Backend starten
cd backend
python main.py --keywords "Smart Watch" "Wireless Earbuds" --log-level INFO

# Frontend starten (optional)
cd frontend
npm start
```

## Verwendungsbeispiele

### Grundlegende Produktrecherche

```bash
python main.py --keywords "Smartphone Hülle" "Bluetooth Kopfhörer"
```

### Erweiterte Konfiguration

```bash
python main.py \
  --keywords "Fitness Tracker" "Gaming Maus" \
  --log-level DEBUG \
  --config /pfad/zu/ihrer/config.yaml
```

### Programmgesteuerte Verwendung

```python
from src.core.DropchipCore import DropchipCore

# DropchipCore initialisieren
core = DropchipCore()

# Vollautomatisierung starten
keywords = ["Smart Watch", "Wireless Earbuds"]
processed_count = core.full_automation(keywords)

print(f"Verarbeitete Produkte: {processed_count}")
```

## Konfiguration

### Einstellungen (`config/settings.yaml`)

```yaml
ai:
  min_profit_margin: 0.3      # 30% Mindestgewinnmarge
  min_trend_score: 70         # Mindest-Trend-Score (0-100)
  default_language: de        # Sprache für Content-Generierung

automation:
  auto_create_listings: false # Automatisches Erstellen von Listings
  auto_update_prices: false   # Automatische Preisanpassung
  price_update_interval: 24   # Stunden zwischen Preisupdates
```

### API-Anmeldeinformationen (`config/credentials.yaml`)

```yaml
shopify:
  shop_url: "ihr-shop.myshopify.com"
  api_key: "ihr_api_key"
  password: "ihr_password"

ebay:
  app_id: "ihre_app_id"
  cert_id: "ihre_cert_id"
  dev_id: "ihre_dev_id"
  auth_token: "ihr_auth_token"
  sandbox_mode: true  # false für Produktion

google:
  api_key: "ihr_google_api_key"  # Für Google Trends
```

## Features im Detail

### 1. Produktrecherche

Das KI-System analysiert:
- **Google Trends**: Identifikation von Trending-Produkten
- **Marktanalyse**: Bewertung der Nachfrage und des Wettbewerbs
- **Profitabilitätsanalyse**: Berechnung von Gewinnmargen

```python
from src.ai.product_research import ProductResearch

research = ProductResearch()
results = research.full_product_research(["Smart Watch", "Fitness Tracker"])
```

### 2. Lieferantenbewertung

Intelligente Bewertung basierend auf:
- **Preis-Leistungs-Verhältnis** (40% Gewichtung)
- **Lieferantenbewertung** (30% Gewichtung)
- **Lieferzeit** (30% Gewichtung)

```python
from src.ai.supplier_scorer import SupplierScorer

scorer = SupplierScorer()
best_supplier = scorer.find_best_supplier(product_data)
```

### 3. Content-Generierung

Automatische Erstellung von:
- **SEO-optimierte Produkttitel**
- **Detaillierte Produktbeschreibungen**
- **Plattform-spezifische Listings** (Shopify, eBay)

```python
from src.ai.listing_generator import ListingGenerator

generator = ListingGenerator()
listing = generator.generate_listing(product_data, platform='shopify')
```

## API-Integrationen

### Shopify API

```python
from src.api.shopify.connector import ShopifyManager

shopify = ShopifyManager()

# Produkt erstellen
product_data = {
    'title': 'Smart Watch Premium',
    'description': 'Hochwertige Smart Watch...',
    'price': 49.99,
    'images': ['https://example.com/image.jpg']
}

created_product = shopify.create_product(product_data)
```

### eBay API

```python
from src.api.ebay.connector import EbayManager

ebay = EbayManager()

# Artikel listen
item_data = {
    'title': 'Smart Watch Premium',
    'description': 'Hochwertige Smart Watch...',
    'price': '49.99',
    'category_id': '9355'
}

listed_item = ebay.list_item(item_data)
```

## Monitoring und Logging

### Log-System

```python
from src.utils.logger import Logger

logger = Logger(log_level='INFO')
logger.info("Produktrecherche gestartet")
logger.error("API-Fehler aufgetreten")
```

### Performance-Monitoring

- **Automatische Log-Rotation**: Tägliche Log-Dateien
- **Fehlerbehandlung**: Robuste Fehlerbehandlung mit detailliertem Logging
- **API-Rate-Limiting**: Automatische Behandlung von API-Limits

## ️ Sicherheit und Best Practices

### Sicherheitsfeatures

- **API-Schlüssel-Verschlüsselung**: Sichere Speicherung von Anmeldeinformationen
- **Rate-Limiting**: Schutz vor API-Überlastung
- **Fehlerbehandlung**: Graceful Handling von API-Fehlern
- **Sandbox-Modus**: Sicheres Testen ohne Live-Daten

### Best Practices

1. **Verwenden Sie den Sandbox-Modus** für Tests
2. **Überwachen Sie API-Limits** regelmäßig
3. **Erstellen Sie Backups** Ihrer Konfigurationen
4. **Testen Sie neue Keywords** in kleinen Batches
5. **Überwachen Sie die Logs** auf Fehler

## Erweiterte Funktionen

### Batch-Verarbeitung

```python
# Mehrere Keywords gleichzeitig verarbeiten
keywords = ["Smart Watch", "Fitness Tracker", "Wireless Earbuds", "Phone Case"]
core = DropchipCore()
results = core.full_automation(keywords)
```

### Custom Templates

```python
# Eigene Listing-Templates erstellen
from jinja2 import Template

custom_template = Template("""
<h1>{{ product_name }}</h1>
<p>{{ description }}</p>
<ul>
{% for feature in features %}
    <li>{{ feature }}</li>
{% endfor %}
</ul>
""")

generator = ListingGenerator()
generator.shopify_template = custom_template
```

### Webhook-Integration

```python
# Webhook für automatische Benachrichtigungen
webhook_config = {
    'url': 'https://ihr-webhook.com/notify',
    'events': ['product_created', 'order_received']
}
```

## Dokumentation

- **[Installation](INSTALLATION.md)**: Detaillierte Installationsanleitung
- **[API-Dokumentation](docs/API.md)**: Vollständige API-Referenz
- **[Konfiguration](docs/CONFIGURATION.md)**: Erweiterte Konfigurationsoptionen
- **[Troubleshooting](docs/TROUBLESHOOTING.md)**: Fehlerbehebung und FAQ

## Beitragen

Wir freuen uns über Beiträge! Bitte lesen Sie unsere [Contribution Guidelines](CONTRIBUTING.md) für Details.

### Entwicklung

```bash
# Entwicklungsumgebung einrichten
git clone https://github.com/ihr-username/DropchipAI.git
cd DropchipAI

# Virtual Environment erstellen
python -m venv venv
source venv/bin/activate  # Linux/Mac
# oder
venv\Scripts\activate     # Windows

# Dependencies installieren
pip install -r backend/requirements.txt
pip install -r backend/requirements-dev.txt
```

### Tests ausführen

```bash
# Backend-Tests
cd backend
python -m pytest tests/

# Frontend-Tests
cd frontend
npm test
```

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) für Details.

## Danksagungen

- **Shopify API**: Für die umfassende E-Commerce-Integration
- **eBay API**: Für die Marktplatz-Integration
- **Google Trends**: Für die Trend-Analyse
- **React**: Für das moderne Frontend-Framework
- **Python Community**: Für die exzellenten Bibliotheken

## Support

### Community

- **GitHub Issues**: [Probleme melden](https://github.com/ihr-username/DropchipAI/issues)
- **Discussions**: [Community-Diskussionen](https://github.com/ihr-username/DropchipAI/discussions)

### Kommerzielle Unterstützung

Für kommerzielle Unterstützung und Enterprise-Features kontaktieren Sie uns unter:
- **E-Mail**: support@dropchipai.com
- **Website**: https://dropchipai.com

---

**Entwickelt mit ️ für die E-Commerce-Community**

*DropchipAI - Automatisieren Sie Ihr Dropshipping-Business mit der Kraft der KI!*

