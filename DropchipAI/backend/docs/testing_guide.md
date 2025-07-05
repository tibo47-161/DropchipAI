# DropchipAi Testanleitung

Diese Anleitung führt Sie durch das Testen der verschiedenen Funktionen des DropchipAi-Systems, nachdem Sie es erfolgreich installiert haben.

## Inhaltsverzeichnis

1. [Vorbereitung](#vorbereitung)
2. [Testen der Benutzeroberfläche](#testen-der-benutzeroberfläche)
3. [Testen der Produktrecherche](#testen-der-produktrecherche)
4. [Testen der Lieferantenbewertung](#testen-der-lieferantenbewertung)
5. [Testen der Bestandsüberwachung](#testen-der-bestandsüberwachung)
6. [Testen der Workflow-Automatisierung](#testen-der-workflow-automatisierung)
7. [Testen der E-Commerce-Integrationen](#testen-der-e-commerce-integrationen)
8. [Testen der Analysen und Berichte](#testen-der-analysen-und-berichte)
9. [Testen der Abonnementverwaltung](#testen-der-abonnementverwaltung)
10. [Leistungstests](#leistungstests)

## Vorbereitung

Bevor Sie mit dem Testen beginnen, stellen Sie sicher, dass:

1. Backend und Frontend erfolgreich installiert sind und laufen
2. Sie ein Testkonto erstellt haben
3. Sie sich erfolgreich anmelden können
4. Sie Zugriff auf das Dashboard haben

## Testen der Benutzeroberfläche

### Dashboard-Test

1. **Allgemeine Ansicht prüfen**
   - Überprüfen Sie, ob alle Widgets korrekt angezeigt werden
   - Testen Sie die Responsivität durch Ändern der Fenstergröße
   - Prüfen Sie, ob die Daten korrekt geladen werden

2. **Dark/Light Mode testen**
   - Klicken Sie auf das Theme-Symbol in der oberen Leiste
   - Überprüfen Sie, ob die Umschaltung zwischen Hell- und Dunkelmodus funktioniert
   - Prüfen Sie, ob alle Elemente in beiden Modi korrekt dargestellt werden

3. **Navigation testen**
   - Klicken Sie auf alle Hauptmenüpunkte in der Seitenleiste
   - Überprüfen Sie, ob die entsprechenden Seiten korrekt geladen werden
   - Testen Sie die Breadcrumb-Navigation für die Rückkehr zu vorherigen Seiten

## Testen der Produktrecherche

### Grundlegende Produktsuche

1. **Suchfunktion testen**
   - Navigieren Sie zum Bereich "Produktrecherche"
   - Geben Sie verschiedene Suchbegriffe ein (z.B. "Smart Watch", "Wireless Earbuds")
   - Überprüfen Sie, ob Suchergebnisse angezeigt werden

2. **Filter testen**
   - Filtern Sie nach Kategorie (z.B. Elektronik, Mode)
   - Filtern Sie nach Preisspanne
   - Filtern Sie nach Trendwert
   - Überprüfen Sie, ob die Ergebnisse korrekt gefiltert werden

### Erweiterte Produktanalyse

1. **Produktdetails prüfen**
   - Klicken Sie auf ein Produkt in den Suchergebnissen
   - Überprüfen Sie, ob die Detailansicht korrekt geladen wird
   - Prüfen Sie, ob alle Produktinformationen angezeigt werden

2. **Marktanalyse testen**
   - Wechseln Sie zum Tab "Marktanalyse"
   - Überprüfen Sie, ob die Google Trends-Daten angezeigt werden
   - Prüfen Sie, ob die saisonalen Nachfragemuster dargestellt werden
   - Überprüfen Sie die geografische Verteilung der Nachfrage

3. **Gewinnmargenberechnung testen**
   - Überprüfen Sie die automatische Gewinnmargenberechnung
   - Ändern Sie Parameter wie Einkaufspreis oder Verkaufspreis
   - Prüfen Sie, ob die Marge korrekt neu berechnet wird

## Testen der Lieferantenbewertung

### Lieferantenvergleich

1. **Lieferantenliste prüfen**
   - Navigieren Sie zum Bereich "Lieferantenbewertung"
   - Wählen Sie ein Produkt aus oder suchen Sie nach einem
   - Überprüfen Sie, ob Lieferanten für das Produkt angezeigt werden

2. **Vergleichsfunktion testen**
   - Wählen Sie mehrere Lieferanten aus
   - Klicken Sie auf "Vergleichen"
   - Überprüfen Sie, ob die Vergleichstabelle korrekt angezeigt wird

### Lieferantenbewertung

1. **Bewertungskriterien prüfen**
   - Überprüfen Sie, ob alle Bewertungskriterien angezeigt werden
   - Prüfen Sie, ob die Gesamtbewertung korrekt berechnet wird

2. **Lieferantendetails prüfen**
   - Klicken Sie auf einen Lieferanten
   - Überprüfen Sie, ob die Detailansicht korrekt geladen wird
   - Prüfen Sie, ob die Leistungshistorie angezeigt wird

3. **Favoriten-Funktion testen**
   - Klicken Sie auf "Zu Favoriten hinzufügen"
   - Navigieren Sie zu Ihren Favoriten
   - Überprüfen Sie, ob der Lieferant in der Favoritenliste erscheint

## Testen der Bestandsüberwachung

### Bestandsübersicht

1. **Produktliste prüfen**
   - Navigieren Sie zum Bereich "Bestandsüberwachung"
   - Überprüfen Sie, ob alle Produkte mit Bestandsinformationen angezeigt werden

2. **Filterfunktionen testen**
   - Filtern Sie nach Status (auf Lager, niedriger Bestand, nicht auf Lager)
   - Verwenden Sie die Suchfunktion
   - Überprüfen Sie, ob die Ergebnisse korrekt gefiltert werden

### Preisvergleich

1. **Wettbewerberpreise prüfen**
   - Wählen Sie ein Produkt aus
   - Überprüfen Sie, ob Wettbewerberpreise angezeigt werden
   - Prüfen Sie, ob das Preishistorie-Diagramm korrekt dargestellt wird

2. **Benachrichtigungen einrichten**
   - Klicken Sie auf "Benachrichtigungen einrichten"
   - Konfigurieren Sie verschiedene Benachrichtigungstypen
   - Speichern Sie die Einstellungen
   - Überprüfen Sie, ob die Benachrichtigungen korrekt gespeichert werden

## Testen der Workflow-Automatisierung

### Workflow-Erstellung

1. **Neuen Workflow erstellen**
   - Navigieren Sie zum Bereich "Workflow-Automatisierung"
   - Klicken Sie auf "Neuer Workflow"
   - Geben Sie einen Namen und eine Beschreibung ein

2. **Trigger konfigurieren**
   - Wählen Sie einen Trigger-Typ (Zeitplan oder Ereignis)
   - Konfigurieren Sie die Trigger-Einstellungen
   - Überprüfen Sie, ob die Einstellungen korrekt gespeichert werden

3. **Aktionen hinzufügen**
   - Fügen Sie verschiedene Aktionstypen hinzu
   - Konfigurieren Sie die Aktionseinstellungen
   - Überprüfen Sie, ob die Aktionen korrekt hinzugefügt werden

### Workflow-Verwaltung

1. **Workflow-Übersicht prüfen**
   - Überprüfen Sie, ob alle erstellten Workflows angezeigt werden
   - Prüfen Sie, ob Status und letzte Ausführung korrekt angezeigt werden

2. **Workflow-Steuerung testen**
   - Testen Sie die Schaltflächen "Pausieren", "Aktivieren", "Jetzt ausführen"
   - Überprüfen Sie, ob die Aktionen korrekt ausgeführt werden

3. **Workflow-Ausführung überwachen**
   - Führen Sie einen Workflow aus
   - Überprüfen Sie die Ausführungsstatistiken
   - Prüfen Sie, ob die Ergebnisse korrekt angezeigt werden

## Testen der E-Commerce-Integrationen

### Shopify-Integration

1. **Verbindung einrichten**
   - Navigieren Sie zu "Integrationen" > "Shopify"
   - Klicken Sie auf "Verbinden"
   - Folgen Sie den Anweisungen zur Verbindung Ihres Test-Shopify-Stores
   - Überprüfen Sie, ob die Verbindung erfolgreich hergestellt wird

2. **Produktsynchronisation testen**
   - Wählen Sie ein Produkt aus der Produktrecherche
   - Klicken Sie auf "Zu Shopify hinzufügen"
   - Überprüfen Sie, ob das Produkt korrekt in Shopify erstellt wird

3. **Bestellsynchronisation prüfen**
   - Erstellen Sie eine Testbestellung in Shopify
   - Überprüfen Sie, ob die Bestellung in DropchipAi angezeigt wird

### eBay-Integration

1. **Verbindung einrichten**
   - Navigieren Sie zu "Integrationen" > "eBay"
   - Klicken Sie auf "Verbinden"
   - Folgen Sie den Anweisungen zur Verbindung Ihres Test-eBay-Kontos
   - Überprüfen Sie, ob die Verbindung erfolgreich hergestellt wird

2. **Listing-Erstellung testen**
   - Wählen Sie ein Produkt aus der Produktrecherche
   - Klicken Sie auf "Auf eBay listen"
   - Überprüfen Sie, ob das Listing korrekt in eBay erstellt wird

3. **Bestandssynchronisation prüfen**
   - Ändern Sie den Bestand eines Produkts in DropchipAi
   - Überprüfen Sie, ob der Bestand in eBay aktualisiert wird

## Testen der Analysen und Berichte

### Umsatz- und Gewinnberichte

1. **Berichtsansicht prüfen**
   - Navigieren Sie zum Bereich "Analysen"
   - Wählen Sie den Tab "Umsatz & Gewinn"
   - Überprüfen Sie, ob alle Diagramme und Tabellen korrekt angezeigt werden

2. **Filterfunktionen testen**
   - Ändern Sie den Zeitraum (z.B. letzte Woche, letzter Monat)
   - Filtern Sie nach Produktkategorie oder Plattform
   - Überprüfen Sie, ob die Daten korrekt gefiltert werden

### Produktleistung

1. **Produktleistungsberichte prüfen**
   - Wählen Sie den Tab "Produktleistung"
   - Überprüfen Sie, ob Verkaufszahlen, Bewertungen und andere Metriken angezeigt werden

2. **Sortier- und Filterfunktionen testen**
   - Sortieren Sie nach verschiedenen Kriterien
   - Filtern Sie nach Produktstatus oder Kategorie
   - Überprüfen Sie, ob die Ergebnisse korrekt sortiert und gefiltert werden

### Lieferantenleistung

1. **Lieferantenleistungsberichte prüfen**
   - Wählen Sie den Tab "Lieferantenleistung"
   - Überprüfen Sie, ob das Lieferantenranking und andere Metriken angezeigt werden

2. **Detailansicht testen**
   - Klicken Sie auf einen Lieferanten
   - Überprüfen Sie, ob die detaillierten Leistungsmetriken angezeigt werden

## Testen der Abonnementverwaltung

### Profilverwaltung

1. **Profileinstellungen prüfen**
   - Klicken Sie auf Ihren Namen in der oberen rechten Ecke
   - Wählen Sie "Profil"
   - Überprüfen Sie, ob alle persönlichen Informationen angezeigt werden

2. **Profiländerungen testen**
   - Ändern Sie verschiedene Profilinformationen
   - Speichern Sie die Änderungen
   - Überprüfen Sie, ob die Änderungen korrekt gespeichert werden

### Abonnementverwaltung

1. **Abonnementinformationen prüfen**
   - Navigieren Sie zu "Konto" > "Abonnement"
   - Überprüfen Sie, ob Ihr aktueller Plan angezeigt wird

2. **Plan-Upgrade testen**
   - Klicken Sie auf "Upgrade"
   - Wählen Sie einen höheren Plan
   - Folgen Sie dem Upgrade-Prozess (ohne tatsächlich zu bezahlen)
   - Überprüfen Sie, ob der Prozess korrekt funktioniert

3. **Token-Verwaltung prüfen**
   - Überprüfen Sie Ihre Token-Nutzung
   - Testen Sie den Prozess zum Kauf zusätzlicher Tokens (ohne tatsächlich zu bezahlen)

## Leistungstests

### Ladezeiten

1. **Seitenladung messen**
   - Öffnen Sie die Browser-Entwicklertools (F12)
   - Wechseln Sie zum Tab "Netzwerk"
   - Laden Sie verschiedene Seiten und messen Sie die Ladezeiten

2. **API-Antwortzeiten prüfen**
   - Beobachten Sie die API-Aufrufe in den Entwicklertools
   - Notieren Sie die Antwortzeiten für verschiedene Anfragen

### Gleichzeitige Benutzer

1. **Mehrere Tabs öffnen**
   - Öffnen Sie mehrere Browser-Tabs mit verschiedenen Funktionen
   - Überprüfen Sie, ob alle Funktionen weiterhin korrekt arbeiten

2. **Mehrere Aktionen gleichzeitig ausführen**
   - Starten Sie mehrere Aktionen gleichzeitig (z.B. Produktsuche, Workflow-Ausführung)
   - Überprüfen Sie, ob alle Aktionen korrekt abgeschlossen werden

## Abschließende Überprüfung

Nach dem Testen aller Funktionen:

1. **Fehlerprotokoll prüfen**
   - Überprüfen Sie die Backend-Logs auf Fehler oder Warnungen
   - Prüfen Sie die Browser-Konsole auf JavaScript-Fehler

2. **Benutzerfreundlichkeit bewerten**
   - Bewerten Sie die allgemeine Benutzerfreundlichkeit
   - Notieren Sie Verbesserungsvorschläge

3. **Funktionsabdeckung überprüfen**
   - Stellen Sie sicher, dass alle Hauptfunktionen getestet wurden
   - Identifizieren Sie Bereiche, die weiteres Testen erfordern

Diese Testanleitung deckt die wichtigsten Funktionen des DropchipAi-Systems ab. Für spezifischere Tests oder automatisierte Testszenarien können Sie die Testdateien im `tests`-Verzeichnis verwenden.
