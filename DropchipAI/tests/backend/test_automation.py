"""
Tests für das AutomationManager-Modul.
"""

import unittest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

# Füge das Hauptverzeichnis zum Pfad hinzu, um relative Importe zu ermöglichen
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.core.automation import AutomationManager

class TestAutomationManager(unittest.TestCase):
    """Testklasse für das AutomationManager-Modul."""
    
    def setUp(self):
        """Wird vor jedem Test ausgeführt."""
        self.automation = AutomationManager()
    
    def test_initialization(self):
        """Testet die Initialisierung der AutomationManager-Klasse."""
        # Überprüfe, ob die Attribute korrekt initialisiert wurden
        self.assertEqual(self.automation.active_jobs, [])
        self.assertEqual(self.automation.job_history, [])
    
    @patch('builtins.print')
    def test_schedule_job(self, mock_print):
        """Testet die schedule_job-Methode."""
        # Methode aufrufen
        job_id = self.automation.schedule_job('product_research', {'keywords': ['Smart Watch']})
        
        # Überprüfen, ob der print-Aufruf korrekt ist
        mock_print.assert_called_with(f"Job {job_id} vom Typ product_research geplant")
        
        # Überprüfen, ob der Job korrekt geplant wurde
        self.assertEqual(len(self.automation.active_jobs), 1)
        self.assertEqual(self.automation.active_jobs[0]['id'], job_id)
        self.assertEqual(self.automation.active_jobs[0]['type'], 'product_research')
        self.assertEqual(self.automation.active_jobs[0]['parameters'], {'keywords': ['Smart Watch']})
        self.assertEqual(self.automation.active_jobs[0]['status'], 'scheduled')
        self.assertIsNone(self.automation.active_jobs[0]['results'])
    
    def test_get_job_status_active(self):
        """Testet die get_job_status-Methode für aktive Jobs."""
        # Job planen
        job_id = self.automation.schedule_job('product_research')
        
        # Methode aufrufen
        job = self.automation.get_job_status(job_id)
        
        # Überprüfen, ob der Job korrekt zurückgegeben wurde
        self.assertEqual(job['id'], job_id)
        self.assertEqual(job['type'], 'product_research')
        self.assertEqual(job['status'], 'scheduled')
    
    def test_get_job_status_history(self):
        """Testet die get_job_status-Methode für Jobs in der Historie."""
        # Job planen und in die Historie verschieben
        job_id = self.automation.schedule_job('product_research')
        self.automation.active_jobs[0]['status'] = 'completed'
        self.automation.job_history.append(self.automation.active_jobs[0])
        self.automation.active_jobs.pop(0)
        
        # Methode aufrufen
        job = self.automation.get_job_status(job_id)
        
        # Überprüfen, ob der Job korrekt zurückgegeben wurde
        self.assertEqual(job['id'], job_id)
        self.assertEqual(job['type'], 'product_research')
        self.assertEqual(job['status'], 'completed')
    
    def test_get_job_status_not_found(self):
        """Testet die get_job_status-Methode für nicht vorhandene Jobs."""
        # Methode aufrufen
        job = self.automation.get_job_status('non_existent_job')
        
        # Überprüfen, ob None zurückgegeben wurde
        self.assertIsNone(job)
    
    @patch('builtins.print')
    def test_cancel_job(self, mock_print):
        """Testet die cancel_job-Methode."""
        # Job planen
        job_id = self.automation.schedule_job('product_research')
        
        # Methode aufrufen
        result = self.automation.cancel_job(job_id)
        
        # Überprüfen, ob der print-Aufruf korrekt ist
        mock_print.assert_called_with(f"Job {job_id} abgebrochen")
        
        # Überprüfen, ob der Job korrekt abgebrochen wurde
        self.assertTrue(result)
        self.assertEqual(len(self.automation.active_jobs), 0)
        self.assertEqual(len(self.automation.job_history), 1)
        self.assertEqual(self.automation.job_history[0]['id'], job_id)
        self.assertEqual(self.automation.job_history[0]['status'], 'cancelled')
    
    def test_cancel_job_not_found(self):
        """Testet die cancel_job-Methode für nicht vorhandene Jobs."""
        # Methode aufrufen
        result = self.automation.cancel_job('non_existent_job')
        
        # Überprüfen, ob False zurückgegeben wurde
        self.assertFalse(result)
    
    @patch('builtins.print')
    def test_execute_all_jobs_empty(self, mock_print):
        """Testet die execute_all_jobs-Methode ohne aktive Jobs."""
        # Methode aufrufen
        result = self.automation.execute_all_jobs()
        
        # Überprüfen, ob der print-Aufruf korrekt ist
        mock_print.assert_called_with("Keine aktiven Jobs vorhanden")
        
        # Überprüfen, ob das Ergebnis 0 ist
        self.assertEqual(result, 0)
    
    @patch('builtins.print')
    def test_execute_all_jobs(self, mock_print):
        """Testet die execute_all_jobs-Methode mit aktiven Jobs."""
        # Jobs planen
        job_id1 = self.automation.schedule_job('product_research')
        job_id2 = self.automation.schedule_job('listing_creation')
        
        # Methode aufrufen
        result = self.automation.execute_all_jobs()
        
        # Überprüfen, ob die print-Aufrufe korrekt sind
        mock_print.assert_any_call(f"Führe Job {job_id1} vom Typ product_research aus...")
        mock_print.assert_any_call(f"Führe Job {job_id2} vom Typ listing_creation aus...")
        mock_print.assert_called_with("2 Jobs ausgeführt")
        
        # Überprüfen, ob das Ergebnis 2 ist
        self.assertEqual(result, 2)
        
        # Überprüfen, ob die Jobs korrekt ausgeführt wurden
        self.assertEqual(len(self.automation.active_jobs), 0)
        self.assertEqual(len(self.automation.job_history), 2)
        self.assertEqual(self.automation.job_history[0]['id'], job_id1)
        self.assertEqual(self.automation.job_history[0]['status'], 'completed')
        self.assertEqual(self.automation.job_history[1]['id'], job_id2)
        self.assertEqual(self.automation.job_history[1]['status'], 'completed')


if __name__ == '__main__':
    unittest.main()
