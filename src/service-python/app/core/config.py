from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # 基本信息
    PROJECT_NAME: str = "Digital Life"
    API_V1_STR: str = "/api/v1"

    # Langchain配置
    LANGCHAIN_TRACING_V2: bool = True
    LANGCHAIN_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGCHAIN_PROJECT: str = "DigitalLife"

    # 智谱API配置
    OPENAI_BASE_URL: str = "https://open.bigmodel.cn/api/paas/v4/"
    OPENAI_MODEL: str = "glm-4-plus"

    # 对话配置
    CONVERSATION_TTL: int = 86400
    MAX_CONVERSATION_HISTORY: int = 50

    # 数据库配置
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/mydatabase"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


# 创建全局配置实例
settings = Settings()
