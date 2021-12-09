import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()


params = {
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DATABASE"),
}

DATABASE_URL = "mysql+pymysql://{user}:{password}@{host}:3306/{database}".format(
    **params
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def session():
    """
    Get Database Session
    :return:
    """
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
