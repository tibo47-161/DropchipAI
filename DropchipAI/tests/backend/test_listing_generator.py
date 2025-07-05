"""
Tests für das ListingGenerator-Modul.
"""

import unittest
import sys
from pathlib import Path
import re

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.ai.listing_generator import ListingGenerator

class TestListingGenerator(unittest.TestCase):
    """Testklasse für das ListingGenerator-Modul."""
    
    def setUp(self):
        """Wird vor jedem Test ausgeführt."""
        self.generator = ListingGenerator()
        
        # Testprodukt
        self.test_product = {
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
                'description': 'Diese hochwertige Smart Watch bietet zahlreiche Funktionen für Fitness und Alltag.',
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
    
    def test_generate_listing(self):
        """Testet die Methode generate_listing."""
        # Teste allgemeines Listing
        general_listing = self.generator.generate_listing(self.test_product)
        
        # Überprüfe, ob ein Dictionary zurückgegeben wird
        self.assertIsInstance(general_listing, dict)
        
        # Überprüfe, ob die erwarteten Schlüssel vorhanden sind
        self.assertIn('title', general_listing)
        self.assertIn('description', general_listing)
        self.assertIn('price', general_listing)
        self.assertIn('sku', general_listing)
        self.assertIn('images', general_listing)
        self.assertIn('tags', general_listing)
        
        # Überprüfe, ob der Titel dem Produktnamen entspricht
        self.assertEqual(general_listing['title'], self.test_product['product_name'])
        
        # Überprüfe, ob die Beschreibung die Features enthält
        for feature in self.test_product['details']['features']:
            self.assertIn(feature, general_listing['description'])
        
        # Überprüfe, ob der Preis größer als 0 ist
        self.assertGreater(general_listing['price'], 0)
        
        # Überprüfe, ob die SKU das erwartete Format hat
        self.assertTrue(re.match(r'DP-[A-Za-z0-9]+-\d{4}', general_listing['sku']))
        
        # Überprüfe, ob die Bilder übernommen wurden
        self.assertEqual(general_listing['images'], self.test_product['details']['images'])
    
    def test_generate_listing_for_platforms(self):
        """Testet die Methode generate_listing für verschiedene Plattformen."""
        # Teste Shopify-Listing
        shopify_listing = self.generator.generate_listing(self.test_product, platform='shopify')
        
        # Überprüfe, ob ein Dictionary zurückgegeben wird
        self.assertIsInstance(shopify_listing, dict)
        
        # Überprüfe, ob die Plattform korrekt gesetzt ist
        self.assertEqual(shopify_listing['platform'], 'shopify')
        
        # Überprüfe, ob die Beschreibung HTML-Tags enthält
        self.assertIn('<h1>', shopify_listing['description'])
        self.assertIn('<div', shopify_listing['description'])
        self.assertIn('<ul>', shopify_listing['description'])
        
        # Teste eBay-Listing
        ebay_listing = self.generator.generate_listing(self.test_product, platform='ebay')
        
        # Überprüfe, ob ein Dictionary zurückgegeben wird
        self.assertIsInstance(ebay_listing, dict)
        
        # Überprüfe, ob die Plattform korrekt gesetzt ist
        self.assertEqual(ebay_listing['platform'], 'ebay')
        
        # Überprüfe, ob die Beschreibung HTML-Tags enthält
        self.assertIn('<h1>', ebay_listing['description'])
        self.assertIn('<ul>', ebay_listing['description'])
        self.assertIn('Artikelnummer:', ebay_listing['description'])
    
    def test_calculate_optimal_price(self):
        """Testet die Methode _calculate_optimal_price."""
        # Teste mit Marktpreis
        price = self.generator._calculate_optimal_price(self.test_product)
        
        # Überprüfe, ob der Preis dem Marktpreis entspricht
        self.assertEqual(price, self.test_product['market_price'])
        
        # Teste ohne Marktpreis
        product_without_market_price = self.test_product.copy()
        del product_without_market_price['market_price']
        
        price = self.generator._calculate_optimal_price(product_without_market_price)
        
        # Überprüfe, ob der Preis größer als der Lieferantenpreis ist
        self.assertGreater(price, product_without_market_price['supplier_price'])
        
        # Überprüfe, ob der Preis mindestens 20% über dem Lieferantenpreis liegt
        self.assertGreaterEqual(price, product_without_market_price['supplier_price'] * 1.2)
    
    def test_generate_tags(self):
        """Testet die Methode _generate_tags."""
        tags = self.generator._generate_tags(self.test_product)
        
        # Überprüfe, ob eine Liste zurückgegeben wird
        self.assertIsInstance(tags, list)
        
        # Überprüfe, ob die Liste nicht leer ist
        self.assertGreater(len(tags), 0)
        
        # Überprüfe, ob das Keyword als Tag enthalten ist
        self.assertIn(self.test_product['keyword'], tags)
        
        # Überprüfe, ob keine Duplikate vorhanden sind
        self.assertEqual(len(tags), len(set(tags)))
    
    def test_generate_bulk_listings(self):
        """Testet die Methode generate_bulk_listings."""
        products = [self.test_product, self.test_product.copy()]
        
        # Ändere den Namen des zweiten Produkts
        products[1]['product_name'] = 'Wireless Earbuds - Premium Qualität'
        products[1]['keyword'] = 'Wireless Earbuds'
        
        listings = self.generator.generate_bulk_listings(products, platform='shopify')
        
        # Überprüfe, ob eine Liste zurückgegeben wird
        self.assertIsInstance(listings, list)
        
        # Überprüfe, ob die richtige Anzahl von Listings generiert wurde
        self.assertEqual(len(listings), len(products))
        
        # Überprüfe, ob die Titel den Produktnamen entsprechen
        self.assertEqual(listings[0]['title'], products[0]['product_name'])
        self.assertEqual(listings[1]['title'], products[1]['product_name'])
        
        # Überprüfe, ob die Plattform korrekt gesetzt ist
        for listing in listings:
            self.assertEqual(listing['platform'], 'shopify')
    
    def test_export_listings(self):
        """Testet die Methode export_listings."""
        # Generiere Listings
        products = [self.test_product, self.test_product.copy()]
        products[1]['product_name'] = 'Wireless Earbuds - Premium Qualität'
        products[1]['keyword'] = 'Wireless Earbuds'
        
        listings = self.generator.generate_bulk_listings(products)
        
        # Teste JSON-Export
        json_export = self.generator.export_listings(listings, format='json')
        
        # Überprüfe, ob ein String zurückgegeben wird
        self.assertIsInstance(json_export, str)
        
        # Überprüfe, ob der JSON-String die Produktnamen enthält
        self.assertIn(products[0]['product_name'], json_export)
        self.assertIn(products[1]['product_name'], json_export)
        
        # Teste CSV-Export
        csv_export = self.generator.export_listings(listings, format='csv')
        
        # Überprüfe, ob ein String zurückgegeben wird
        self.assertIsInstance(csv_export, str)
        
        # Überprüfe, ob der CSV-String die Spaltenüberschriften enthält
        self.assertIn('title,price,sku', csv_export)
        
        # Teste HTML-Export
        html_export = self.generator.export_listings(listings, format='html')
        
        # Überprüfe, ob ein String zurückgegeben wird
        self.assertIsInstance(html_export, str)
        
        # Überprüfe, ob der HTML-String die Produktnamen enthält
        self.assertIn(products[0]['product_name'], html_export)
        self.assertIn(products[1]['product_name'], html_export)


if __name__ == '__main__':
    unittest.main()
