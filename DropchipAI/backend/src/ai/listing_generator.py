"""
DropchipAi Listing Generator Module

Dieses Modul implementiert die KI-gestützte Erstellung von Produktbeschreibungen für die DropchipAi-Anwendung.
"""

import pandas as pd
import numpy as np
from pathlib import Path
import sys
import re
import json
from jinja2 import Template

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.core.config_manager import ConfigManager
from src.utils.logger import Logger

class ListingGenerator:
    """
    Klasse für die KI-gestützte Erstellung von Produktbeschreibungen.
    """
    
    def __init__(self, config_manager=None, logger=None):
        """
        Initialisiert die ListingGenerator-Klasse.
        
        Args:
            config_manager (ConfigManager, optional): Konfigurationsmanager-Instanz
            logger (Logger, optional): Logger-Instanz
        """
        if config_manager is None:
            self.config_manager = ConfigManager()
        else:
            self.config_manager = config_manager
            
        if logger is None:
            self.logger = Logger(log_level='INFO')
        else:
            self.logger = logger
        
        # Lade Einstellungen
        self.default_language = self.config_manager.get_setting('ai', 'default_language', 'de')
        
        # Initialisiere Templates
        self._init_templates()
        
        self.logger.info("ListingGenerator initialisiert")
    
    def _init_templates(self):
        """Initialisiert die Templates für verschiedene Plattformen und Sprachen."""
        # Allgemeines Template für Produktbeschreibungen
        self.general_template = Template("""
{{ product_name }}

🔥 HIGHLIGHTS:
{% for feature in features %}
✅ {{ feature }}
{% endfor %}

📝 BESCHREIBUNG:
{{ description }}

🔍 PRODUKTDETAILS:
{% for key, value in specifications.items() %}
• {{ key|capitalize }}: {{ value }}
{% endfor %}

⭐ Warum bei uns kaufen?
• Schneller Versand innerhalb von {{ delivery_days }} Tagen
• 30 Tage Geld-zurück-Garantie
• Hervorragender Kundenservice

🛒 Jetzt bestellen und von unseren Sonderangeboten profitieren!
        """)
        
        # Shopify-spezifisches Template
        self.shopify_template = Template("""
<h1>{{ product_name }}</h1>

<div class="highlights">
    <h3>🔥 HIGHLIGHTS:</h3>
    <ul>
    {% for feature in features %}
        <li>✅ {{ feature }}</li>
    {% endfor %}
    </ul>
</div>

<div class="description">
    <h3>📝 BESCHREIBUNG:</h3>
    <p>{{ description }}</p>
</div>

<div class="specifications">
    <h3>🔍 PRODUKTDETAILS:</h3>
    <ul>
    {% for key, value in specifications.items() %}
        <li><strong>{{ key|capitalize }}:</strong> {{ value }}</li>
    {% endfor %}
    </ul>
</div>

<div class="benefits">
    <h3>⭐ Warum bei uns kaufen?</h3>
    <ul>
        <li>Schneller Versand innerhalb von {{ delivery_days }} Tagen</li>
        <li>30 Tage Geld-zurück-Garantie</li>
        <li>Hervorragender Kundenservice</li>
    </ul>
</div>

<div class="cta">
    <p><strong>🛒 Jetzt bestellen und von unseren Sonderangeboten profitieren!</strong></p>
</div>
        """)
        
        # eBay-spezifisches Template
        self.ebay_template = Template("""
<h1>{{ product_name }}</h1>

<h3>🔥 HIGHLIGHTS:</h3>
<ul>
{% for feature in features %}
    <li>✅ {{ feature }}</li>
{% endfor %}
</ul>

<h3>📝 BESCHREIBUNG:</h3>
<p>{{ description }}</p>

<h3>🔍 PRODUKTDETAILS:</h3>
<ul>
{% for key, value in specifications.items() %}
    <li><strong>{{ key|capitalize }}:</strong> {{ value }}</li>
{% endfor %}
</ul>

<h3>⭐ Warum bei uns kaufen?</h3>
<ul>
    <li>Schneller Versand innerhalb von {{ delivery_days }} Tagen</li>
    <li>30 Tage Geld-zurück-Garantie</li>
    <li>Hervorragender Kundenservice</li>
</ul>

<p><strong>🛒 Jetzt bestellen und von unseren Sonderangeboten profitieren!</strong></p>

<p>Artikelnummer: {{ sku }}</p>
        """)
    
    def generate_listing(self, product, platform=None, language=None):
        """
        Generiert eine Produktbeschreibung basierend auf Produktdaten.
        
        Args:
            product (dict): Produktdaten
            platform (str, optional): Zielplattform ('shopify', 'ebay', oder None für allgemein)
            language (str, optional): Sprache der Beschreibung (ISO-Code, z.B. 'de', 'en')
            
        Returns:
            dict: Generierte Produktbeschreibung und Metadaten
        """
        if language is None:
            language = self.default_language
            
        self.logger.info(f"Generiere Produktbeschreibung für: {product.get('product_name', product.get('keyword', 'Unbekannt'))}")
        
        try:
            # Extrahiere benötigte Daten aus dem Produkt
            product_name = product.get('product_name', product.get('keyword', 'Unbekanntes Produkt'))
            
            # Verwende Produktdetails, falls vorhanden
            details = product.get('details', {})
            
            description = details.get('description', f"Hochwertiges {product_name} mit erstklassigen Funktionen.")
            features = details.get('features', [
                f"Premium {product_name}-Qualität",
                "Langlebiges Material",
                "Einfache Handhabung",
                "Modernes Design"
            ])
            specifications = details.get('specifications', {
                'material': 'Hochwertige Materialien',
                'weight': 'Leichtgewicht',
                'dimensions': 'Kompakte Größe'
            })
            
            # Lieferzeit aus dem besten Lieferanten ermitteln
            delivery_days = 7  # Standardwert
            if 'suppliers' in product and product['suppliers']:
                best_supplier = sorted(product['suppliers'], key=lambda s: s.get('total_score', 0), reverse=True)[0]
                delivery_days = best_supplier.get('delivery_days', 7)
            
            # Generiere SKU (Stock Keeping Unit)
            sku = f"DP-{re.sub(r'[^a-zA-Z0-9]', '', product_name)[:10]}-{np.random.randint(1000, 9999)}"
            
            # Bereite Template-Kontext vor
            context = {
                'product_name': product_name,
                'description': description,
                'features': features,
                'specifications': specifications,
                'delivery_days': delivery_days,
                'sku': sku,
                'trend_score': product.get('trend_score', 'N/A'),
                'profit_margin': product.get('profit_margin', 'N/A')
            }
            
            # Wähle das passende Template basierend auf der Plattform
            if platform == 'shopify':
                template = self.shopify_template
            elif platform == 'ebay':
                template = self.ebay_template
            else:
                template = self.general_template
                
            # Rendere das Template
            description_html = template.render(**context)
            
            # Erstelle das Ergebnis
            result = {
                'title': product_name,
                'description': description_html,
                'price': self._calculate_optimal_price(product),
                'sku': sku,
                'images': details.get('images', []),
                'tags': self._generate_tags(product),
                'platform': platform,
                'language': language
            }
            
            self.logger.info(f"Produktbeschreibung generiert für: {product_name}")
            return result
            
        except Exception as e:
            self.logger.error(f"Fehler bei der Generierung der Produktbeschreibung: {e}")
            return {
                'title': product.get('product_name', 'Fehler'),
                'description': 'Fehler bei der Generierung der Produktbeschreibung.',
                'price': 0,
                'sku': 'ERROR',
                'images': [],
                'tags': [],
                'platform': platform,
                'language': language
            }
    
    def _calculate_optimal_price(self, product):
        """
        Berechnet den optimalen Verkaufspreis für ein Produkt.
        
        Args:
            product (dict): Produktdaten
            
        Returns:
            float: Optimaler Verkaufspreis
        """
        # Verwende den Marktpreis, falls vorhanden
        if 'market_price' in product:
            return round(product['market_price'], 2)
            
        # Berechne den Preis basierend auf dem Lieferantenpreis und der Gewinnmarge
        supplier_price = product.get('supplier_price', 0)
        
        if 'suppliers' in product and product['suppliers']:
            # Verwende den Preis des besten Lieferanten
            best_supplier = sorted(product['suppliers'], key=lambda s: s.get('total_score', 0), reverse=True)[0]
            supplier_price = best_supplier.get('price', supplier_price)
        
        # Zielgewinnmarge (z.B. 40%)
        target_margin = 0.4
        
        # Berechne den Verkaufspreis
        if supplier_price > 0:
            price = supplier_price / (1 - target_margin)
            
            # Runde auf "attraktive" Preise (z.B. 19.99 statt 20.12)
            price = round(price * 0.99, 2)
            
            # Stelle sicher, dass der Preis mindestens 20% über dem Lieferantenpreis liegt
            min_price = supplier_price * 1.2
            price = max(price, min_price)
            
            return round(price, 2)
        else:
            return 0
    
    def _generate_tags(self, product):
        """
        Generiert Tags für ein Produkt.
        
        Args:
            product (dict): Produktdaten
            
        Returns:
            list: Generierte Tags
        """
        tags = []
        
        # Füge Keyword als Tag hinzu
        keyword = product.get('keyword', '')
        if keyword:
            tags.append(keyword)
            
            # Füge einzelne Wörter als Tags hinzu
            for word in keyword.split():
                if len(word) > 3 and word not in tags:  # Ignoriere kurze Wörter
                    tags.append(word)
        
        # Füge Kategorien als Tags hinzu
        if 'details' in product and 'specifications' in product['details']:
            for key, value in product['details']['specifications'].items():
                if isinstance(value, str) and len(value) > 3:
                    tags.append(value)
        
        # Füge trendige Tags hinzu
        trendy_tags = ['Premium', 'Qualität', 'Neu', 'Bestseller']
        tags.extend(trendy_tags)
        
        # Entferne Duplikate und sortiere
        unique_tags = list(set(tags))
        
        return unique_tags
    
    def generate_bulk_listings(self, products, platform=None, language=None):
        """
        Generiert Produktbeschreibungen für mehrere Produkte.
        
        Args:
            products (list): Liste von Produktdaten
            platform (str, optional): Zielplattform
            language (str, optional): Sprache der Beschreibungen
            
        Returns:
            list: Generierte Produktbeschreibungen
        """
        self.logger.info(f"Generiere Bulk-Listings für {len(products)} Produkte")
        
        listings = []
        
        for product in products:
            listing = self.generate_listing(product, platform, language)
            listings.append(listing)
            
        self.logger.info(f"Bulk-Listings generiert: {len(listings)} Listings")
        return listings
    
    def export_listings(self, listings, format='json', output_file=None):
        """
        Exportiert generierte Listings in verschiedenen Formaten.
        
        Args:
            listings (list): Generierte Produktbeschreibungen
            format (str): Exportformat ('json', 'csv', 'html')
            output_file (str, optional): Pfad zur Ausgabedatei
            
        Returns:
            str: Pfad zur Ausgabedatei oder exportierte Daten als String
        """
        self.logger.info(f"Exportiere {len(listings)} Listings im Format {format}")
        
        try:
            if format == 'json':
                output = json.dumps(listings, indent=2)
                
                if output_file:
                    with open(output_file, 'w') as f:
                        f.write(output)
                    return output_file
                else:
                    return output
                    
            elif format == 'csv':
                # Konvertiere Listings in ein flaches Format für CSV
                flat_listings = []
                for listing in listings:
                    flat_listing = {
                        'title': listing['title'],
                        'price': listing['price'],
                        'sku': listing['sku'],
                        'platform': listing['platform'],
                        'language': listing['language'],
                        'tags': ','.join(listing['tags']),
                        'images': ','.join(listing['images'])
                    }
                    flat_listings.append(flat_listing)
                
                df = pd.DataFrame(flat_listings)
                
                if output_file:
                    df.to_csv(output_file, index=False)
                    return output_file
                else:
                    return df.to_csv(index=False)
                    
            elif format == 'html':
                # Erstelle eine einfache HTML-Seite mit allen Listings
                html = "<html><head><title>DropchipAi Listings</title></head><body>"
                
                for listing in listings:
                    html += f"<div class='listing'>"
                    html += f"<h2>{listing['title']}</h2>"
                    html += f"<p>Preis: {listing['price']}</p>"
                    html += f"<div>{listing['description']}</div>"
                    html += f"</div><hr>"
                
                html += "</body></html>"
                
                if output_file:
                    with open(output_file, 'w') as f:
                        f.write(html)
                    return output_file
                else:
                    return html
            else:
                self.logger.error(f"Unbekanntes Exportformat: {format}")
                return None
                
        except Exception as e:
            self.logger.error(f"Fehler beim Exportieren der Listings: {e}")
            return None


if __name__ == "__main__":
    # Beispiel für die Verwendung
    generator = ListingGenerator()
    
    # Beispielprodukt
    product = {
        'product_name': 'Smart Watch - Premium Qualität',
        'keyword': 'Smart Watch',
        'trend_score': 85,
        'profit_margin': 0.45,
        'supplier_price': 25.99,
        'market_price': 49.99,
        'suppliers': [
            {'name': 'Supplier-A', 'price': 22.99, 'rating': 4.2, 'delivery_days': 7, 'total_score': 85},
            {'name': 'Supplier-B', 'price': 24.99, 'rating': 4.7, 'delivery_days': 5, 'total_score': 92},
            {'name': 'Supplier-C', 'price': 19.99, 'rating': 3.8, 'delivery_days': 12, 'total_score': 78}
        ],
        'details': {
            'description': 'Diese hochwertige Smart Watch bietet zahlreiche Funktionen für Fitness und Alltag. Mit elegantem Design und robuster Verarbeitung ist sie der perfekte Begleiter für jeden Tag.',
            'features': [
                'Fitness-Tracking mit Herzfrequenzmessung',
                'Wasserdicht bis 50m',
                'Benachrichtigungen für Anrufe und Nachrichten',
                'Lange Akkulaufzeit von bis zu 7 Tagen'
            ],
            'specifications': {
                'material': 'Aluminium & Silikon',
                'weight': '45g',
                'dimensions': '44 x 38 x 10.7 mm',
                'battery': '300mAh'
            },
            'images': [
                'https://example.com/images/smart_watch_1.jpg',
                'https://example.com/images/smart_watch_2.jpg'
            ]
        }
    }
    
    # Generiere Listings für verschiedene Plattformen
    print("Generiere Listings für verschiedene Plattformen:")
    
    # Allgemeines Listing
    general_listing = generator.generate_listing(product)
    print(f"\nAllgemeines Listing:")
    print(f"Titel: {general_listing['title']}")
    print(f"Preis: ${general_listing['price']}")
    print(f"SKU: {general_listing['sku']}")
    
    # Shopify Listing
    shopify_listing = generator.generate_listing(product, platform='shopify')
    print(f"\nShopify Listing:")
    print(f"Titel: {shopify_listing['title']}")
    print(f"Preis: ${shopify_listing['price']}")
    
    # eBay Listing
    ebay_listing = generator.generate_listing(product, platform='ebay')
    print(f"\neBay Listing:")
    print(f"Titel: {ebay_listing['title']}")
    print(f"Preis: ${ebay_listing['price']}")
    
    # Exportiere Listings
    listings = [general_listing, shopify_listing, ebay_listing]
    json_export = generator.export_listings(listings, format='json')
    print(f"\nJSON Export (erste 200 Zeichen):")
    print(json_export[:200] + "...")