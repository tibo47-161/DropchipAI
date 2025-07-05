# DropchipAi Technische Dokumentation

## Systemarchitektur

DropchipAi ist als moderne Webanwendung mit einer klaren Trennung zwischen Frontend und Backend konzipiert. Diese Architektur ermöglicht eine flexible Entwicklung, einfache Wartung und gute Skalierbarkeit.

### Architekturübersicht

```
+------------------+        +------------------+        +------------------+
|                  |        |                  |        |                  |
|     Frontend     |<------>|      API        |<------>|     Backend      |
|    (React.js)    |        |    Services     |        |    (Python)      |
|                  |        |                  |        |                  |
+------------------+        +------------------+        +------------------+
                                                               |
                                                               v
                                                        +------------------+
                                                        |                  |
                                                        |  Externe APIs    |
                                                        | (Shopify, eBay)  |
                                                        |                  |
                                                        +------------------+
```

## Frontend-Architektur

Das Frontend ist mit React.js implementiert und verwendet moderne Praktiken für eine optimale Benutzererfahrung.

### Komponenten-Hierarchie

```
App.js
├── AuthContext.js (Authentifizierungszustand)
├── SubscriptionContext.js (Abonnementzustand)
├── ThemeContext.js (Themenzustand)
│
├── AuthLayout.js (Layout für nicht authentifizierte Benutzer)
│   ├── Login.js
│   ├── Register.js
│   └── ForgotPassword.js
│
└── MainLayout.js (Layout für authentifizierte Benutzer)
    ├── Dashboard.js (Hauptdashboard)
    ├── WorkflowAutomation.js (Workflow-Automatisierung)
    ├── StockMonitor.js (Bestandsüberwachung)
    ├── Subscription.js (Abonnementverwaltung)
    ├── bulk_lister.jsx (Bulk-Listing-Tool)
    └── product_research.jsx (Produktrecherche-Tool)
```

### Zustandsverwaltung

Die Anwendung verwendet React Context API für die globale Zustandsverwaltung:

1. **AuthContext**: Verwaltet den Authentifizierungszustand (Benutzeranmeldung, Abmeldung, Token-Verwaltung)
2. **SubscriptionContext**: Verwaltet Abonnementinformationen und Token-Nutzung
3. **ThemeContext**: Verwaltet das Erscheinungsbild (Hell/Dunkel-Modus)

### API-Integration

Die Kommunikation mit dem Backend erfolgt über den API-Service (api.js), der folgende Funktionen bereitstellt:

- Authentifizierungsanfragen (Login, Registrierung, Passwort zurücksetzen)
- Datenabfragen (Dashboard-Statistiken, Produktdaten, Lieferanteninformationen)
- Datenmanipulation (Produkte erstellen, aktualisieren, löschen)
- Workflow-Management (Workflows erstellen, ausführen, überwachen)

## Backend-Architektur

Das Backend ist in Python implementiert und folgt einer modularen Struktur für bessere Wartbarkeit und Erweiterbarkeit.

### Modulstruktur

```
main.py (Haupteinstiegspunkt)
│
├── src/core/
│   ├── automation.py (Automatisierungsmanager)
│   └── config_manager.py (Konfigurationsmanager)
│
├── src/utils/
│   ├── logger.py (Logging-Funktionalität)
│   └── data_loader.py (Datenlader)
│
├── src/api/
│   ├── shopify/
│   │   ├── __init__.py
│   │   └── connector.py (Shopify-API-Integration)
│   │
│   └── ebay/
│       ├── __init__.py
│       └── connector.py (eBay-API-Integration)
│
└── src/ai/
    ├── product_research.py (Produktrecherche)
    ├── supplier_scorer.py (Lieferantenbewertung)
    └── listing_generator.py (Listing-Generator)
```

### Kernkomponenten

#### DropchipCore

Die Hauptklasse, die alle Komponenten des Systems integriert und die Hauptfunktionalität bereitstellt:

```python
class DropchipCore:
    def __init__(self):
        # Initialisierung der Komponenten
        self.product_research = None
        self.supplier_scorer = None
        self.listing_gen = None
        self.shopify = None
        self.ebay = None
        self.price_comp = None
        self.trends = None
    
    def full_automation(self, keywords):
        # Vollständige Automatisierung des Dropshipping-Prozesses
        # ...
    
    def research_products(self, keywords):
        # Produktrecherche basierend auf Keywords
        # ...
    
    def optimize_prices(self, products):
        # Preisoptimierung für Produkte
        # ...
```

#### AutomationManager

Verwaltet die Automatisierungsabläufe für verschiedene Dropshipping-Prozesse:

```python
class AutomationManager:
    def __init__(self):
        self.active_jobs = []
        self.job_history = []
    
    def schedule_job(self, job_type, parameters=None):
        # Plant einen neuen Automatisierungsjob
        # ...
    
    def execute_all_jobs(self):
        # Führt alle geplanten Jobs aus
        # ...
```

#### ConfigManager

Verwaltet die Konfiguration des Systems:

```python
class ConfigManager:
    def __init__(self, config_path=None):
        # Lädt die Konfiguration aus einer Datei
        # ...
    
    def get_config(self, section, key=None):
        # Gibt Konfigurationswerte zurück
        # ...
```

### KI-Module

#### ProductResearch

Identifiziert profitable Produkte durch Marktanalyse und Trendforschung:

```python
class ProductResearch:
    def __init__(self):
        # Initialisierung
        # ...
    
    def find_trending_products(self, keywords):
        # Findet trendige Produkte basierend auf Keywords
        # ...
    
    def find_profitable_products(self, products):
        # Bewertet die Profitabilität von Produkten
        # ...
```

#### SupplierScorer

Bewertet und wählt die besten Lieferanten für Produkte aus:

```python
class SupplierScorer:
    def __init__(self):
        # Initialisierung
        # ...
    
    def score_suppliers(self, product):
        # Bewertet Lieferanten für ein Produkt
        # ...
    
    def find_best_supplier(self, product):
        # Findet den besten Lieferanten für ein Produkt
        # ...
```

#### ListingGenerator

Generiert automatisch Produktbeschreibungen und Listings:

```python
class ListingGenerator:
    def __init__(self):
        # Initialisierung
        # ...
    
    def generate_listing(self, product, platform='shopify'):
        # Generiert ein Listing für ein Produkt
        # ...
```

### API-Integrationen

#### ShopifyManager

Verwaltet die Integration mit der Shopify-API:

```python
class ShopifyManager:
    def __init__(self):
        # Initialisierung mit API-Schlüsseln
        # ...
    
    def create_product(self, product_data):
        # Erstellt ein Produkt in Shopify
        # ...
```

#### EbayManager

Verwaltet die Integration mit der eBay-API:

```python
class EbayManager:
    def __init__(self):
        # Initialisierung mit API-Schlüsseln
        # ...
    
    def list_item(self, item_data):
        # Listet einen Artikel auf eBay
        # ...
```

## Datenfluss

### Produktrecherche-Workflow

1. Benutzer gibt Keywords für die Produktrecherche ein
2. ProductResearch-Modul analysiert Trends und Marktdaten
3. Ergebnisse werden nach Profitabilität und Trendwert sortiert
4. Benutzer wählt vielversprechende Produkte aus

### Lieferantenbewertungs-Workflow

1. Für jedes ausgewählte Produkt werden potenzielle Lieferanten identifiziert
2. SupplierScorer-Modul bewertet Lieferanten nach verschiedenen Kriterien
3. Lieferanten werden nach Gesamtbewertung sortiert
4. Bester Lieferant wird automatisch ausgewählt oder vom Benutzer manuell gewählt

### Listing-Erstellungs-Workflow

1. Für jedes Produkt mit ausgewähltem Lieferanten wird ein Listing generiert
2. ListingGenerator-Modul erstellt plattformspezifische Listings
3. Listings werden auf Shopify und/oder eBay veröffentlicht
4. Bestandsüberwachung beginnt für veröffentlichte Produkte

## Technische Anforderungen

### Systemanforderungen

- **Backend**: Python 3.8 oder höher
- **Frontend**: Node.js 14 oder höher, npm 6 oder höher
- **Datenbank**: PostgreSQL 12 oder höher (für Produktionsumgebung)

### Abhängigkeiten

#### Backend-Abhängigkeiten

Siehe `requirements.txt` für eine vollständige Liste der Python-Abhängigkeiten.

Hauptabhängigkeiten:
- pandas: Datenverarbeitung und -analyse
- numpy: Numerische Berechnungen
- shopifyapi: Shopify API-Integration
- ebaysdk: eBay API-Integration
- pytrends: Google Trends API-Integration
- jinja2: Template-Engine für Listing-Generierung
- pyyaml: YAML-Dateiverarbeitung
- requests: HTTP-Anfragen

#### Frontend-Abhängigkeiten

Hauptabhängigkeiten:
- react: UI-Bibliothek
- react-dom: DOM-Rendering für React
- react-router-dom: Routing für React
- recharts: Datenvisualisierung
- axios: HTTP-Client für API-Anfragen
- tailwindcss: Utility-First CSS-Framework

## Deployment

### Entwicklungsumgebung

1. Backend starten:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

2. Frontend starten:
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Produktionsumgebung

Für die Produktionsumgebung wird eine Bereitstellung auf AWS empfohlen:

1. **Backend**: Containerisiert mit Docker, bereitgestellt auf AWS ECS oder Kubernetes
2. **Frontend**: Statische Dateien auf AWS S3 mit CloudFront als CDN
3. **Datenbank**: AWS RDS für PostgreSQL
4. **Caching**: AWS ElastiCache (Redis)
5. **Sicherheit**: AWS WAF, AWS Shield, AWS Secrets Manager

## Sicherheitsüberlegungen

1. **Authentifizierung**: OAuth 2.0 mit JWT für API-Zugriff
2. **Datenverschlüsselung**: AES-256 für Daten im Ruhezustand, TLS 1.3 für Daten während der Übertragung
3. **API-Schlüssel-Verwaltung**: Sichere Speicherung von API-Schlüsseln in AWS Secrets Manager
4. **Berechtigungsverwaltung**: Rollenbasierte Zugriffskontrolle für Multi-User-Zugriff
5. **Sicherheitsaudits**: Regelmäßige Penetrationstests und Schwachstellenbewertungen

## Leistungsoptimierung

1. **Caching**: Implementierung von Redis für häufig abgefragte Daten
2. **Datenbankindizierung**: Optimierte Indizes für häufige Abfragen
3. **Lazy Loading**: Verzögertes Laden von Komponenten und Daten im Frontend
4. **Code-Splitting**: Aufteilung des Frontend-Codes für schnelleres Laden
5. **CDN**: Verwendung von CloudFront für statische Assets

## Testabdeckung

Das Projekt enthält umfangreiche Tests für Backend-Komponenten:

1. **Unit-Tests**: Tests für einzelne Funktionen und Klassen
2. **Integrationstests**: Tests für die Zusammenarbeit mehrerer Komponenten
3. **API-Tests**: Tests für API-Endpunkte

Testausführung:
```bash
python -m unittest discover
```

## Erweiterbarkeit

Das System ist für einfache Erweiterbarkeit konzipiert:

1. **Neue E-Commerce-Plattformen**: Hinzufügen neuer Connector-Klassen in src/api/
2. **Neue KI-Funktionen**: Hinzufügen neuer Module in src/ai/
3. **Neue Frontend-Funktionen**: Hinzufügen neuer Komponenten und Seiten
4. **API-Erweiterungen**: Hinzufügen neuer Endpunkte für zusätzliche Funktionalität

## Bekannte Einschränkungen

1. **Preisvergleich**: Die Preisvergleichsfunktion ist noch in Entwicklung
2. **Google Trends Analyse**: Die Google Trends Analyse ist noch in Entwicklung
3. **Multi-User-Unterstützung**: Vollständige Multi-User-Funktionalität ist nur im Enterprise-Tier verfügbar
4. **API-Ratenbegrenzungen**: Externe APIs (Shopify, eBay) haben Ratenbegrenzungen, die berücksichtigt werden müssen
