# PUSHPAK Database Configuration Guide

## 1. Prerequisites
- **PostgreSQL 18+** installed locally or running via service `postgresql-x64-18`.
- Python database driver: `psycopg` 3 (`psycopg[binary]>=3.2.0`).

## 2. Database Creation
Before connecting the backend to a dedicated database:
1. Launch `psql` (located at `C:\Program Files\PostgreSQL\18\bin\psql.exe` on Windows):
   ```bash
   psql -U postgres
   ```
2. Create the development database:
   ```sql
   CREATE DATABASE pushpak_db;
   ```
3. (Optional) Create a dedicated pushpak user:
   ```sql
   CREATE USER pushpak_user WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE pushpak_db TO pushpak_user;
   ```

## 3. Environment Variable Configuration
Copy the template in `backend/.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```
Update the values with your local credentials:
```ini
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_actual_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=pushpak_db
```
The SQLAlchemy engine in `backend/app/db/session.py` will automatically assemble the psycopg 3 URL:
`postgresql+psycopg://<user>:<password>@localhost:5432/pushpak_db`
