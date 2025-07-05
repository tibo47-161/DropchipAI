"""
DropchipAi eBay Connector Module

Dieses Modul stellt die Integration mit der eBay API für die DropchipAi-Anwendung bereit.
"""

import requests
import json
import time
import base64
from pathlib import Path
import sys

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

from src.core.config_manager import ConfigManager

class EbayManager:
    """
    Verwaltet die Integration mit der eBay API.
    """
    
    def __init__(self, config_manager=None):
        """
        Initialisiert den EbayManager.
        
        Args:
            config_manager (ConfigManager, optional): Konfigurationsmanager-Instanz
        """
        if config_manager is None:
            self.config_manager = ConfigManager()
        else:
            self.config_manager = config_manager
            
        # Lade eBay-Anmeldeinformationen
        self.credentials = self.config_manager.get_credentials('ebay')
        
        # Setze API-Endpunkte
        self.app_id = self.credentials.get('app_id', '')
        self.cert_id = self.credentials.get('cert_id', '')
        self.dev_id = self.credentials.get('dev_id', '')
        self.auth_token = self.credentials.get('auth_token', '')
        self.sandbox_mode = self.credentials.get('sandbox_mode', True)
        
        # Prüfe, ob Anmeldeinformationen vorhanden sind
        if not all([self.app_id, self.cert_id, self.dev_id, self.auth_token]):
            print("Warnung: eBay-Anmeldeinformationen fehlen oder sind unvollständig.")
            print("Bitte konfiguriere die Anmeldeinformationen in config/credentials.yaml.")
        
        # Setze API-URLs basierend auf Sandbox-Modus
        if self.sandbox_mode:
            self.api_url = "https://api.sandbox.ebay.com/ws/api.dll"
            self.auth_url = "https://api.sandbox.ebay.com/identity/v1/oauth2/token"
        else:
            self.api_url = "https://api.ebay.com/ws/api.dll"
            self.auth_url = "https://api.ebay.com/identity/v1/oauth2/token"
        
        # OAuth Token für REST API
        self.oauth_token = None
        self.token_expiry = 0
    
    def _get_oauth_token(self):
        """
        Holt ein OAuth-Token für die eBay REST API.
        
        Returns:
            str: OAuth-Token oder None bei Fehler
        """
        # Prüfe, ob ein gültiges Token vorhanden ist
        if self.oauth_token and time.time() < self.token_expiry:
            return self.oauth_token
            
        # Bereite Authentifizierungsdaten vor
        auth_header = base64.b64encode(f"{self.app_id}:{self.cert_id}".encode()).decode()
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': f'Basic {auth_header}'
        }
        
        data = {
            'grant_type': 'client_credentials',
            'scope': 'https://api.ebay.com/oauth/api_scope'
        }
        
        try:
            response = requests.post(self.auth_url, headers=headers, data=data)
            
            if response.status_code == 200:
                token_data = response.json()
                self.oauth_token = token_data['access_token']
                self.token_expiry = time.time() + token_data['expires_in'] - 300  # 5 Minuten Puffer
                return self.oauth_token
            else:
                print(f"Fehler beim Abrufen des OAuth-Tokens: {response.status_code}")
                print(f"Antwort: {response.text}")
                return None
                
        except Exception as e:
            print(f"Fehler bei OAuth-Anfrage: {e}")
            return None
    
    def _make_trading_api_request(self, call_name, request_dict):
        """
        Führt eine Anfrage an die eBay Trading API aus.
        
        Args:
            call_name (str): Name des API-Aufrufs
            request_dict (dict): Anfragedaten
            
        Returns:
            dict: API-Antwort oder None bei Fehler
        """
        if not all([self.app_id, self.cert_id, self.dev_id, self.auth_token]):
            print("Fehler: eBay-Anmeldeinformationen fehlen oder sind unvollständig.")
            return None
            
        # Erstelle XML-Anfrage
        xml_request = f"""<?xml version="1.0" encoding="utf-8"?>
        <{call_name}Request xmlns="urn:ebay:apis:eBLBaseComponents">
            <RequesterCredentials>
                <eBayAuthToken>{self.auth_token}</eBayAuthToken>
            </RequesterCredentials>
        """
        
        # Füge Anfragedaten hinzu
        for key, value in request_dict.items():
            if isinstance(value, dict):
                xml_request += f"<{key}>\n"
                for sub_key, sub_value in value.items():
                    xml_request += f"<{sub_key}>{sub_value}</{sub_key}>\n"
                xml_request += f"</{key}>\n"
            else:
                xml_request += f"<{key}>{value}</{key}>\n"
        
        xml_request += f"</{call_name}Request>"
        
        # Setze Header
        headers = {
            'X-EBAY-API-COMPATIBILITY-LEVEL': '1113',
            'X-EBAY-API-DEV-NAME': self.dev_id,
            'X-EBAY-API-APP-NAME': self.app_id,
            'X-EBAY-API-CERT-NAME': self.cert_id,
            'X-EBAY-API-CALL-NAME': call_name,
            'X-EBAY-API-SITEID': '0',  # US-Site
            'Content-Type': 'text/xml'
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, data=xml_request)
            
            if response.status_code == 200:
                # Hier würde normalerweise ein XML-Parser verwendet werden
                # Für die Einfachheit geben wir den Text zurück
                return {'success': True, 'response_text': response.text}
            else:
                print(f"Fehler bei Trading API-Anfrage: {response.status_code}")
                print(f"Antwort: {response.text}")
                return None
                
        except Exception as e:
            print(f"Fehler bei Trading API-Anfrage: {e}")
            return None
    
    def _make_rest_api_request(self, method, endpoint, data=None):
        """
        Führt eine Anfrage an die eBay REST API aus.
        
        Args:
            method (str): HTTP-Methode (GET, POST, PUT, DELETE)
            endpoint (str): API-Endpunkt
            data (dict, optional): Anfragedaten
            
        Returns:
            dict: API-Antwort oder None bei Fehler
        """
        # Hole OAuth-Token
        token = self._get_oauth_token()
        if not token:
            return None
            
        # Setze API-URL
        if self.sandbox_mode:
            base_url = "https://api.sandbox.ebay.com"
        else:
            base_url = "https://api.ebay.com"
            
        url = f"{base_url}/{endpoint}"
        
        # Setze Header
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, headers=headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=headers, json=data)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)
            else:
                print(f"Fehler: Ungültige HTTP-Methode: {method}")
                return None
                
            # Prüfe auf erfolgreiche Antwort
            if response.status_code >= 200 and response.status_code < 300:
                return response.json()
            else:
                print(f"Fehler: REST API-Anfrage fehlgeschlagen mit Status {response.status_code}")
                print(f"Antwort: {response.text}")
                return None
                
        except Exception as e:
            print(f"Fehler bei REST API-Anfrage: {e}")
            return None
    
    def list_item(self, item_data):
        """
        Erstellt ein neues Angebot auf eBay.
        
        Args:
            item_data (dict): Angebotsdaten
            
        Returns:
            dict: Erstellte Angebotsdaten oder None bei Fehler
        """
        # Bereite Angebotsdaten für eBay Trading API vor
        request_data = {
            'Item': {
                'Title': item_data.get('title', ''),
                'Description': item_data.get('description', ''),
                'PrimaryCategory': {'CategoryID': item_data.get('category_id', '9355')},  # Standardkategorie: Sonstiges
                'StartPrice': item_data.get('price', '0.99'),
                'Quantity': item_data.get('quantity', '1'),
                'ListingDuration': item_data.get('duration', 'Days_7'),
                'Location': item_data.get('location', 'Deutschland'),
                'Country': item_data.get('country', 'DE'),
                'Currency': item_data.get('currency', 'EUR'),
                'PaymentMethods': 'PayPal',
                'PayPalEmailAddress': item_data.get('paypal_email', ''),
                'PictureDetails': {'PictureURL': item_data.get('images', [])[0]} if item_data.get('images') else None,
                'DispatchTimeMax': '3',  # 3 Tage Versandzeit
                'ReturnPolicy': {
                    'ReturnsAcceptedOption': 'ReturnsAccepted',
                    'RefundOption': 'MoneyBack',
                    'ReturnsWithinOption': 'Days_30',
                    'ShippingCostPaidByOption': 'Buyer'
                },
                'ShippingDetails': {
                    'ShippingType': 'Flat',
                    'ShippingServiceOptions': {
                        'ShippingServicePriority': '1',
                        'ShippingService': 'DE_DHLPaket',
                        'ShippingServiceCost': item_data.get('shipping_cost', '4.99')
                    }
                }
            }
        }
        
        response = self._make_trading_api_request('AddItem', request_data)
        if response and response.get('success'):
            print(f"Angebot erfolgreich erstellt: {item_data.get('title')}")
            return response
        
        print("Fehler beim Erstellen des Angebots")
        return None
    
    def get_item(self, item_id):
        """
        Ruft ein bestimmtes Angebot von eBay ab.
        
        Args:
            item_id (str): ID des Angebots
            
        Returns:
            dict: Angebotsdaten oder None bei Fehler
        """
        request_data = {
            'ItemID': item_id
        }
        
        response = self._make_trading_api_request('GetItem', request_data)
        if response and response.get('success'):
            return response
        
        print(f"Fehler beim Abrufen des Angebots (ID: {item_id})")
        return None
    
    def end_item(self, item_id, reason='NotAvailable'):
        """
        Beendet ein Angebot auf eBay.
        
        Args:
            item_id (str): ID des Angebots
            reason (str): Grund für die Beendigung
                ('NotAvailable', 'SoldOffEBay', 'LostOrBroken', 'OtherListingError')
            
        Returns:
            bool: True, wenn erfolgreich, sonst False
        """
        request_data = {
            'ItemID': item_id,
            'EndingReason': reason
        }
        
        response = self._make_trading_api_request('EndItem', request_data)
        if response and response.get('success'):
            print(f"Angebot erfolgreich beendet (ID: {item_id})")
            return True
        
        print(f"Fehler beim Beenden des Angebots (ID: {item_id})")
        return False
    
    def get_my_ebay_selling(self, limit=10):
        """
        Ruft aktive Angebote des Verkäufers ab.
        
        Args:
            limit (int): Maximale Anzahl der abzurufenden Angebote
            
        Returns:
            dict: Angebotsdaten oder None bei Fehler
        """
        request_data = {
            'ActiveList': {
                'Include': 'true',
                'Pagination': {
                    'EntriesPerPage': str(limit),
                    'PageNumber': '1'
                }
            }
        }
        
        response = self._make_trading_api_request('GetMyeBaySelling', request_data)
        if response and response.get('success'):
            return response
        
        print("Fehler beim Abrufen der aktiven Angebote")
        return None
    
    def get_orders(self, days=7):
        """
        Ruft Bestellungen der letzten Tage ab.
        
        Args:
            days (int): Anzahl der Tage in der Vergangenheit
            
        Returns:
            dict: Bestelldaten oder None bei Fehler
        """
        request_data = {
            'NumberOfDays': str(days)
        }
        
        response = self._make_trading_api_request('GetOrders', request_data)
        if response and response.get('success'):
            return response
        
        print("Fehler beim Abrufen der Bestellungen")
        return None
    
    def search_items(self, keywords, category_id=None, min_price=None, max_price=None, limit=10):
        """
        Sucht nach Artikeln auf eBay (verwendet die REST API).
        
        Args:
            keywords (str): Suchbegriffe
            category_id (str, optional): Kategorie-ID
            min_price (float, optional): Mindestpreis
            max_price (float, optional): Höchstpreis
            limit (int): Maximale Anzahl der Ergebnisse
            
        Returns:
            dict: Suchergebnisse oder None bei Fehler
        """
        # Baue Abfrageparameter
        params = [f"q={keywords}", f"limit={limit}"]
        
        if category_id:
            params.append(f"category_ids={category_id}")
        if min_price:
            params.append(f"price=[{min_price}..]")
        if max_price:
            params.append(f"price=[..{max_price}]")
            
        query_string = "&".join(params)
        
        # Führe Suchanfrage aus
        response = self._make_rest_api_request('GET', f"buy/browse/v1/item_summary/search?{query_string}")
        if response:
            return response
        
        print("Fehler bei der Artikelsuche")
        return None
