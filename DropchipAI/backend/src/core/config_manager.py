"""
DropchipAi Config Manager

Dieses Modul verwaltet die Konfiguration und Einstellungen für die DropchipAi-Anwendung.
"""

import os
import yaml
from pathlib import Path

class ConfigManager:
    """
    Verwaltet die Konfiguration und Einstellungen für die DropchipAi-Anwendung.
    """
    
    def __init__(self, config_dir=None):
        """
        Initialisiert den ConfigManager.
        
        Args:
            config_dir (str, optional): Pfad zum Konfigurationsverzeichnis.
                Wenn nicht angegeben, wird das Standard-Konfigurationsverzeichnis verwendet.
        """
        if config_dir is None:
            # Standardpfad zum Konfigurationsverzeichnis
            self.config_dir = Path(__file__).parent.parent.parent / 'config'
        else:
            self.config_dir = Path(config_dir)
            
        self.credentials_file = self.config_dir / 'credentials.yaml'
        self.settings_file = self.config_dir / 'settings.yaml'
        
        # Standardeinstellungen
        self.settings = {
            'general': {
                'log_level': 'INFO',
                'data_dir': str(Path(__file__).parent.parent.parent / 'data'),
            },
            'api': {
                'timeout': 30,
                'retry_attempts': 3,
            },
            'ai': {
                'min_profit_margin': 0.3,
                'min_trend_score': 70,
            }
        }
        
        # Leere Anmeldeinformationen
        self.credentials = {
            'shopify': {},
            'ebay': {},
            'google': {}
        }
        
        # Lade Konfigurationen, wenn vorhanden
        self._load_settings()
        self._load_credentials()
    
    def _load_settings(self):
        """Lädt die Einstellungen aus der Konfigurationsdatei, wenn vorhanden."""
        if self.settings_file.exists():
            try:
                with open(self.settings_file, 'r') as f:
                    loaded_settings = yaml.safe_load(f)
                    if loaded_settings:
                        # Rekursives Update der Einstellungen
                        self._update_dict(self.settings, loaded_settings)
                print(f"Einstellungen aus {self.settings_file} geladen")
            except Exception as e:
                print(f"Fehler beim Laden der Einstellungen: {e}")
    
    def _load_credentials(self):
        """Lädt die Anmeldeinformationen aus der Konfigurationsdatei, wenn vorhanden."""
        if self.credentials_file.exists():
            try:
                with open(self.credentials_file, 'r') as f:
                    loaded_credentials = yaml.safe_load(f)
                    if loaded_credentials:
                        # Rekursives Update der Anmeldeinformationen
                        self._update_dict(self.credentials, loaded_credentials)
                print(f"Anmeldeinformationen aus {self.credentials_file} geladen")
            except Exception as e:
                print(f"Fehler beim Laden der Anmeldeinformationen: {e}")
    
    def _update_dict(self, target, source):
        """
        Aktualisiert ein Dictionary rekursiv mit Werten aus einem anderen Dictionary.
        
        Args:
            target (dict): Ziel-Dictionary, das aktualisiert werden soll
            source (dict): Quell-Dictionary mit den neuen Werten
        """
        for key, value in source.items():
            if key in target and isinstance(target[key], dict) and isinstance(value, dict):
                self._update_dict(target[key], value)
            else:
                target[key] = value
    
    def save_settings(self):
        """Speichert die aktuellen Einstellungen in der Konfigurationsdatei."""
        try:
            os.makedirs(self.config_dir, exist_ok=True)
            with open(self.settings_file, 'w') as f:
                yaml.dump(self.settings, f, default_flow_style=False)
            print(f"Einstellungen in {self.settings_file} gespeichert")
            return True
        except Exception as e:
            print(f"Fehler beim Speichern der Einstellungen: {e}")
            return False
    
    def save_credentials(self):
        """Speichert die aktuellen Anmeldeinformationen in der Konfigurationsdatei."""
        try:
            os.makedirs(self.config_dir, exist_ok=True)
            with open(self.credentials_file, 'w') as f:
                yaml.dump(self.credentials, f, default_flow_style=False)
            print(f"Anmeldeinformationen in {self.credentials_file} gespeichert")
            return True
        except Exception as e:
            print(f"Fehler beim Speichern der Anmeldeinformationen: {e}")
            return False
    
    def get_setting(self, section, key, default=None):
        """
        Gibt eine Einstellung zurück.
        
        Args:
            section (str): Abschnitt der Einstellung
            key (str): Schlüssel der Einstellung
            default: Standardwert, wenn die Einstellung nicht gefunden wird
            
        Returns:
            Der Wert der Einstellung oder der Standardwert
        """
        try:
            return self.settings[section][key]
        except KeyError:
            return default
    
    def set_setting(self, section, key, value):
        """
        Setzt eine Einstellung.
        
        Args:
            section (str): Abschnitt der Einstellung
            key (str): Schlüssel der Einstellung
            value: Wert der Einstellung
            
        Returns:
            bool: True, wenn erfolgreich, sonst False
        """
        try:
            if section not in self.settings:
                self.settings[section] = {}
            self.settings[section][key] = value
            return True
        except Exception as e:
            print(f"Fehler beim Setzen der Einstellung: {e}")
            return False
    
    def get_credentials(self, platform):
        """
        Gibt die Anmeldeinformationen für eine Plattform zurück.
        
        Args:
            platform (str): Name der Plattform (z.B. 'shopify', 'ebay')
            
        Returns:
            dict: Anmeldeinformationen oder leeres Dictionary, wenn nicht gefunden
        """
        return self.credentials.get(platform, {})
    
    def set_credentials(self, platform, credentials):
        """
        Setzt die Anmeldeinformationen für eine Plattform.
        
        Args:
            platform (str): Name der Plattform (z.B. 'shopify', 'ebay')
            credentials (dict): Anmeldeinformationen
            
        Returns:
            bool: True, wenn erfolgreich, sonst False
        """
        try:
            self.credentials[platform] = credentials
            return True
        except Exception as e:
            print(f"Fehler beim Setzen der Anmeldeinformationen: {e}")
            return False
