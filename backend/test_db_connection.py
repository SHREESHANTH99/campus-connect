import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL", "postgresql://campus:campus123@localhost:5432/campus_db")
database_url = database_url.replace("postgresql+asyncpg://", "postgresql://")

print(f"Attempting to connect to: {database_url.replace('campus123', '****')}")

try:
    conn = psycopg2.connect(database_url)
    print("✅ Connection successful!")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")
