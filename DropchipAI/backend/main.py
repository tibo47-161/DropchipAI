# -*- coding: utf-8 -*-
# DropchipAI Main Module
# Dieses Modul dient als Einstiegspunkt fuer die DropchipAI-Anwendung.

import os
import sys
from pathlib import Path

# Add the current directory to Python path for imports
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    from src.core.DropchipCore import DropchipCore
    from src.core.config_manager import ConfigManager
    from src.utils.logger import Logger
    from fastapi import FastAPI, Response
    from fastapi.middleware.cors import CORSMiddleware
    from src.api import auth, subscription
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    raise

app = FastAPI(title="DropchipAI API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(subscription.router, prefix="/api/subscription", tags=["Subscription"])

@app.get("/")
async def root():
    return {"message": "DropchipAI API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "python_version": sys.version}

@app.options("/api/auth/login")
async def options_login():
    return Response(status_code=200)

# CLI functionality (only if run directly)
def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='DropchipAi - KI-gestuetzte Dropshipping-Automatisierung')
    parser.add_argument('--config', type=str, help='Pfad zur Konfigurationsdatei')
    parser.add_argument('--log-level', type=str, default='INFO', 
                        choices=['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'],
                        help='Log-Level (DEBUG, INFO, WARNING, ERROR, CRITICAL)')
    parser.add_argument('--keywords', type=str, nargs='+', 
                        help='Schluesselwoerter fuer die Produktrecherche')
    
    args = parser.parse_args()
    
    # Logger initialisieren
    logger = Logger(log_level=args.log_level)
    logger.info("DropchipAi wird gestartet...")
    
    # Konfiguration laden
    config_manager = ConfigManager(args.config)
    
    # DropchipCore initialisieren
    core = DropchipCore()
    
    # Wenn Schluesselwoerter angegeben wurden, fuehre Automatisierung durch
    if args.keywords:
        logger.info(f"Starte Automatisierung mit Keywords: {args.keywords}")
        result = core.full_automation(args.keywords)
        logger.info(f"Automatisierung abgeschlossen: {result} Produkte verarbeitet")
    else:
        logger.info("Keine Keywords angegeben. Verwende --keywords, um die Automatisierung zu starten.")
        print("Verwendung: python main.py --keywords 'Smart Watch' 'Wireless Earbuds'")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)