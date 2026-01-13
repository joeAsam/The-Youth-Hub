from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from os import getenv

# moving from sqlite to postgresql for production

# DATABASE_URL = "sqlite:///users.db"

# engine = create_engine(
#     DATABASE_URL, connect_args={"check_same_thread": False}
# )

# DATABASE_URL = "postgresql://choir_user:supa_dupa_pass266@localhost:5432/choir_hub"

DATABASE_URL = getenv("DATABASE_URL", "postgresql://choir_user:supa_dupa_pass266@localhost:5432/choir_hub")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

