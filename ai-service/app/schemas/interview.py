from pydantic import BaseModel, ConfigDict, Field, field_validator


class GenerateQuestionsRequest(BaseModel):
    resume: str = Field(min_length=1)
    jobDescription: str = Field(min_length=1)
    domain: str = Field(min_length=1)
    experienceLevel: str = Field(min_length=1)
    difficulty: str = Field(min_length=1)
    questionCount: int = Field(ge=1, le=50)

    @field_validator('resume', 'jobDescription', 'domain', 'experienceLevel', 'difficulty', mode='after')
    @classmethod
    def check_not_whitespace(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError('Field must not be empty or whitespace only.')
        return stripped


class GeneratedQuestion(BaseModel):
    model_config = ConfigDict(extra='forbid')
    question: str = Field(min_length=1)
    category: str = Field(min_length=1)
    difficulty: str = Field(min_length=1)
    tags: list[str] = Field(default_factory=list)

    @field_validator('question', 'category', 'difficulty', mode='after')
    @classmethod
    def check_not_whitespace(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError('Field must not be empty or whitespace only.')
        return stripped


class GenerateQuestionsResponse(BaseModel):
    model_config = ConfigDict(extra='forbid')
    questions: list[GeneratedQuestion] = Field(min_length=1)


class EvaluateAnswerRequest(BaseModel):
    question: str = Field(min_length=1)
    answer: str = Field(min_length=1)
    resume: str = Field(min_length=1)
    jobDescription: str = Field(min_length=1)
    domain: str = Field(min_length=1)

    @field_validator('question', 'answer', 'resume', 'jobDescription', 'domain', mode='after')
    @classmethod
    def check_not_whitespace(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError('Field must not be empty or whitespace only.')
        return stripped


class EvaluationResponse(BaseModel):
    model_config = ConfigDict(extra='forbid')
    score: int = Field(ge=0, le=100)
    technicalAccuracy: int = Field(ge=0, le=100)
    clarity: int = Field(ge=0, le=100)
    depth: int = Field(ge=0, le=100)
    feedback: str = Field(min_length=1)
    strengths: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)

    @field_validator('feedback', mode='after')
    @classmethod
    def check_not_whitespace(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError('Feedback must not be empty or whitespace only.')
        return stripped

