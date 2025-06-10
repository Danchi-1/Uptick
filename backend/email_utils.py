import os
from dotenv import load_dotenv
from itsdangerous import URLSafeTimedSerializer
from aiosmtplib import send
from email.message import EmailMessage
from jinja2 import Template


load_dotenv()

EMAIL_ADDRESS = os.getenv('EMAIL_ADDRESS')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SECRET_KEY = os.getenv('SECRET_KEY')

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set in environment variables")
serializer = URLSafeTimedSerializer(SECRET_KEY)

def generate_confirmation_token(email):
    return serializer.dumps(email, salt='email-confirm')

def verify_confirmation_token(token, expiration=3600):
    try:
        email = serializer.loads(token, salt="email-confirm", max_age=expiration)
        return email
    except Exception:
        return None
    
async def send_confirmation_email(to_email, token):
    confirm_url = f"http://localhost:8000/verify-email?token={token}"

    html = f"""
    <h2>Confirm Your Email</h2>
    <p>Click the link below to confirm your email for Danc hotels:</p>
    <a href="{confirm_url}">{confirm_url}</a>
    """

    message = EmailMessage()
    message["From"] = EMAIL_ADDRESS
    message["To"] = to_email
    message["Subject"] = "Confirm Danc Hotels Email"
    message.set_content(html, subtype="html")

    await send(
        message,
        hostname=SMTP_SERVER,
        port=SMTP_PORT,
        start_tls=True,
        username=EMAIL_ADDRESS,
        password=EMAIL_PASSWORD,
    )