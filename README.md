# DropchipAI

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

KI-gestützte Dropshipping-Automatisierungslösung für Shopify und eBay. Das System kombiniert Produktrecherche, Lieferantenbewertung und Content-Generierung zu einem vollautomatisierten End-to-End-Workflow.

---

## Features

**KI-Module**
- Automatisierte Produktrecherche über Google Trends und Marktanalyse
- Intelligente Lieferantenbewertung nach Preis, Qualität und Lieferzeit
- Automatische Generierung SEO-optimierter Produktbeschreibungen

**Plattform-Integrationen**
- Shopify: Vollautomatisches Produktlisting und Inventory-Management
- eBay: Automatisches Listing mit Kategorie-Optimierung
- Erweiterbar für weitere Plattformen

**Business Intelligence**
- Dynamische Preisoptimierung durch Konkurrenzanalyse
- Gewinnmargen-Berechnung
- Trend-Identifikation mit Verkaufspotenzial-Bewertung

---

## Tech Stack

| Komponente | Technologie |
|------------|-------------|
| Backend | Python 3.11+, pip |
| Frontend | React 18, Tailwind CSS |
| Containerisierung | Docker, Docker Compose |
| KI/Analyse | Google Trends API |
| E-Commerce APIs | Shopify REST API, eBay API |
| Reverse Proxy | Nginx |

---

## Projektstruktur

```
DropchipAI/
  DropchipAI/
    backend/
      src/
        ai/              # KI-Module (Produktrecherche, Bewertung, Listing)
        api/             # Shopify- und eBay-Connectors
        core/            # Hauptlogik und Automatisierungsmanager
        utils/           # Logger und Datenverarbeitung
      config/            # Konfigurationsdateien (YAML)
      main.py            # Einstiegspunkt
      requirements.txt
    frontend/
      components/        # React-Komponenten (Dashboard, StockMonitor, etc.)
      contexts/
      pages/
      services/
  docker-compose.yml
  docker-compose.prod.yml
  Dockerfile.backend
  Dockerfile.frontend
  nginx.conf
```

---

## Installation

### Voraussetzungen

- Python 3.11+
- Node.js 18+
- Docker und Docker Compose (für Container-Betrieb)

### Mit Docker (empfohlen)

```bash
git clone https://github.com/tib019/DropchipAI.git
cd DropchipAI

docker-compose up --build
```

### Manuell

```bash
# Backend
cd DropchipAI/backend
python -m venv venv
source venv/bin/activate   # Linux/Mac
# venv\Scripts\activate    # Windows
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

---

## Konfiguration

Konfigurationsdateien im Ordner `DropchipAI/backend/config/`:

```bash
cp config/credentials.yaml.example config/credentials.yaml
cp config/settings.yaml.example config/settings.yaml
```

`credentials.yaml` mit API-Schlüsseln befüllen:

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

google:
  api_key: "ihr_google_api_key"
```

Wesentliche Einstellungen in `settings.yaml`:

```yaml
ai:
  min_profit_margin: 0.3   # 30% Mindestgewinnmarge
  min_trend_score: 70      # Mindest-Trend-Score (0-100)
  default_language: de

automation:
  auto_create_listings: false
  auto_update_prices: false
  price_update_interval: 24
```

---

## Verwendung

### Backend starten

```bash
cd DropchipAI/backend
python main.py --keywords "Smart Watch" "Wireless Earbuds" --log-level INFO
```

### Frontend starten

```bash
cd DropchipAI/frontend
npm start
```

Das Dashboard ist anschließend unter `http://localhost:3000` erreichbar.

### Programmgesteuerte Verwendung

```python
from src.core.DropchipCore import DropchipCore

core = DropchipCore()
keywords = ["Smart Watch", "Wireless Earbuds"]
processed_count = core.full_automation(keywords)
print(f"Verarbeitete Produkte: {processed_count}")
```

---

## Tests

```bash
# Backend-Tests
cd DropchipAI/backend
python -m pytest tests/

# Frontend-Tests
cd DropchipAI/frontend
npm test
```

---

## Sicherheitshinweise

- Sandbox-Modus (`sandbox_mode: true`) für Tests verwenden, bevor Live-Daten genutzt werden
- API-Schlüssel niemals in das Repository einchecken
- `credentials.yaml` ist in `.gitignore` eingetragen

---

## Lizenz

MIT License - siehe [LICENSE](DropchipAI/LICENSE) für Details.

---

## Autor

**Tobias Buss**
- GitHub: [@tib019](https://github.com/tib019)
