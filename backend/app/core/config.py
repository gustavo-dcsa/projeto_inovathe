from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Innovation Platform"
    SECRET_KEY: str = "CHANGE_THIS_SECRET_KEY" # In prod, use env var
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        case_sensitive = True

settings = Settings()
