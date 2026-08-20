import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { InterviewProvider } from './features/interview/InterviewContext'
import { LandingPage } from './pages/LandingPage'
import { SetupPage } from './pages/SetupPage'
import { QuestionsPage } from './pages/QuestionsPage'
import { LiveInterviewPage } from './pages/LiveInterviewPage'
import { ResultsPage } from './pages/ResultsPage'

function App() {
    return (
        <BrowserRouter>
            <InterviewProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/setup" element={<SetupPage />} />
                    <Route path="/questions" element={<QuestionsPage />} />
                    <Route path="/interview" element={<LiveInterviewPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </InterviewProvider>
        </BrowserRouter>
    )
}

export default App