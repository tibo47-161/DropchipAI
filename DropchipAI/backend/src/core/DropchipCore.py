"""
DropchipAi Core Module

Dieses Modul dient als Hauptschnittstelle für die DropchipAi-Anwendung und
koordiniert die verschiedenen Komponenten des Systems.
"""

from .automation import AutomationManager
from .config_manager import ConfigManager
from src.utils.logger import Logger

class DropchipCore:
    """
    Hauptklasse der DropchipAi-Anwendung, die als zentrale Schnittstelle dient.
    """
    
    def __init__(self, config_path=None):
        """
        Initialisiert den DropchipCore.
        
        Args:
            config_path (str, optional): Pfad zur Konfigurationsdatei.
                Wenn nicht angegeben, wird die Standardkonfiguration verwendet.
        """
        self.logger = Logger()
        self.config_manager = ConfigManager(config_path)
        self.automation_manager = AutomationManager()
        
        self.logger.info("DropchipCore initialisiert")
    
    def full_automation(self, keywords):
        """
        Führt den vollständigen Automatisierungsprozess für die angegebenen Schlüsselwörter durch.
        
        Args:
            keywords (list): Liste von Schlüsselwörtern für die Produktrecherche
            
        Returns:
            int: Anzahl der verarbeiteten Produkte
        """
        self.logger.info(f"Starte vollständige Automatisierung für Keywords: {keywords}")
        
        # Für jedes Keyword einen Job planen
        for keyword in keywords:
            self.automation_manager.schedule_job('product_research', {
                'keyword': keyword,
                'min_profit_margin': self.config_manager.get_setting('ai', 'min_profit_margin', 0.3),
                'min_trend_score': self.config_manager.get_setting('ai', 'min_trend_score', 70)
            })
        
        # Alle geplanten Jobs ausführen
        processed_count = self.automation_manager.execute_all_jobs()
        
        self.logger.info(f"Automatisierung abgeschlossen: {processed_count} Produkte verarbeitet")
        return processed_count
    
    def get_job_status(self, job_id):
        """
        Gibt den Status eines Jobs zurück.
        
        Args:
            job_id (str): ID des Jobs
            
        Returns:
            dict: Job-Informationen oder None, wenn nicht gefunden
        """
        return self.automation_manager.get_job_status(job_id)
    
    def cancel_job(self, job_id):
        """
        Bricht einen geplanten oder laufenden Job ab.
        
        Args:
            job_id (str): ID des Jobs
            
        Returns:
            bool: True, wenn erfolgreich abgebrochen, sonst False
        """
        return self.automation_manager.cancel_job(job_id)