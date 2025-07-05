"""
Tests für die Shopify-Integration.
"""

import unittest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.api.shopify.connector import ShopifyManager
from src.core.config_manager import ConfigManager

class TestShopifyManager(unittest.TestCase):
    """Testklasse für die Shopify-Integration."""
    
    def setUp(self):
        """Wird vor jedem Test ausgeführt."""
        # Mock für ConfigManager erstellen
        self.mock_config = MagicMock(spec=ConfigManager)
        self.mock_config.get_credentials.return_value = {
            'shop_url': 'test-store.myshopify.com',
            'api_key': 'test_api_key',
            'password': 'test_password'
        }
        
        # ShopifyManager mit Mock-ConfigManager initialisieren
        self.shopify = ShopifyManager(config_manager=self.mock_config)
    
    @patch('src.api.shopify.connector.requests.get')
    def test_get_products(self, mock_get):
        """Testet die Methode get_products."""
        # Mock-Antwort für requests.get
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'products': [
                {
                    'id': 1,
                    'title': 'Test Product 1',
                    'body_html': 'Test Description 1',
                    'variants': [{'price': '19.99'}]
                },
                {
                    'id': 2,
                    'title': 'Test Product 2',
                    'body_html': 'Test Description 2',
                    'variants': [{'price': '29.99'}]
                }
            ]
        }
        mock_get.return_value = mock_response
        
        # Methode aufrufen
        products = self.shopify.get_products(limit=10)
        
        # Überprüfen, ob requests.get mit den richtigen Parametern aufgerufen wurde
        mock_get.assert_called_once()
        self.assertIn('products.json?limit=10', mock_get.call_args[0][0])
        
        # Überprüfen, ob die Produkte korrekt zurückgegeben wurden
        self.assertEqual(len(products), 2)
        self.assertEqual(products[0]['id'], 1)
        self.assertEqual(products[0]['title'], 'Test Product 1')
        self.assertEqual(products[1]['id'], 2)
        self.assertEqual(products[1]['title'], 'Test Product 2')
    
    @patch('src.api.shopify.connector.requests.get')
    def test_get_product(self, mock_get):
        """Testet die Methode get_product."""
        # Mock-Antwort für requests.get
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'product': {
                'id': 1,
                'title': 'Test Product',
                'body_html': 'Test Description',
                'variants': [{'price': '19.99'}]
            }
        }
        mock_get.return_value = mock_response
        
        # Methode aufrufen
        product = self.shopify.get_product(1)
        
        # Überprüfen, ob requests.get mit den richtigen Parametern aufgerufen wurde
        mock_get.assert_called_once()
        self.assertIn('products/1.json', mock_get.call_args[0][0])
        
        # Überprüfen, ob das Produkt korrekt zurückgegeben wurde
        self.assertEqual(product['id'], 1)
        self.assertEqual(product['title'], 'Test Product')
    
    @patch('src.api.shopify.connector.requests.post')
    def test_create_product(self, mock_post):
        """Testet die Methode create_product."""
        # Mock-Antwort für requests.post
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = {
            'product': {
                'id': 1,
                'title': 'Test Product',
                'body_html': 'Test Description',
                'variants': [{'price': '19.99'}]
            }
        }
        mock_post.return_value = mock_response
        
        # Testdaten
        product_data = {
            'title': 'Test Product',
            'description': 'Test Description',
            'price': 19.99,
            'images': ['https://example.com/image.jpg']
        }
        
        # Methode aufrufen
        product = self.shopify.create_product(product_data)
        
        # Überprüfen, ob requests.post mit den richtigen Parametern aufgerufen wurde
        mock_post.assert_called_once()
        self.assertIn('products.json', mock_post.call_args[0][0])
        
        # Überprüfen, ob die richtigen Daten gesendet wurden
        sent_data = mock_post.call_args[1]['json']
        self.assertEqual(sent_data['product']['title'], 'Test Product')
        self.assertEqual(sent_data['product']['body_html'], 'Test Description')
        self.assertEqual(sent_data['product']['variants'][0]['price'], '19.99')
        
        # Überprüfen, ob das Produkt korrekt zurückgegeben wurde
        self.assertEqual(product['id'], 1)
        self.assertEqual(product['title'], 'Test Product')
    
    @patch('src.api.shopify.connector.requests.put')
    def test_update_product(self, mock_put):
        """Testet die Methode update_product."""
        # Mock-Antwort für requests.put
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'product': {
                'id': 1,
                'title': 'Updated Product',
                'body_html': 'Updated Description',
                'variants': [{'price': '29.99'}]
            }
        }
        mock_put.return_value = mock_response
        
        # Testdaten
        product_data = {
            'title': 'Updated Product',
            'description': 'Updated Description'
        }
        
        # Methode aufrufen
        product = self.shopify.update_product(1, product_data)
        
        # Überprüfen, ob requests.put mit den richtigen Parametern aufgerufen wurde
        mock_put.assert_called_once()
        self.assertIn('products/1.json', mock_put.call_args[0][0])
        
        # Überprüfen, ob die richtigen Daten gesendet wurden
        sent_data = mock_put.call_args[1]['json']
        self.assertEqual(sent_data['product']['id'], 1)
        self.assertEqual(sent_data['product']['title'], 'Updated Product')
        self.assertEqual(sent_data['product']['body_html'], 'Updated Description')
        
        # Überprüfen, ob das Produkt korrekt zurückgegeben wurde
        self.assertEqual(product['id'], 1)
        self.assertEqual(product['title'], 'Updated Product')
    
    @patch('src.api.shopify.connector.requests.delete')
    def test_delete_product(self, mock_delete):
        """Testet die Methode delete_product."""
        # Mock-Antwort für requests.delete
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_delete.return_value = mock_response
        
        # Methode aufrufen
        result = self.shopify.delete_product(1)
        
        # Überprüfen, ob requests.delete mit den richtigen Parametern aufgerufen wurde
        mock_delete.assert_called_once()
        self.assertIn('products/1.json', mock_delete.call_args[0][0])
        
        # Überprüfen, ob das Ergebnis korrekt ist
        self.assertTrue(result)
    
    @patch('src.api.shopify.connector.requests.get')
    def test_get_orders(self, mock_get):
        """Testet die Methode get_orders."""
        # Mock-Antwort für requests.get
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'orders': [
                {
                    'id': 1,
                    'order_number': 1001,
                    'total_price': '19.99',
                    'line_items': [{'product_id': 1, 'quantity': 1}]
                },
                {
                    'id': 2,
                    'order_number': 1002,
                    'total_price': '29.99',
                    'line_items': [{'product_id': 2, 'quantity': 1}]
                }
            ]
        }
        mock_get.return_value = mock_response
        
        # Methode aufrufen
        orders = self.shopify.get_orders(limit=10, status='any')
        
        # Überprüfen, ob requests.get mit den richtigen Parametern aufgerufen wurde
        mock_get.assert_called_once()
        self.assertIn('orders.json?limit=10&status=any', mock_get.call_args[0][0])
        
        # Überprüfen, ob die Bestellungen korrekt zurückgegeben wurden
        self.assertEqual(len(orders), 2)
        self.assertEqual(orders[0]['id'], 1)
        self.assertEqual(orders[0]['order_number'], 1001)
        self.assertEqual(orders[1]['id'], 2)
        self.assertEqual(orders[1]['order_number'], 1002)


if __name__ == '__main__':
    unittest.main()
