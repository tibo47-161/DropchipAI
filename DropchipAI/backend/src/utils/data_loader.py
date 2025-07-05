"""
DropchipAi Data Loader Module

Dieses Modul stellt Funktionen zum Laden und Verarbeiten von Daten für die DropchipAi-Anwendung bereit.
"""

import pandas as pd
import json
import csv
from pathlib import Path
import os

class DataLoader:
    """
    Klasse zum Laden und Verarbeiten von Daten für die DropchipAi-Anwendung.
    """
    
    def __init__(self, data_dir=None):
        """
        Initialisiert den DataLoader.
        
        Args:
            data_dir (str, optional): Verzeichnis für Datendateien
        """
        if data_dir is None:
            self.data_dir = Path(__file__).parent.parent.parent / 'data'
        else:
            self.data_dir = Path(data_dir)
            
        # Stelle sicher, dass das Datenverzeichnis existiert
        os.makedirs(self.data_dir, exist_ok=True)
    
    def load_csv(self, filename, **kwargs):
        """
        Lädt Daten aus einer CSV-Datei.
        
        Args:
            filename (str): Name der CSV-Datei
            **kwargs: Zusätzliche Parameter für pandas.read_csv
            
        Returns:
            pandas.DataFrame: Geladene Daten oder leerer DataFrame bei Fehler
        """
        file_path = self.data_dir / filename
        try:
            if file_path.exists():
                return pd.read_csv(file_path, **kwargs)
            else:
                print(f"Datei nicht gefunden: {file_path}")
                return pd.DataFrame()
        except Exception as e:
            print(f"Fehler beim Laden der CSV-Datei {filename}: {e}")
            return pd.DataFrame()
    
    def save_csv(self, df, filename, **kwargs):
        """
        Speichert Daten in einer CSV-Datei.
        
        Args:
            df (pandas.DataFrame): Zu speichernde Daten
            filename (str): Name der CSV-Datei
            **kwargs: Zusätzliche Parameter für pandas.to_csv
            
        Returns:
            bool: True, wenn erfolgreich, sonst False
        """
        file_path = self.data_dir / filename
        try:
            df.to_csv(file_path, **kwargs)
            print(f"Daten in {file_path} gespeichert")
            return True
        except Exception as e:
            print(f"Fehler beim Speichern der CSV-Datei {filename}: {e}")
            return False
    
    def load_json(self, filename):
        """
        Lädt Daten aus einer JSON-Datei.
        
        Args:
            filename (str): Name der JSON-Datei
            
        Returns:
            dict: Geladene Daten oder leeres Dictionary bei Fehler
        """
        file_path = self.data_dir / filename
        try:
            if file_path.exists():
                with open(file_path, 'r') as f:
                    return json.load(f)
            else:
                print(f"Datei nicht gefunden: {file_path}")
                return {}
        except Exception as e:
            print(f"Fehler beim Laden der JSON-Datei {filename}: {e}")
            return {}
    
    def save_json(self, data, filename):
        """
        Speichert Daten in einer JSON-Datei.
        
        Args:
            data (dict): Zu speichernde Daten
            filename (str): Name der JSON-Datei
            
        Returns:
            bool: True, wenn erfolgreich, sonst False
        """
        file_path = self.data_dir / filename
        try:
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=4)
            print(f"Daten in {file_path} gespeichert")
            return True
        except Exception as e:
            print(f"Fehler beim Speichern der JSON-Datei {filename}: {e}")
            return False
    
    def list_files(self, extension=None):
        """
        Listet alle Dateien im Datenverzeichnis auf.
        
        Args:
            extension (str, optional): Dateiendung zum Filtern (z.B. '.csv')
            
        Returns:
            list: Liste der Dateien
        """
        try:
            if extension:
                return [f.name for f in self.data_dir.glob(f"*{extension}")]
            else:
                return [f.name for f in self.data_dir.glob("*") if f.is_file()]
        except Exception as e:
            print(f"Fehler beim Auflisten der Dateien: {e}")
            return []
