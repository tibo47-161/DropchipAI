"""
Tests für das ConfigManager-Modul.
"""

import unittest
import sys
import os
import yaml
from pathlib import Path
from unittest.mock import patch, mock_open

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.core.config_manager import ConfigManager

class TestConfigManager(unittest.TestCase):
    """Testklasse für das ConfigManager-Modul."""
    
    def setUp(self):
        """Wird vor jedem Test ausgeführt."""
        # Temporäres Konfigurationsverzeichnis für Tests
        self.test_config_dir = Path('/tmp/dropchipai_test_config')
        os.makedirs(self.test_config_dir, exist_ok=True)
        
        # ConfigManager mit Test-Konfigurationsverzeichnis initialisieren
        self.config_manager = ConfigManager(config_dir=self.test_config_dir)
    
    def tearDown(self):
        """Wird nach jedem Test ausgeführt."""
        # Temporäres Konfigurationsverzeichnis löschen
        if self.test_config_dir.exists():
            for file in self.test_config_dir.glob('*'):
                file.unlink()
            self.test_config_dir.rmdir()
    
    def test_initialization(self):
        """Testet die Initialisierung der ConfigManager-Klasse."""
        # Überprüfe, ob die Attribute korrekt initialisiert wurden
        self.assertEqual(self.config_manager.config_dir, self.test_config_dir)
        self.assertEqual(self.config_manager.credentials_file, self.test_config_dir / 'credentials.yaml')
        self.assertEqual(self.config_manager.settings_file, self.test_config_dir / 'settings.yaml')
        
        # Überprüfe, ob die Standardeinstellungen korrekt sind
        self.assertEqual(self.config_manager.settings['general']['log_level'], 'INFO')
        self.assertEqual(self.config_manager.settings['api']['timeout'], 30)
        self.assertEqual(self.config_manager.settings['ai']['min_profit_margin'], 0.3)
        
        # Überprüfe, ob die leeren Anmeldeinformationen korrekt sind
        self.assertEqual(self.config_manager.credentials['shopify'], {})
        self.assertEqual(self.config_manager.credentials['ebay'], {})
        self.assertEqual(self.config_manager.credentials['google'], {})
    
    @patch('builtins.open', new_callable=mock_open, read_data="""
general:
  log_level: DEBUG
api:
  timeout: 60
""")
    @patch('yaml.safe_load')
    def test_load_settings(self, mock_yaml_load, mock_file):
        """Testet die _load_settings-Methode."""
        # Mock für yaml.safe_load
        mock_yaml_load.return_value = {
            'general': {'log_level': 'DEBUG'},
            'api': {'timeout': 60}
        }
        
        # Methode aufrufen
        self.config_manager._load_settings()
        
        # Überprüfen, ob die Datei geöffnet wurde
        mock_file.assert_called_once_with(self.config_manager.settings_file, 'r')
        
        # Überprüfen, ob yaml.safe_load aufgerufen wurde
        mock_yaml_load.assert_called_once()
        
        # Überprüfen, ob die Einstellungen korrekt aktualisiert wurden
        self.assertEqual(self.config_manager.settings['general']['log_level'], 'DEBUG')
        self.assertEqual(self.config_manager.settings['api']['timeout'], 60)
    
    @patch('builtins.open', new_callable=mock_open, read_data="""
shopify:
  shop_url: test-store.myshopify.com
  api_key: test_api_key
  password: test_password
""")
    @patch('yaml.safe_load')
    def test_load_credentials(self, mock_yaml_load, mock_file):
        """Testet die _load_credentials-Methode."""
        # Mock für yaml.safe_load
        mock_yaml_load.return_value = {
            'shopify': {
                'shop_url': 'test-store.myshopify.com',
                'api_key': 'test_api_key',
                'password': 'test_password'
            }
        }
        
        # Methode aufrufen
        self.config_manager._load_credentials()
        
        # Überprüfen, ob die Datei geöffnet wurde
        mock_file.assert_called_once_with(self.config_manager.credentials_file, 'r')
        
        # Überprüfen, ob yaml.safe_load aufgerufen wurde
        mock_yaml_load.assert_called_once()
        
        # Überprüfen, ob die Anmeldeinformationen korrekt aktualisiert wurden
        self.assertEqual(self.config_manager.credentials['shopify']['shop_url'], 'test-store.myshopify.com')
        self.assertEqual(self.config_manager.credentials['shopify']['api_key'], 'test_api_key')
        self.assertEqual(self.config_manager.credentials['shopify']['password'], 'test_password')
    
    def test_update_dict(self):
        """Testet die _update_dict-Methode."""
        # Testdaten
        target = {
            'a': 1,
            'b': {
                'c': 2,
                'd': 3
            }
        }
        source = {
            'a': 10,
            'b': {
                'c': 20,
                'e': 30
            },
            'f': 40
        }
        
        # Methode aufrufen
        self.config_manager._update_dict(target, source)
        
        # Überprüfen, ob das Dictionary korrekt aktualisiert wurde
        self.assertEqual(target['a'], 10)
        self.assertEqual(target['b']['c'], 20)
        self.assertEqual(target['b']['d'], 3)
        self.assertEqual(target['b']['e'], 30)
        self.assertEqual(target['f'], 40)
    
    @patch('builtins.open', new_callable=mock_open)
    @patch('yaml.dump')
    def test_save_settings(self, mock_yaml_dump, mock_file):
        """Testet die save_settings-Methode."""
        # Methode aufrufen
        result = self.config_manager.save_settings()
        
        # Überprüfen, ob die Datei geöffnet wurde
        mock_file.assert_called_once_with(self.config_manager.settings_file, 'w')
        
        # Überprüfen, ob yaml.dump aufgerufen wurde
        mock_yaml_dump.assert_called_once_with(self.config_manager.settings, mock_file(), default_flow_style=False)
        
        # Überprüfen, ob das Ergebnis True ist
        self.assertTrue(result)
    
    @patch('builtins.open', new_callable=mock_open)
    @patch('yaml.dump')
    def test_save_credentials(self, mock_yaml_dump, mock_file):
        """Testet die save_credentials-Methode."""
        # Methode aufrufen
        result = self.config_manager.save_credentials()
        
        # Überprüfen, ob die Datei geöffnet wurde
        mock_file.assert_called_once_with(self.config_manager.credentials_file, 'w')
        
        # Überprüfen, ob yaml.dump aufgerufen wurde
        mock_yaml_dump.assert_called_once_with(self.config_manager.credentials, mock_file(), default_flow_style=False)
        
        # Überprüfen, ob das Ergebnis True ist
        self.assertTrue(result)
    
    def test_get_setting(self):
        """Testet die get_setting-Methode."""
        # Methode aufrufen
        log_level = self.config_manager.get_setting('general', 'log_level')
        timeout = self.config_manager.get_setting('api', 'timeout')
        non_existent = self.config_manager.get_setting('non_existent', 'key', 'default_value')
        
        # Überprüfen, ob die Einstellungen korrekt zurückgegeben wurden
        self.assertEqual(log_level, 'INFO')
        self.assertEqual(timeout, 30)
        self.assertEqual(non_existent, 'default_value')
    
    def test_set_setting(self):
        """Testet die set_setting-Methode."""
        # Methode aufrufen
        result1 = self.config_manager.set_setting('general', 'log_level', 'DEBUG')
        result2 = self.config_manager.set_setting('new_section', 'new_key', 'new_value')
        
        # Überprüfen, ob die Ergebnisse True sind
        self.assertTrue(result1)
        self.assertTrue(result2)
        
        # Überprüfen, ob die Einstellungen korrekt aktualisiert wurden
        self.assertEqual(self.config_manager.settings['general']['log_level'], 'DEBUG')
        self.assertEqual(self.config_manager.settings['new_section']['new_key'], 'new_value')
    
    def test_get_credentials(self):
        """Testet die get_credentials-Methode."""
        # Anmeldeinformationen setzen
        self.config_manager.credentials['shopify'] = {
            'shop_url': 'test-store.myshopify.com',
            'api_key': 'test_api_key',
            'password': 'test_password'
        }
        
        # Methode aufrufen
        shopify_creds = self.config_manager.get_credentials('shopify')
        non_existent_creds = self.config_manager.get_credentials('non_existent')
        
        # Überprüfen, ob die Anmeldeinformationen korrekt zurückgegeben wurden
        self.assertEqual(shopify_creds['shop_url'], 'test-store.myshopify.com')
        self.assertEqual(shopify_creds['api_key'], 'test_api_key')
        self.assertEqual(shopify_creds['password'], 'test_password')
        self.assertEqual(non_existent_creds, {})
    
    def test_set_credentials(self):
        """Testet die set_credentials-Methode."""
        # Testdaten
        shopify_creds = {
            'shop_url': 'test-store.myshopify.com',
            'api_key': 'test_api_key',
            'password': 'test_password'
        }
        
        # Methode aufrufen
        result = self.config_manager.set_credentials('shopify', shopify_creds)
        
        # Überprüfen, ob das Ergebnis True ist
        self.assertTrue(result)
        
        # Überprüfen, ob die Anmeldeinformationen korrekt aktualisiert wurden
        self.assertEqual(self.config_manager.credentials['shopify'], shopify_creds)


if __name__ == '__main__':
    unittest.main()
