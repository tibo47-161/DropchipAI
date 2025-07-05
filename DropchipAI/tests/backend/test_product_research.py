"""
Tests für das ProductResearch-Modul.
"""

import unittest
import sys
from pathlib import Path
import pandas as pd

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.ai.product_research import ProductResearch

class TestProductResearch(unittest.TestCase):
    """Testklasse für das ProductResearch-Modul."""
    
    def setUp(self):
        """Wird vor jedem Test ausgeführt."""
        self.research = ProductResearch()
        self.test_keywords = ["Smart Watch", "Wireless Earbuds"]
    
    def test_find_trending_products(self):
        """Testet die Methode find_trending_products."""
        trending_products = self.research.find_trending_products(self.test_keywords)
        
        # Überprüfe, ob ein DataFrame zurückgegeben wird
        self.assertIsInstance(trending_products, pd.DataFrame)
        
        # Überprüfe, ob die erwarteten Spalten vorhanden sind
        self.assertIn('keyword', trending_products.columns)
        self.assertIn('trend_score', trending_products.columns)
        
        # Überprüfe, ob Daten für die angegebenen Keywords zurückgegeben werden
        for keyword in self.test_keywords:
            self.assertIn(keyword, trending_products['keyword'].values)
    
    def test_find_profitable_products(self):
        """Testet die Methode find_profitable_products."""
        # Erstelle ein Test-DataFrame für trendige Produkte
        trending_data = pd.DataFrame({
            'keyword': self.test_keywords,
            'trend_score': [80, 75]
        })
        
        profitable_products = self.research.find_profitable_products(trending_data)
        
        # Überprüfe, ob ein DataFrame zurückgegeben wird
        self.assertIsInstance(profitable_products, pd.DataFrame)
        
        # Überprüfe, ob die erwarteten Spalten vorhanden sind
        self.assertIn('keyword', profitable_products.columns)
        self.assertIn('trend_score', profitable_products.columns)
        self.assertIn('profit_margin', profitable_products.columns)
        self.assertIn('suppliers', profitable_products.columns)
        
        # Überprüfe, ob die Gewinnmarge mindestens dem Mindestwert entspricht
        min_margin = self.research.min_profit_margin
        for margin in profitable_products['profit_margin']:
            self.assertGreaterEqual(margin, min_margin)
    
    def test_analyze_competition(self):
        """Testet die Methode analyze_competition."""
        competition_data = self.research.analyze_competition(self.test_keywords)
        
        # Überprüfe, ob ein Dictionary zurückgegeben wird
        self.assertIsInstance(competition_data, dict)
        
        # Überprüfe, ob Daten für die angegebenen Keywords zurückgegeben werden
        for keyword in self.test_keywords:
            self.assertIn(keyword, competition_data)
            
            # Überprüfe, ob die erwarteten Schlüssel vorhanden sind
            keyword_data = competition_data[keyword]
            self.assertIn('num_competitors', keyword_data)
            self.assertIn('avg_price', keyword_data)
            self.assertIn('competition_level', keyword_data)
            self.assertIn('top_competitors', keyword_data)
    
    def test_get_product_details(self):
        """Testet die Methode get_product_details."""
        keyword = self.test_keywords[0]
        product_details = self.research.get_product_details(keyword)
        
        # Überprüfe, ob ein Dictionary zurückgegeben wird
        self.assertIsInstance(product_details, dict)
        
        # Überprüfe, ob die erwarteten Schlüssel vorhanden sind
        self.assertIn('name', product_details)
        self.assertIn('description', product_details)
        self.assertIn('features', product_details)
        self.assertIn('specifications', product_details)
        self.assertIn('images', product_details)
        
        # Überprüfe, ob der Name das Keyword enthält
        self.assertIn(keyword, product_details['name'])
    
    def test_full_product_research(self):
        """Testet die Methode full_product_research."""
        results = self.research.full_product_research(self.test_keywords)
        
        # Überprüfe, ob ein DataFrame zurückgegeben wird
        self.assertIsInstance(results, pd.DataFrame)
        
        # Überprüfe, ob die erwarteten Spalten vorhanden sind
        expected_columns = ['keyword', 'trend_score', 'profit_margin', 'suppliers', 
                           'competition', 'details', 'combined_score']
        for column in expected_columns:
            self.assertIn(column, results.columns)
        
        # Überprüfe, ob die Ergebnisse nach combined_score sortiert sind
        scores = results['combined_score'].tolist()
        self.assertEqual(scores, sorted(scores, reverse=True))


if __name__ == '__main__':
    unittest.main()
