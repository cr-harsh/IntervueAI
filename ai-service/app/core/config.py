from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    host: str = '127.0.0.1'
    port: int = 8000
    groq_api_key: str = ''
    groq_model: str = 'openai/gpt-oss-20b'
    groq_timeout_seconds: float = 30.0
    groq_structured_output: bool = True

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    @property
    def is_groq_configured(self) -> bool:
        return bool(self.groq_api_key and self.groq_api_key.strip())


settings = Settings()

