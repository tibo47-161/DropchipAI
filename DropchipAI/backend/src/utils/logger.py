"""
DropchipAi Logger Module

Dieses Modul stellt Logging-Funktionalitaeten fuer die DropchipAi-Anwendung bereit.
"""

import logging
import os
from pathlib import Path
from datetime import datetime

class Logger:
    """
    Logger-Klasse für die DropchipAi-Anwendung.
    """
    
    def __init__(self, log_level='INFO', log_dir=None):
        """
        Initialisiert den Logger.
        
        Args:
            log_level (str): Log-Level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
            log_dir (str, optional): Verzeichnis fuer Log-Dateien
        """
        self.log_level = getattr(logging, log_level.upper(), logging.INFO)
        
        if log_dir is None:
            self.log_dir = Path(__file__).parent.parent.parent / 'logs'
        else:
            self.log_dir = Path(log_dir)
            
        # Stelle sicher, dass das Log-Verzeichnis existiert
        os.makedirs(self.log_dir, exist_ok=True)
        
        # Erstelle Logger
        self.logger = logging.getLogger('dropchipai')
        self.logger.setLevel(self.log_level)
        
        # Entferne bestehende Handler, um Duplikate zu vermeiden
        if self.logger.handlers:
            self.logger.handlers.clear()
        
        # Erstelle Datei-Handler
        log_file = self.log_dir / f"dropchipai_{datetime.now().strftime('%Y%m%d')}.log"
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(self.log_level)
        
        # Erstelle Konsolen-Handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(self.log_level)
        
        # Erstelle Formatter
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # Fuege Handler zum Logger hinzu
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
        
        self.logger.info("Logger initialisiert")
    
    def debug(self, message):
        """Loggt eine Debug-Nachricht."""
        self.logger.debug(message)
    
    def info(self, message):
        """Loggt eine Info-Nachricht."""
        self.logger.info(message)
    
    def warning(self, message):
        """Loggt eine Warnung."""
        self.logger.warning(message)
    
    def error(self, message):
        """Loggt einen Fehler."""
        self.logger.error(message)
    
    def critical(self, message):
        """Loggt einen kritischen Fehler."""
        self.logger.critical(message)
    
    def set_level(self, level):
        """
        Setzt das Log-Level.
        
        Args:
            level (str): Log-Level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        """
        level_value = getattr(logging, level.upper(), None)
        if level_value:
            self.log_level = level_value
            self.logger.setLevel(level_value)
            for handler in self.logger.handlers:
                handler.setLevel(level_value)
            self.logger.info(f"Log-Level auf {level} gesetzt")
        else:
            self.logger.warning(f"Ungueltiges Log-Level: {level}")