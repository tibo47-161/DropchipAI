# Vercel Deployment Guide

## Automatisches Frontend-Deployment mit GitHub Actions

### Voraussetzungen
- GitHub Repository
- Vercel Account (kostenlos)

### Setup-Schritte

#### 1. Vercel Account erstellen
1. Gehe zu [vercel.com](https://vercel.com)
2. Registriere dich mit deinem GitHub-Account
3. Importiere dein Repository

#### 2. Vercel Secrets in GitHub einrichten
Gehe zu deinem GitHub Repository → Settings → Secrets and variables → Actions

Füge diese Secrets hinzu:
- `VERCEL_TOKEN`: Dein Vercel API Token
- `VERCEL_ORG_ID`: Deine Vercel Organization ID  
- `VERCEL_PROJECT_ID`: Deine Vercel Project ID

#### 3. Vercel Token generieren
1. Gehe zu [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Erstelle ein neues Token
3. Kopiere es in das `VERCEL_TOKEN` Secret

#### 4. Project ID finden
1. Gehe zu deinem Vercel Dashboard
2. Wähle dein Projekt
3. Gehe zu Settings → General
4. Kopiere die Project ID

#### 5. Organization ID finden
1. Gehe zu [vercel.com/account](https://vercel.com/account)
2. Kopiere deine Team ID (das ist die Org ID)

### Deployment
Nach dem Setup wird bei jedem Push auf `main` automatisch deployed!

### Features
- Automatisches Deploy bei Push
- Preview-Deployments für Pull Requests
- Automatische Tests vor Deploy
- HTTPS/SSL automatisch
- CDN für schnelle Ladezeiten

### URLs
- **Production**: `https://your-project.vercel.app`
- **Preview**: Automatisch für jeden PR

### Troubleshooting
- Falls Tests fehlschlagen, wird nicht deployed
- Prüfe die GitHub Actions Logs bei Problemen
- Vercel Logs findest du im Vercel Dashboard 