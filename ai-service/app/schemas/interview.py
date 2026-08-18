from pydantic import BaseModel, Field


class GenerateQuestionsRequest(BaseModel):
    resume: str = Field(min_length=1)
    jobDescription: str = Field(min_length=1)
    domain: str = Field(min_length=1)
    experienceLevel: str = Field(min_length=1)
    difficulty: str = Field(min_length=1)
    questionCount: int = Field(ge=1, le=50)


class GeneratedQuestion(BaseModel):
    question: str = Field(min_length=1)
    category: str = Field(min_length=1)
    difficulty: str = Field(min_length=1)
    tags: list[str] = Field(default_factory=list)


class GenerateQuestionsResponse(BaseModel):
    questions: list[GeneratedQuestion] = Field(min_length=1)


class EvaluateAnswerRequest(BaseModel):
    question: str = Field(min_length=1)
    answer: str = Field(min_length=1)
    resume: str = Field(min_length=1)
    jobDescription: str = Field(min_length=1)
    domain: str = Field(min_length=1)


class EvaluationResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    technicalAccuracy: int = Field(ge=0, le=100)
    clarity: int = Field(ge=0, le=100)
    depth: int = Field(ge=0, le=100)
    feedback: str = Field(min_length=1)
    strengths: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)
