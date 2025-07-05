"""
DropchipAi Supplier Scorer Module

Dieses Modul implementiert die KI-gestützte Lieferantenbewertung für die DropchipAi-Anwendung.
"""

import pandas as pd
import numpy as np
from pathlib import Path
import sys
import requests
import time
from datetime import datetime

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.core.config_manager import ConfigManager
from src.utils.logger import Logger

class SupplierScorer:
    """
    Klasse für die KI-gestützte Lieferantenbewertung.
    """
    
    def __init__(self, config_manager=None, logger=None):
        """
        Initialisiert die SupplierScorer-Klasse.
        
        Args:
            config_manager (ConfigManager, optional): Konfigurationsmanager-Instanz
            logger (Logger, optional): Logger-Instanz
        """
        if config_manager is None:
            self.config_manager = ConfigManager()
        else:
            self.config_manager = config_manager
            
        if logger is None:
            self.logger = Logger(log_level='INFO')
        else:
            self.logger = logger
            
        # Lade Einstellungen
        self.price_weight = self.config_manager.get_setting('ai', 'supplier_price_weight', 0.4)
        self.rating_weight = self.config_manager.get_setting('ai', 'supplier_rating_weight', 0.3)
        self.delivery_weight = self.config_manager.get_setting('ai', 'supplier_delivery_weight', 0.3)
        
        self.logger.info("SupplierScorer initialisiert")
    
    def score_suppliers(self, product, suppliers=None):
        """
        Bewertet Lieferanten für ein Produkt.
        
        Args:
            product (dict): Produktdaten
            suppliers (list, optional): Liste von Lieferanten
                Wenn nicht angegeben, werden die Lieferanten aus dem Produkt verwendet
            
        Returns:
            list: Bewertete Lieferanten, sortiert nach Score
        """
        if suppliers is None:
            if 'suppliers' in product:
                suppliers = product['suppliers']
            else:
                self.logger.warning("Keine Lieferanten für die Bewertung gefunden")
                return []
        
        self.logger.info(f"Bewerte {len(suppliers)} Lieferanten für Produkt: {product.get('product_name', product.get('keyword', 'Unbekannt'))}")
        
        try:
            # Kopiere Lieferanten, um die Originaldaten nicht zu verändern
            scored_suppliers = []
            
            for supplier in suppliers:
                # Kopiere Lieferantendaten
                scored_supplier = supplier.copy()
                
                # Berechne Score-Komponenten
                
                # 1. Preis-Score (niedriger Preis = höherer Score)
                avg_price = product.get('supplier_price', 
                                       np.mean([s['price'] for s in suppliers]))
                price_score = 0
                if avg_price > 0:
                    price_ratio = supplier['price'] / avg_price
                    price_score = max(0, 1 - (price_ratio - 0.8))  # 20% unter Durchschnitt = 1.0
                
                # 2. Bewertungs-Score (höhere Bewertung = höherer Score)
                rating_score = supplier['rating'] / 5.0  # Normalisiere auf 0-1
                
                # 3. Lieferzeit-Score (kürzere Lieferzeit = höherer Score)
                max_delivery = 30  # Maximale akzeptable Lieferzeit in Tagen
                delivery_score = max(0, 1 - (supplier['delivery_days'] / max_delivery))
                
                # Gewichteter Gesamt-Score
                total_score = (
                    self.price_weight * price_score +
                    self.rating_weight * rating_score +
                    self.delivery_weight * delivery_score
                )
                
                # Füge Score zum Lieferanten hinzu
                scored_supplier['price_score'] = round(price_score * 100)
                scored_supplier['rating_score'] = round(rating_score * 100)
                scored_supplier['delivery_score'] = round(delivery_score * 100)
                scored_supplier['total_score'] = round(total_score * 100)
                
                scored_suppliers.append(scored_supplier)
            
            # Sortiere nach Gesamt-Score (absteigend)
            scored_suppliers = sorted(scored_suppliers, key=lambda x: x['total_score'], reverse=True)
            
            self.logger.info(f"Lieferantenbewertung abgeschlossen: Top-Score {scored_suppliers[0]['total_score'] if scored_suppliers else 'N/A'}")
            return scored_suppliers
            
        except Exception as e:
            self.logger.error(f"Fehler bei der Lieferantenbewertung: {e}")
            return []
    
    def find_best_supplier(self, product, suppliers=None):
        """
        Findet den besten Lieferanten für ein Produkt.
        
        Args:
            product (dict): Produktdaten
            suppliers (list, optional): Liste von Lieferanten
            
        Returns:
            dict: Bester Lieferant oder None, wenn keine Lieferanten gefunden wurden
        """
        scored_suppliers = self.score_suppliers(product, suppliers)
        
        if scored_suppliers:
            best_supplier = scored_suppliers[0]
            self.logger.info(f"Bester Lieferant gefunden: {best_supplier['name']} mit Score {best_supplier['total_score']}")
            return best_supplier
        else:
            self.logger.warning("Kein Lieferant gefunden")
            return None
    
    def analyze_supplier_reliability(self, supplier_name, historical_data=None):
        """
        Analysiert die Zuverlässigkeit eines Lieferanten basierend auf historischen Daten.
        
        Args:
            supplier_name (str): Name des Lieferanten
            historical_data (list, optional): Historische Lieferantendaten
            
        Returns:
            dict: Zuverlässigkeitsanalyse
        """
        self.logger.info(f"Analysiere Zuverlässigkeit für Lieferant: {supplier_name}")
        
        try:
            # Hier würden normalerweise historische Daten analysiert werden
            # Da wir keine tatsächlichen Daten haben, simulieren wir die Ergebnisse
            
            # Simulierte Zuverlässigkeitsanalyse
            reliability = {
                'on_time_delivery_rate': round(np.random.uniform(0.7, 0.99), 2),
                'order_accuracy_rate': round(np.random.uniform(0.8, 0.99), 2),
                'quality_consistency': round(np.random.uniform(3.0, 5.0), 1),
                'communication_rating': round(np.random.uniform(3.0, 5.0), 1),
                'avg_shipping_delay': round(np.random.uniform(0, 5), 1),
                'reliability_score': round(np.random.uniform(60, 95))
            }
            
            self.logger.info(f"Zuverlässigkeitsanalyse abgeschlossen für {supplier_name}")
            return reliability
            
        except Exception as e:
            self.logger.error(f"Fehler bei der Zuverlässigkeitsanalyse: {e}")
            return {}
    
    def compare_suppliers(self, product, top_n=3):
        """
        Vergleicht die besten Lieferanten für ein Produkt.
        
        Args:
            product (dict): Produktdaten
            top_n (int): Anzahl der zu vergleichenden Top-Lieferanten
            
        Returns:
            dict: Vergleichsergebnisse
        """
        self.logger.info(f"Vergleiche Top-{top_n} Lieferanten für Produkt: {product.get('product_name', product.get('keyword', 'Unbekannt'))}")
        
        try:
            # Bewerte alle Lieferanten
            scored_suppliers = self.score_suppliers(product)
            
            # Wähle die Top-N Lieferanten
            top_suppliers = scored_suppliers[:min(top_n, len(scored_suppliers))]
            
            # Erstelle Vergleichstabelle
            comparison = {
                'product': product.get('product_name', product.get('keyword', 'Unbekannt')),
                'suppliers': top_suppliers,
                'comparison_factors': [
                    {'name': 'Preis', 'weight': self.price_weight},
                    {'name': 'Bewertung', 'weight': self.rating_weight},
                    {'name': 'Lieferzeit', 'weight': self.delivery_weight}
                ],
                'recommendation': top_suppliers[0] if top_suppliers else None
            }
            
            # Füge Zuverlässigkeitsanalyse für jeden Lieferanten hinzu
            for supplier in comparison['suppliers']:
                supplier['reliability'] = self.analyze_supplier_reliability(supplier['name'])
            
            self.logger.info(f"Lieferantenvergleich abgeschlossen: {len(top_suppliers)} Lieferanten verglichen")
            return comparison
            
        except Exception as e:
            self.logger.error(f"Fehler beim Lieferantenvergleich: {e}")
            return {'product': product.get('product_name', 'Unbekannt'), 'suppliers': [], 'comparison_factors': [], 'recommendation': None}


if __name__ == "__main__":
    # Beispiel für die Verwendung
    scorer = SupplierScorer()
    
    # Beispielprodukt mit Lieferanten
    product = {
        'product_name': 'Smart Watch - Premium Qualität',
        'supplier_price': 25.99,
        'suppliers': [
            {'name': 'Supplier-A', 'price': 22.99, 'rating': 4.2, 'delivery_days': 7},
            {'name': 'Supplier-B', 'price': 24.99, 'rating': 4.7, 'delivery_days': 5},
            {'name': 'Supplier-C', 'price': 19.99, 'rating': 3.8, 'delivery_days': 12}
        ]
    }
    
    # Bewerte Lieferanten
    scored_suppliers = scorer.score_suppliers(product)
    
    print("\nBewertete Lieferanten:")
    for supplier in scored_suppliers:
        print(f"{supplier['name']}: Gesamt-Score {supplier['total_score']}")
        print(f"  Preis: ${supplier['price']} (Score: {supplier['price_score']})")
        print(f"  Bewertung: {supplier['rating']} (Score: {supplier['rating_score']})")
        print(f"  Lieferzeit: {supplier['delivery_days']} Tage (Score: {supplier['delivery_score']})")
        print()
    
    # Finde besten Lieferanten
    best_supplier = scorer.find_best_supplier(product)
    print(f"Bester Lieferant: {best_supplier['name']} mit Score {best_supplier['total_score']}")
