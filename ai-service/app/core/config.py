from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    host: str = '127.0.0.1'
    port: int = 8000
    llm_provider: str = 'unconfigured'
    llm_model: str = ''
    llm_api_key: str = ''
    llm_api_base_url: str = ''
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')


settings = Settings()
