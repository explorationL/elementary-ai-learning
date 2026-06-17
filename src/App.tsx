import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { KnowledgeMapPage } from './pages/KnowledgeMapPage';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { MistakesPage } from './pages/MistakesPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { GrowthPage } from './pages/GrowthPage';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/knowledge-map/:subject" element={<KnowledgeMapPage />} />
            <Route path="/learn/:subject/:chapter" element={<LearnPage />} />
            <Route path="/practice/:subject/:chapter" element={<PracticePage />} />
            <Route path="/mistakes" element={<MistakesPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/growth" element={<GrowthPage />} />
          </Routes>
          <Navigation />
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;