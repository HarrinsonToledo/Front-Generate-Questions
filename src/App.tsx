import { useState } from 'react';
import ChatView from './components/ChatView';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import { Pregunta } from './types';

type AppView = 'chat' | 'quiz' | 'results';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('chat');
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestasUsuario, setRespuestasUsuario] = useState<Record<number, string>>({});

  const handleQuestionsGenerated = (newPreguntas: Pregunta[]) => {
    setPreguntas(newPreguntas);
    setCurrentView('quiz');
  };

  const handleQuizComplete = (respuestas: Record<number, string>) => {
    setRespuestasUsuario(respuestas);
    setCurrentView('results');
  };

  const handleRetry = () => {
    setRespuestasUsuario({});
    setCurrentView('quiz');
  };

  const handleNewChat = () => {
    setPreguntas([]);
    setRespuestasUsuario({});
    setCurrentView('chat');
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  return (
    <>
      {currentView === 'chat' && (
        <ChatView onQuestionsGenerated={handleQuestionsGenerated} />
      )}

      {currentView === 'quiz' && (
        <QuizView
          preguntas={preguntas}
          onBack={handleBackToChat}
          onComplete={handleQuizComplete}
        />
      )}

      {currentView === 'results' && (
        <ResultsView
          preguntas={preguntas}
          respuestasUsuario={respuestasUsuario}
          onRetry={handleRetry}
          onNewChat={handleNewChat}
        />
      )}
    </>
  );
}

export default App;
