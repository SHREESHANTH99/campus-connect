# NyxWall Backend

FastAPI-based backend for the NyxWall platform with PostgreSQL, Redis, WebSockets, and Celery support.

## Prerequisites

- Python 3.10+
- PostgreSQL 15
- Redis 7
- Docker & Docker Compose (optional)

## Setup Guide

### 1. Clone and Navigate

```bash
cd nyxwall/backend
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://campus:campus123@localhost:5432/campus_db

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App
DEBUG=True
```

### 5. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Run migrations
alembic upgrade head
```

#### Option B: Local Installation

Install PostgreSQL and Redis locally, then:

```bash
# Create database
createdb campus_db

# Run migrations
alembic upgrade head
```

### 6. Run the Application

#### Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### With Docker

```bash
docker-compose up
```

### 7. Start Celery Worker (Optional)

For background tasks:

```bash
celery -A app.workers.celery_app worker --loglevel=info
```

## API Documentation

Once running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## WebSocket Endpoints

- **Chat**: `ws://localhost:8000/ws`

## Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "migration message"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Testing Database Connection

```bash
python test_db_connection.py
```

## Project Structure

```
backend/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Core configuration
│   ├── db/           # Database setup
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   ├── websockets/   # WebSocket handlers
│   └── workers/      # Celery tasks
├── alembic/          # Database migrations
└── requirements.txt  # Python dependencies
```

## Tech Stack

- **FastAPI**: Modern web framework
- **PostgreSQL**: Primary database
- **Redis**: Caching and pub/sub
- **Alembic**: Database migrations
- **Celery**: Background task processing
- **asyncpg**: Async PostgreSQL driver
- **Pydantic**: Data validation
- **JWT**: Authentication

## Common Commands

```bash
# Install new package
pip install package-name
pip freeze > requirements.txt

# Stop Docker services
docker-compose down

# View logs
docker-compose logs -f backend

# Access database
docker exec -it campus_postgres psql -U campus -d campus_db
```

## Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Database Connection Issues

- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists: `createdb campus_db`

### Migration Errors

```bash
alembic downgrade base
alembic upgrade head
```

## Development

```bash
# Format code
black app/

# Lint
flake8 app/

# Type checking
mypy app/
```

## License

MIT
