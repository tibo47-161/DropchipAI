"""
Tests für das Core-Modul.
"""

import unittest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.core import DropchipCore

class TestDropchipCore(unittest.TestCase):
    """Testklasse für das Core-Modul."""
    
    def setUp(self):
        """Wird vor jedem Test ausgeführt."""
        self.core = DropchipCore()
    
    def test_initialization(self):
        """Testet die Initialisierung der DropchipCore-Klasse."""
        # Überprüfe, ob die Attribute korrekt initialisiert wurden
        self.assertIsNone(self.core.product_research)
        self.assertIsNone(self.core.supplier_scorer)
        self.assertIsNone(self.core.listing_gen)
        self.assertIsNone(self.core.shopify)
        self.assertIsNone(self.core.ebay)
        self.assertIsNone(self.core.price_comp)
        self.assertIsNone(self.core.trends)
    
    @patch('builtins.print')
    def test_full_automation_with_missing_modules(self, mock_print):
        """Testet die full_automation-Methode mit fehlenden Modulen."""
        # Methode aufrufen
        result = self.core.full_automation(["Smart Watch", "Wireless Earbuds"])
        
        # Überprüfen, ob die Warnung ausgegeben wurde
        mock_print.assert_called_with("Nicht alle Module sind implementiert. Vollständige Automatisierung nicht möglich.")
        
        # Überprüfen, ob das Ergebnis 0 ist
        self.assertEqual(result, 0)
    
    @patch('builtins.print')
    def test_full_automation_with_mocked_modules(self, mock_print):
        """Testet die full_automation-Methode mit gemockten Modulen."""
        # Mocks für die Module erstellen
        self.core.product_research = MagicMock()
        self.core.supplier_scorer = MagicMock()
        self.core.listing_gen = MagicMock()
        self.core.shopify = MagicMock()
        self.core.ebay = MagicMock()
        self.core.price_comp = MagicMock()
        self.core.trends = MagicMock()
        
        # Methode aufrufen
        result = self.core.full_automation(["Smart Watch", "Wireless Earbuds"])
        
        # Überprüfen, ob das Ergebnis 2 ist (2 Produkte)
        self.assertEqual(result, 2)
        
        # Überprüfen, ob die print-Aufrufe korrekt sind
        mock_print.assert_any_call("Analysiere Trends für Keywords: ['Smart Watch', 'Wireless Earbuds']")
        mock_print.assert_any_call("Bewerte Lieferanten für 2 Produkte")
        mock_print.assert_any_call("Optimiere Preise basierend auf Wettbewerbsanalyse")
        mock_print.assert_any_call("Generiere Produktbeschreibungen")
        mock_print.assert_any_call("Veröffentliche 2 Produkte auf Shopify und eBay")
        mock_print.assert_any_call("Automatisierung abgeschlossen: 2 Produkte verarbeitet")
    
    @patch('builtins.print')
    def test_research_products(self, mock_print):
        """Testet die research_products-Methode."""
        # Methode aufrufen
        result = self.core.research_products(["Smart Watch", "Wireless Earbuds"])
        
        # Überprüfen, ob der print-Aufruf korrekt ist
        mock_print.assert_called_with("Recherchiere Produkte für Keywords: ['Smart Watch', 'Wireless Earbuds']")
        
        # Überprüfen, ob das Ergebnis eine leere Liste ist
        self.assertEqual(result, [])
    
    @patch('builtins.print')
    def test_optimize_prices(self, mock_print):
        """Testet die optimize_prices-Methode."""
        # Testdaten
        products = [
            {"name": "Smart Watch", "price": 29.99},
            {"name": "Wireless Earbuds", "price": 19.99}
        ]
        
        # Methode aufrufen
        result = self.core.optimize_prices(products)
        
        # Überprüfen, ob der print-Aufruf korrekt ist
        mock_print.assert_called_with("Optimiere Preise für 2 Produkte")
        
        # Überprüfen, ob das Ergebnis die Eingabeliste ist
        self.assertEqual(result, products)


if __name__ == '__main__':
    unittest.main()