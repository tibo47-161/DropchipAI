"""
Tests für das SupplierScorer-Modul.
"""

import unittest
import sys
from pathlib import Path

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.ai.supplier_scorer import SupplierScorer

class TestSupplierScorer(unittest.TestCase):
    """Testklasse für das SupplierScorer-Modul."""
    
    def setUp(self):
        """Wird vor jedem Test ausgeführt."""
        self.scorer = SupplierScorer()
        
        # Testprodukt mit Lieferanten
        self.test_product = {
            'product_name': 'Smart Watch - Premium Qualität',
            'supplier_price': 25.99,
            'suppliers': [
                {'name': 'Supplier-A', 'price': 22.99, 'rating': 4.2, 'delivery_days': 7},
                {'name': 'Supplier-B', 'price': 24.99, 'rating': 4.7, 'delivery_days': 5},
                {'name': 'Supplier-C', 'price': 19.99, 'rating': 3.8, 'delivery_days': 12}
            ]
        }
    
    def test_score_suppliers(self):
        """Testet die Methode score_suppliers."""
        scored_suppliers = self.scorer.score_suppliers(self.test_product)
        
        # Überprüfe, ob eine Liste zurückgegeben wird
        self.assertIsInstance(scored_suppliers, list)
        
        # Überprüfe, ob die Liste nicht leer ist
        self.assertGreater(len(scored_suppliers), 0)
        
        # Überprüfe, ob alle Lieferanten bewertet wurden
        self.assertEqual(len(scored_suppliers), len(self.test_product['suppliers']))
        
        # Überprüfe, ob die erwarteten Schlüssel vorhanden sind
        for supplier in scored_suppliers:
            self.assertIn('name', supplier)
            self.assertIn('price', supplier)
            self.assertIn('rating', supplier)
            self.assertIn('delivery_days', supplier)
            self.assertIn('price_score', supplier)
            self.assertIn('rating_score', supplier)
            self.assertIn('delivery_score', supplier)
            self.assertIn('total_score', supplier)
        
        # Überprüfe, ob die Lieferanten nach Gesamt-Score sortiert sind
        scores = [supplier['total_score'] for supplier in scored_suppliers]
        self.assertEqual(scores, sorted(scores, reverse=True))
    
    def test_find_best_supplier(self):
        """Testet die Methode find_best_supplier."""
        best_supplier = self.scorer.find_best_supplier(self.test_product)
        
        # Überprüfe, ob ein Dictionary zurückgegeben wird
        self.assertIsInstance(best_supplier, dict)
        
        # Überprüfe, ob die erwarteten Schlüssel vorhanden sind
        self.assertIn('name', best_supplier)
        self.assertIn('price', best_supplier)
        self.assertIn('rating', best_supplier)
        self.assertIn('delivery_days', best_supplier)
        self.assertIn('total_score', best_supplier)
        
        # Überprüfe, ob der beste Lieferant tatsächlich den höchsten Score hat
        scored_suppliers = self.scorer.score_suppliers(self.test_product)
        highest_score = max(supplier['total_score'] for supplier in scored_suppliers)
        self.assertEqual(best_supplier['total_score'], highest_score)
    
    def test_analyze_supplier_reliability(self):
        """Testet die Methode analyze_supplier_reliability."""
        supplier_name = self.test_product['suppliers'][0]['name']
        reliability = self.scorer.analyze_supplier_reliability(supplier_name)
        
        # Überprüfe, ob ein Dictionary zurückgegeben wird
        self.assertIsInstance(reliability, dict)
        
        # Überprüfe, ob die erwarteten Schlüssel vorhanden sind
        self.assertIn('on_time_delivery_rate', reliability)
        self.assertIn('order_accuracy_rate', reliability)
        self.assertIn('quality_consistency', reliability)
        self.assertIn('communication_rating', reliability)
        self.assertIn('reliability_score', reliability)
    
    def test_compare_suppliers(self):
        """Testet die Methode compare_suppliers."""
        comparison = self.scorer.compare_suppliers(self.test_product, top_n=2)
        
        # Überprüfe, ob ein Dictionary zurückgegeben wird
        self.assertIsInstance(comparison, dict)
        
        # Überprüfe, ob die erwarteten Schlüssel vorhanden sind
        self.assertIn('product', comparison)
        self.assertIn('suppliers', comparison)
        self.assertIn('comparison_factors', comparison)
        self.assertIn('recommendation', comparison)
        
        # Überprüfe, ob die richtige Anzahl von Lieferanten verglichen wurde
        self.assertEqual(len(comparison['suppliers']), 2)
        
        # Überprüfe, ob die Lieferanten nach Gesamt-Score sortiert sind
        if comparison['suppliers']:
            scores = [supplier['total_score'] for supplier in comparison['suppliers']]
            self.assertEqual(scores, sorted(scores, reverse=True))
        
        # Überprüfe, ob die Empfehlung dem besten Lieferanten entspricht
        if comparison['suppliers'] and comparison['recommendation']:
            self.assertEqual(comparison['recommendation'], comparison['suppliers'][0])


if __name__ == '__main__':
    unittest.main()
