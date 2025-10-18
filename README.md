# Backend Setup and Installation

## Prerequisites
- Node.js v18+
- PostgreSQL v15+

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update the following variables in `.env`:
- `DB_HOST` - Your PostgreSQL host (default: localhost)
- `DB_PORT` - Your PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: mini_twitter)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Strong secret key for JWT (CHANGE THIS!)

### 3. Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE mini_twitter;

# Exit
\q
```

### 4. Run Migrations
```bash
npm run db:migrate
```

### 5. Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:migrate` - Run database migrations

## API Testing

You can test the API using tools like:
- **Postman** - [Download](https://www.postman.com/)
- **Thunder Client** - VS Code extension
- **curl** - Command line

### Example API Calls

#### Register
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}'
```

#### Create Post (requires authentication)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello World!"}'
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:5000 | xargs kill -9
  ```

### Module Not Found
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```
