"""
DropchipAi Shopify Connector Module

Dieses Modul stellt die Integration mit der Shopify API für die DropchipAi-Anwendung bereit.
"""

import requests
import json
import time
from pathlib import Path
import sys

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

from src.core.config_manager import ConfigManager

class ShopifyManager:
    """
    Verwaltet die Integration mit der Shopify API.
    """
    
    def __init__(self, config_manager=None):
        """
        Initialisiert den ShopifyManager.
        
        Args:
            config_manager (ConfigManager, optional): Konfigurationsmanager-Instanz
        """
        if config_manager is None:
            self.config_manager = ConfigManager()
        else:
            self.config_manager = config_manager
            
        # Lade Shopify-Anmeldeinformationen
        self.credentials = self.config_manager.get_credentials('shopify')
        
        # Setze API-Endpunkte
        self.shop_url = self.credentials.get('shop_url', '')
        self.api_key = self.credentials.get('api_key', '')
        self.password = self.credentials.get('password', '')
        
        # Prüfe, ob Anmeldeinformationen vorhanden sind
        if not all([self.shop_url, self.api_key, self.password]):
            print("Warnung: Shopify-Anmeldeinformationen fehlen oder sind unvollständig.")
            print("Bitte konfiguriere die Anmeldeinformationen in config/credentials.yaml.")
        
        # Setze API-URL
        self.api_url = f"https://{self.api_key}:{self.password}@{self.shop_url}/admin/api/2023-01"
        
        # Setze Request-Header
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    
    def _make_request(self, method, endpoint, data=None):
        """
        Führt eine HTTP-Anfrage an die Shopify API aus.
        
        Args:
            method (str): HTTP-Methode (GET, POST, PUT, DELETE)
            endpoint (str): API-Endpunkt
            data (dict, optional): Anfragedaten
            
        Returns:
            dict: API-Antwort oder None bei Fehler
        """
        if not all([self.shop_url, self.api_key, self.password]):
            print("Fehler: Shopify-Anmeldeinformationen fehlen oder sind unvollständig.")
            return None
            
        url = f"{self.api_url}/{endpoint}"
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers)
            elif method == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            elif method == 'DELETE':
                response = requests.delete(url, headers=self.headers)
            else:
                print(f"Fehler: Ungültige HTTP-Methode: {method}")
                return None
                
            # Prüfe auf API-Ratenbegrenzung
            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', 10))
                print(f"API-Ratenbegrenzung erreicht. Warte {retry_after} Sekunden...")
                time.sleep(retry_after)
                return self._make_request(method, endpoint, data)
                
            # Prüfe auf erfolgreiche Antwort
            if response.status_code >= 200 and response.status_code < 300:
                return response.json()
            else:
                print(f"Fehler: API-Anfrage fehlgeschlagen mit Status {response.status_code}")
                print(f"Antwort: {response.text}")
                return None
                
        except Exception as e:
            print(f"Fehler bei API-Anfrage: {e}")
            return None
    
    def get_products(self, limit=50):
        """
        Ruft Produkte vom Shopify-Shop ab.
        
        Args:
            limit (int): Maximale Anzahl der abzurufenden Produkte
            
        Returns:
            list: Liste der Produkte oder leere Liste bei Fehler
        """
        response = self._make_request('GET', f"products.json?limit={limit}")
        if response and 'products' in response:
            return response['products']
        return []
    
    def get_product(self, product_id):
        """
        Ruft ein bestimmtes Produkt vom Shopify-Shop ab.
        
        Args:
            product_id (int): ID des Produkts
            
        Returns:
            dict: Produktdaten oder None bei Fehler
        """
        response = self._make_request('GET', f"products/{product_id}.json")
        if response and 'product' in response:
            return response['product']
        return None
    
    def create_product(self, product_data):
        """
        Erstellt ein neues Produkt im Shopify-Shop.
        
        Args:
            product_data (dict): Produktdaten
            
        Returns:
            dict: Erstellte Produktdaten oder None bei Fehler
        """
        # Bereite Produktdaten für Shopify API vor
        shopify_product = {
            'product': {
                'title': product_data.get('title', ''),
                'body_html': product_data.get('description', ''),
                'vendor': product_data.get('vendor', 'DropchipAi'),
                'product_type': product_data.get('product_type', 'Dropshipping'),
                'tags': product_data.get('tags', ''),
                'variants': [
                    {
                        'price': str(product_data.get('price', 0)),
                        'inventory_management': 'shopify',
                        'inventory_quantity': product_data.get('inventory_quantity', 10)
                    }
                ]
            }
        }
        
        # Füge Bilder hinzu, wenn vorhanden
        if 'images' in product_data and product_data['images']:
            shopify_product['product']['images'] = []
            for image_url in product_data['images']:
                shopify_product['product']['images'].append({
                    'src': image_url
                })
        
        response = self._make_request('POST', 'products.json', shopify_product)
        if response and 'product' in response:
            print(f"Produkt erfolgreich erstellt: {response['product']['title']} (ID: {response['product']['id']})")
            return response['product']
        
        print("Fehler beim Erstellen des Produkts")
        return None
    
    def update_product(self, product_id, product_data):
        """
        Aktualisiert ein bestehendes Produkt im Shopify-Shop.
        
        Args:
            product_id (int): ID des Produkts
            product_data (dict): Aktualisierte Produktdaten
            
        Returns:
            dict: Aktualisierte Produktdaten oder None bei Fehler
        """
        # Bereite Produktdaten für Shopify API vor
        shopify_product = {
            'product': {
                'id': product_id
            }
        }
        
        # Füge nur die zu aktualisierenden Felder hinzu
        if 'title' in product_data:
            shopify_product['product']['title'] = product_data['title']
        if 'description' in product_data:
            shopify_product['product']['body_html'] = product_data['description']
        if 'vendor' in product_data:
            shopify_product['product']['vendor'] = product_data['vendor']
        if 'product_type' in product_data:
            shopify_product['product']['product_type'] = product_data['product_type']
        if 'tags' in product_data:
            shopify_product['product']['tags'] = product_data['tags']
        if 'price' in product_data:
            # Für die Preisänderung müssen wir die Varianten-IDs kennen
            # Hier vereinfacht: Wir gehen davon aus, dass es nur eine Variante gibt
            product = self.get_product(product_id)
            if product and 'variants' in product and product['variants']:
                variant_id = product['variants'][0]['id']
                shopify_product['product']['variants'] = [
                    {
                        'id': variant_id,
                        'price': str(product_data['price'])
                    }
                ]
        
        response = self._make_request('PUT', f"products/{product_id}.json", shopify_product)
        if response and 'product' in response:
            print(f"Produkt erfolgreich aktualisiert: {response['product']['title']} (ID: {response['product']['id']})")
            return response['product']
        
        print("Fehler beim Aktualisieren des Produkts")
        return None
    
    def delete_product(self, product_id):
        """
        Löscht ein Produkt aus dem Shopify-Shop.
        
        Args:
            product_id (int): ID des Produkts
            
        Returns:
            bool: True, wenn erfolgreich, sonst False
        """
        response = self._make_request('DELETE', f"products/{product_id}.json")
        if response is not None:
            print(f"Produkt erfolgreich gelöscht (ID: {product_id})")
            return True
        
        print(f"Fehler beim Löschen des Produkts (ID: {product_id})")
        return False
    
    def get_orders(self, limit=50, status='any'):
        """
        Ruft Bestellungen vom Shopify-Shop ab.
        
        Args:
            limit (int): Maximale Anzahl der abzurufenden Bestellungen
            status (str): Status der Bestellungen ('any', 'open', 'closed', 'cancelled')
            
        Returns:
            list: Liste der Bestellungen oder leere Liste bei Fehler
        """
        response = self._make_request('GET', f"orders.json?limit={limit}&status={status}")
        if response and 'orders' in response:
            return response['orders']
        return []
    
    def get_order(self, order_id):
        """
        Ruft eine bestimmte Bestellung vom Shopify-Shop ab.
        
        Args:
            order_id (int): ID der Bestellung
            
        Returns:
            dict: Bestelldaten oder None bei Fehler
        """
        response = self._make_request('GET', f"orders/{order_id}.json")
        if response and 'order' in response:
            return response['order']
        return None
