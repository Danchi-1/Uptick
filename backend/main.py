import os
from mysql.connector import pooling, Error
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import bcrypt
import uvicorn
from contextlib import contextmanager
from dotenv import load_dotenv
from email_utils import (
    send_confirmation_email,
    generate_confirmation_token,
    verify_confirmation_token,
)

load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)), 
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'hotel'),
    'pool_name': 'web_app_pool',
    'pool_size': 10,
    'pool_reset_session': True,
    'autocommit': False
}

# Create connection pool
try:
    print("Creating database connection pool...")
    print(f"Connecting to: {DB_CONFIG['host']}:{DB_CONFIG.get('port', 3306)}")
    print(f"Database: {DB_CONFIG['database']}")
    print(f"User: {DB_CONFIG['user']}")
    
    connection_pool = pooling.MySQLConnectionPool(**DB_CONFIG)
    print("Database connection pool created successfully")
except Error as e:
    print(f"Error creating connection pool: {e}")
    print("Make sure MySQL is running and credentials are correct")
    connection_pool = None
except Exception as e:
    print(f"Unexpected error creating connection pool: {e}")
    connection_pool = None

app = FastAPI(title="User Management API", description="An API for user management with authentication")

# CORS Configuration - more restrictive for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://127.0.0.1:3000", "http://localhost:5500", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Pydantic Models
class Users(BaseModel):
    name: str
    email: EmailStr

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"

class GuestExtra(BaseModel):
    phone_number: Optional[str] = None
    address: Optional[str] = None

class StaffExtra(BaseModel):
    position: str
    department: str
    phone_number: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegistration(BaseModel):
    user: UserBase
    guest_info: Optional[GuestExtra] = None
    staff_info: Optional[StaffExtra] = None

class SignUpRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Database connection context manager
@contextmanager
def get_db_connection():
    if not connection_pool:
        print("ERROR: Database connection pool not available")
        raise HTTPException(status_code=500, detail="Database connection pool not available")
    
    connection = None
    try:
        connection = connection_pool.get_connection()
        print(f"Database connection acquired: {connection.is_connected()}")
        yield connection
    except Error as e:
        print(f"Database error: {str(e)}")
        if connection:
            connection.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        if connection:
            connection.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("Database connection closed")


@app.post("/signup")
async def signup(signup_data: SignUpRequest):
    try:
        with get_db_connection() as conn:
            cur = conn.cursor()
            cur.execute("SELECT id FROM users WHERE email = %s", (signup_data.email,))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="Email already registered")

            token = generate_confirmation_token(signup_data.email)
            await send_confirmation_email(signup_data.email, token)

            hashed = hash_password(signup_data.password)
            cur.execute("""
                INSERT INTO users (name, email, password_hash, role, is_confirmed)
                VALUES (%s, %s, %s, %s, %s)
            """, (signup_data.username, signup_data.email, hashed, 'user', False))
            conn.commit()
            user_id = cur.lastrowid
            cur.close()

            return {"message": "Signup successful. Check your email to confirm.", "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

