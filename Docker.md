# DropchipAI Docker Setup

This document provides instructions for running DropchipAI using Docker containers.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- At least 4GB of available RAM
- 10GB of available disk space

## Quick Start

### Development Environment

1. **Clone and navigate to the project directory:**
   ```bash
   cd DropchipAI_v1.0_PREMIERE_READY
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Production Environment

1. **Set up environment variables:**
   ```bash
   # Create .env file
   echo "DB_PASSWORD=your_secure_password_here" > .env
   ```

2. **Build and start production services:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

## Service Architecture

### Frontend (React)
- **Port:** 80
- **Container:** dropchipai-frontend
- **Technology:** React + Nginx
- **Features:** 
  - SPA with React Router
  - Tailwind CSS styling
  - API proxy to backend

### Backend (FastAPI)
- **Port:** 8000
- **Container:** dropchipai-backend
- **Technology:** Python 3.11 + FastAPI
- **Features:**
  - RESTful API
  - Authentication system
  - AI-powered product research
  - eBay/Shopify integration

### Database
- **Development:** SQLite (file-based)
- **Production:** PostgreSQL
- **Container:** dropchipai-db

## Docker Commands

### Basic Operations

```bash
# Start services
docker-compose up

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Rebuild and restart
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v
```

### Individual Service Management

```bash
# Start only backend
docker-compose up backend

# Restart specific service
docker-compose restart backend

# Execute commands in running container
docker-compose exec backend python main.py --help
docker-compose exec frontend sh

# View container status
docker-compose ps
```

### Production Commands

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs

# Scale services (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale backend=2
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_PASSWORD=your_secure_password

# API Keys (if needed)
EBAY_API_KEY=your_ebay_key
SHOPIFY_API_KEY=your_shopify_key

# Application settings
LOG_LEVEL=INFO
DEBUG=false
```

### Volume Mounts

- **Logs:** `./DropchipAI/backend/logs:/app/logs`
- **Database:** `./users.db:/app/users.db` (development)
- **PostgreSQL Data:** `postgres_data:/var/lib/postgresql/data` (production)

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :80
   netstat -tulpn | grep :8000
   
   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **Build failures:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Database connection issues:**
   ```bash
   # Check database container status
   docker-compose ps db
   
   # View database logs
   docker-compose logs db
   ```

4. **Frontend not loading:**
   ```bash
   # Check nginx configuration
   docker-compose exec frontend nginx -t
   
   # View nginx logs
   docker-compose logs frontend
   ```

### Health Checks

All services include health checks. Monitor them with:

```bash
# View health status
docker-compose ps

# Check specific service health
docker inspect dropchipai-backend | grep Health -A 10
```

## Development Workflow

### Making Changes

1. **Frontend changes:**
   - Edit files in `DropchipAI/frontend/`
   - Rebuild: `docker-compose build frontend`
   - Restart: `docker-compose restart frontend`

2. **Backend changes:**
   - Edit files in `DropchipAI/backend/`
   - Rebuild: `docker-compose build backend`
   - Restart: `docker-compose restart backend`

### Hot Reloading (Development)

For development with hot reloading:

```bash
# Start with volume mounts for live code changes
docker-compose -f docker-compose.dev.yml up
```

## Security Considerations

1. **Change default passwords** in production
2. **Use HTTPS** in production (add SSL certificates)
3. **Restrict network access** to necessary ports only
4. **Regular security updates** of base images
5. **Monitor logs** for suspicious activity

## Performance Optimization

1. **Resource limits:** Add memory and CPU limits in docker-compose.yml
2. **Caching:** Use Redis for session and data caching
3. **Load balancing:** Scale backend services as needed
4. **Database optimization:** Use connection pooling and indexing

## Backup and Recovery

### Database Backup

```bash
# Development (SQLite)
cp users.db users.db.backup

# Production (PostgreSQL)
docker-compose exec db pg_dump -U dropchipai dropchipai > backup.sql
```

### Full System Backup

```bash
# Create backup of all data
tar -czf dropchipai-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=__pycache__ \
  --exclude=.git \
  .
```

## Support

For issues and questions:
1. Check the logs: `docker-compose logs`
2. Review this documentation
3. Check the main project README.md
4. Open an issue in the project repository 