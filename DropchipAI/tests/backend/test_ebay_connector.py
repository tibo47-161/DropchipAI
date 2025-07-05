"""
Tests für die eBay-Integration.
"""

import unittest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.api.ebay.connector import EbayManager
from src.core.config_manager import ConfigManager

class TestEbayManager(unittest.TestCase):
    """Testklasse für die eBay-Integration."""
    
    def setUp(self):
        """Wird vor jedem Test ausgeführt."""
        # Mock für ConfigManager erstellen
        self.mock_config = MagicMock(spec=ConfigManager)
        self.mock_config.get_credentials.return_value = {
            'app_id': 'test_app_id',
            'cert_id': 'test_cert_id',
            'dev_id': 'test_dev_id',
            'auth_token': 'test_auth_token',
            'sandbox_mode': True
        }
        
        # EbayManager mit Mock-ConfigManager initialisieren
        self.ebay = EbayManager(config_manager=self.mock_config)
    
    @patch('src.api.ebay.connector.requests.post')
    def test_get_oauth_token(self, mock_post):
        """Testet die Methode _get_oauth_token."""
        # Mock-Antwort für requests.post
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'access_token': 'test_oauth_token',
            'expires_in': 7200
        }
        mock_post.return_value = mock_response
        
        # Methode aufrufen
        token = self.ebay._get_oauth_token()
        
        # Überprüfen, ob requests.post mit den richtigen Parametern aufgerufen wurde
        mock_post.assert_called_once()
        self.assertIn('oauth2/token', mock_post.call_args[0][0])
        
        # Überprüfen, ob der Token korrekt zurückgegeben wurde
        self.assertEqual(token, 'test_oauth_token')
    
    @patch('src.api.ebay.connector.requests.post')
    def test_make_trading_api_request(self, mock_post):
        """Testet die Methode _make_trading_api_request."""
        # Mock-Antwort für requests.post
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = '<GetItemResponse>Success</GetItemResponse>'
        mock_post.return_value = mock_response
        
        # Testdaten
        call_name = 'GetItem'
        request_dict = {'ItemID': '123456789'}
        
        # Methode aufrufen
        response = self.ebay._make_trading_api_request(call_name, request_dict)
        
        # Überprüfen, ob requests.post mit den richtigen Parametern aufgerufen wurde
        mock_post.assert_called_once()
        self.assertIn('api.dll', mock_post.call_args[0][0])
        
        # Überprüfen, ob die richtigen Header gesendet wurden
        headers = mock_post.call_args[1]['headers']
        self.assertEqual(headers['X-EBAY-API-CALL-NAME'], 'GetItem')
        
        # Überprüfen, ob die richtigen Daten gesendet wurden
        data = mock_post.call_args[1]['data']
        self.assertIn('<ItemID>123456789</ItemID>', data)
        
        # Überprüfen, ob die Antwort korrekt zurückgegeben wurde
        self.assertTrue(response['success'])
        self.assertEqual(response['response_text'], '<GetItemResponse>Success</GetItemResponse>')
    
    @patch('src.api.ebay.connector.EbayManager._get_oauth_token')
    @patch('src.api.ebay.connector.requests.get')
    def test_make_rest_api_request(self, mock_get, mock_get_token):
        """Testet die Methode _make_rest_api_request."""
        # Mock für _get_oauth_token
        mock_get_token.return_value = 'test_oauth_token'
        
        # Mock-Antwort für requests.get
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'test': 'data'}
        mock_get.return_value = mock_response
        
        # Methode aufrufen
        response = self.ebay._make_rest_api_request('GET', 'test/endpoint')
        
        # Überprüfen, ob _get_oauth_token aufgerufen wurde
        mock_get_token.assert_called_once()
        
        # Überprüfen, ob requests.get mit den richtigen Parametern aufgerufen wurde
        mock_get.assert_called_once()
        self.assertIn('test/endpoint', mock_get.call_args[0][0])
        
        # Überprüfen, ob die richtigen Header gesendet wurden
        headers = mock_get.call_args[1]['headers']
        self.assertEqual(headers['Authorization'], 'Bearer test_oauth_token')
        
        # Überprüfen, ob die Antwort korrekt zurückgegeben wurde
        self.assertEqual(response, {'test': 'data'})
    
    @patch('src.api.ebay.connector.EbayManager._make_trading_api_request')
    def test_list_item(self, mock_make_request):
        """Testet die Methode list_item."""
        # Mock für _make_trading_api_request
        mock_make_request.return_value = {'success': True, 'response_text': '<AddItemResponse>Success</AddItemResponse>'}
        
        # Testdaten
        item_data = {
            'title': 'Test Item',
            'description': 'Test Description',
            'price': 19.99,
            'quantity': 1,
            'images': ['https://example.com/image.jpg']
        }
        
        # Methode aufrufen
        response = self.ebay.list_item(item_data)
        
        # Überprüfen, ob _make_trading_api_request mit den richtigen Parametern aufgerufen wurde
        mock_make_request.assert_called_once()
        self.assertEqual(mock_make_request.call_args[0][0], 'AddItem')
        
        # Überprüfen, ob die richtigen Daten gesendet wurden
        request_data = mock_make_request.call_args[0][1]
        self.assertEqual(request_data['Item']['Title'], 'Test Item')
        self.assertEqual(request_data['Item']['Description'], 'Test Description')
        self.assertEqual(request_data['Item']['StartPrice'], 19.99)
        
        # Überprüfen, ob die Antwort korrekt zurückgegeben wurde
        self.assertTrue(response['success'])
    
    @patch('src.api.ebay.connector.EbayManager._make_trading_api_request')
    def test_get_item(self, mock_make_request):
        """Testet die Methode get_item."""
        # Mock für _make_trading_api_request
        mock_make_request.return_value = {'success': True, 'response_text': '<GetItemResponse>Success</GetItemResponse>'}
        
        # Methode aufrufen
        response = self.ebay.get_item('123456789')
        
        # Überprüfen, ob _make_trading_api_request mit den richtigen Parametern aufgerufen wurde
        mock_make_request.assert_called_once()
        self.assertEqual(mock_make_request.call_args[0][0], 'GetItem')
        
        # Überprüfen, ob die richtigen Daten gesendet wurden
        request_data = mock_make_request.call_args[0][1]
        self.assertEqual(request_data['ItemID'], '123456789')
        
        # Überprüfen, ob die Antwort korrekt zurückgegeben wurde
        self.assertTrue(response['success'])
    
    @patch('src.api.ebay.connector.EbayManager._make_trading_api_request')
    def test_end_item(self, mock_make_request):
        """Testet die Methode end_item."""
        # Mock für _make_trading_api_request
        mock_make_request.return_value = {'success': True, 'response_text': '<EndItemResponse>Success</EndItemResponse>'}
        
        # Methode aufrufen
        result = self.ebay.end_item('123456789', reason='NotAvailable')
        
        # Überprüfen, ob _make_trading_api_request mit den richtigen Parametern aufgerufen wurde
        mock_make_request.assert_called_once()
        self.assertEqual(mock_make_request.call_args[0][0], 'EndItem')
        
        # Überprüfen, ob die richtigen Daten gesendet wurden
        request_data = mock_make_request.call_args[0][1]
        self.assertEqual(request_data['ItemID'], '123456789')
        self.assertEqual(request_data['EndingReason'], 'NotAvailable')
        
        # Überprüfen, ob das Ergebnis korrekt ist
        self.assertTrue(result)
    
    @patch('src.api.ebay.connector.EbayManager._make_trading_api_request')
    def test_get_my_ebay_selling(self, mock_make_request):
        """Testet die Methode get_my_ebay_selling."""
        # Mock für _make_trading_api_request
        mock_make_request.return_value = {'success': True, 'response_text': '<GetMyeBaySellingResponse>Success</GetMyeBaySellingResponse>'}
        
        # Methode aufrufen
        response = self.ebay.get_my_ebay_selling(limit=10)
        
        # Überprüfen, ob _make_trading_api_request mit den richtigen Parametern aufgerufen wurde
        mock_make_request.assert_called_once()
        self.assertEqual(mock_make_request.call_args[0][0], 'GetMyeBaySelling')
        
        # Überprüfen, ob die richtigen Daten gesendet wurden
        request_data = mock_make_request.call_args[0][1]
        self.assertEqual(request_data['ActiveList']['Include'], 'true')
        self.assertEqual(request_data['ActiveList']['Pagination']['EntriesPerPage'], '10')
        
        # Überprüfen, ob die Antwort korrekt zurückgegeben wurde
        self.assertTrue(response['success'])
    
    @patch('src.api.ebay.connector.EbayManager._make_rest_api_request')
    def test_search_items(self, mock_make_request):
        """Testet die Methode search_items."""
        # Mock für _make_rest_api_request
        mock_make_request.return_value = {'itemSummaries': [{'itemId': '123', 'title': 'Test Item'}]}
        
        # Methode aufrufen
        response = self.ebay.search_items('test keyword', category_id='123', min_price=10, max_price=50, limit=10)
        
        # Überprüfen, ob _make_rest_api_request mit den richtigen Parametern aufgerufen wurde
        mock_make_request.assert_called_once()
        self.assertEqual(mock_make_request.call_args[0][0], 'GET')
        
        # Überprüfen, ob die richtigen Parameter in der URL enthalten sind
        url = mock_make_request.call_args[0][1]
        self.assertIn('q=test keyword', url)
        self.assertIn('limit=10', url)
        self.assertIn('category_ids=123', url)
        self.assertIn('price=[10..]', url)
        self.assertIn('price=[..50]', url)
        
        # Überprüfen, ob die Antwort korrekt zurückgegeben wurde
        self.assertEqual(response, {'itemSummaries': [{'itemId': '123', 'title': 'Test Item'}]})


if __name__ == '__main__':
    unittest.main()
