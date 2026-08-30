IntervueAI 🤖

IntervueAI is an AI-powered mock interview platform that helps candidates practice technical interviews using their resume, job description, experience level, interview type, and difficulty preference.

The application uses a React + TypeScript frontend, a Node.js + Express backend, MongoDB for interview persistence, and a dedicated FastAPI AI microservice powered by Groq for question generation and answer evaluation.

🎯 Goal: Make interview preparation more personalized by generating questions from the candidate's background and target role, then evaluating each answer with structured AI feedback.

✨ Features

🧑‍💻 Personalized Interview Setup

Choose domain, experience level, interview type, difficulty, and number of questions.

Provide a resume and target job description.

🤖 AI Question Generation

Generates technical interview questions using the candidate's resume and job description.

Questions include category, difficulty, and tags.

📝 Answer Evaluation

Evaluates every submitted answer using the AI service.

Provides an overall score along with technical accuracy, clarity, depth, feedback, strengths, and improvements.

📊 Interview Results

Calculates an overall interview score from evaluated questions.

Aggregates strengths and improvement areas across the interview.

🔄 Interview State Management

Tracks interviews through draft, generating, ready, in_progress, and completed states.

🧩 Separated AI Microservice

Keeps AI/LLM logic isolated from the main Node.js API.

Makes the AI layer independently deployable and easier to maintain.

🛡️ Validation & Error Handling

Backend request validation, centralized error handling, CORS configuration, AI timeout handling, and structured AI output validation.

⚡ Modern React UI

React 19 + TypeScript + Vite.

Tailwind CSS and Lucide icons.

React Router for client-side navigation.

🏗️ Architecture

                         ┌─────────────────────────┐
                         │        React Client     │
                         │ React + TypeScript + Vite│
                         └────────────┬────────────┘
                                      │ HTTP / JSON
                                      ▼
                         ┌─────────────────────────┐
                         │     Node.js Backend      │
                         │ Express + TypeScript     │
                         └───────┬─────────┬───────┘
                                 │         │
                         MongoDB │         │ HTTP
                                 │         ▼
                                 │  ┌──────────────────────┐
                                 │  │   FastAPI AI Service │
                                 │  │ Python + FastAPI     │
                                 │  └──────────┬───────────┘
                                 │             │
                                 │             ▼
                                 │      ┌──────────────┐
                                 │      │  Groq LLM    │
                                 │      └──────────────┘
                                 ▼
                         ┌─────────────────┐
                         │    MongoDB      │
                         │ Interview Data  │
                         └─────────────────┘

Request Flow

The user configures an interview in the React client.

The client creates an interview through the Express API.

The interview configuration and resume/job-description text are stored in MongoDB.

The client requests question generation.

Express retrieves the interview and sends the relevant data to the FastAPI AI service.

FastAPI builds the AI request and calls Groq.

Groq returns structured interview questions.

FastAPI validates the response with Pydantic and returns it to Express.

Express stores the generated questions in MongoDB and returns them to the client.

The candidate submits an answer for each question.

Express sends the question, answer, resume, job description, and domain to the AI service.

The AI service evaluates the answer and returns structured feedback.

Express stores the evaluation and score.

The results endpoint calculates the overall score and aggregates strengths/improvement areas.

🧠 AI Question Generation

The question-generation request contains:

{
"resume": "Candidate resume text",
"jobDescription": "Target job description",
"domain": "Backend Development",
"experienceLevel": "Entry Level",
"difficulty": "Medium",
"questionCount": 10
}

The AI service asks Groq to return a validated structure containing:

{
"questions": [
{
"question": "Explain how the Node.js event loop works.",
"category": "Technical",
"difficulty": "Medium",
"tags": ["Node.js", "Event Loop", "JavaScript"]
}
]
}

The service validates the generated response using Pydantic and also verifies that the number of returned questions matches the requested count.

📊 AI Answer Evaluation

For every submitted answer, the AI receives the:

Interview question

Candidate answer

Resume

Job description

Domain

The response contains:

{
"score": 82,
"technicalAccuracy": 85,
"clarity": 80,
"depth": 78,
"feedback": "Good explanation with correct understanding...",
"strengths": [
"Correctly explained the core concept"
],
"improvements": [
"Add a practical example"
]
}

The backend stores the evaluation against the corresponding question and uses the individual question scores to calculate the final interview score.

🔐 Environment Variables

Backend

Create server/.env:

PORT=4000
MONGODB_URI=your_mongodb_connection_string
AI_SERVICE_URL=http://127.0.0.1:8000
CLIENT_URL=http://127.0.0.1:5173
NODE_ENV=development

AI Service

Create ai-service/.env:

HOST=127.0.0.1
PORT=8000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
GROQ_TIMEOUT_SECONDS=30.0
GROQ_STRUCTURED_OUTPUT=true

1. Clone the repository

git clone https://github.com/cr-harsh/IntervueAI.git
cd IntervueAI

2. Start the AI service

cd ai-service
pip install -r requirements.txt

Create the .env file and add your Groq credentials.

Start FastAPI:

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

The AI service will run on:

http://127.0.0.1:8000

3. Start the backend

Open another terminal:

cd server
npm install

Create server/.env and configure MongoDB, AI service URL, and frontend URL.

Start the development server:

npm run dev

The backend will run on the configured port, 4000 by default.

4. Start the frontend

Open another terminal:

cd client
npm install

Create client/.env:

VITE_API_URL=http://127.0.0.1:4000/api

Start Vite:

npm run dev

The frontend will be available at the URL shown by Vite, normally:

http://127.0.0.1:5173

🧪 Testing

Backend

cd server
npm test

Type-check the backend:

npm run typecheck

Build the backend:

npm run build

AI Service

cd ai-service
python -m pytest tests/

🚧 Future Improvements

Potential improvements for future versions include:

🔐 Full user authentication and authorization

📄 Direct PDF resume upload and server-side parsing

🎙️ Real-time voice-based interviews

💬 Conversational follow-up questions

📈 Interview history and performance analytics

🧠 Adaptive difficulty based on previous answers

🗂️ Saved interview sessions

📱 Improved mobile experience

⚡ Redis caching and rate limiting

🧪 Expanded integration and end-to-end testing

📊 More detailed performance visualizations

🤝 Contributing

Contributions are welcome.

📄 License

This project is currently maintained as a personal project. Add a license file if you intend to distribute it as open source.

👨‍💻 Author

Harsh Bhuteja

GitHub: @cr-harsh

⭐ If you find IntervueAI useful, consider starring the repository.

Built with ❤️ using React, TypeScript, Node.js, FastAPI, MongoDB, and Groq.
