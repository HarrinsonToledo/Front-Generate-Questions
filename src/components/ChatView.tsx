import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChatMessage, Pregunta } from '../types';
import { sendChatMessage, sendChatMessageQuestionsEcaes, sendChatMessageQuestionsIcfes } from '../services/apiService';

interface ChatViewProps {
  onQuestionsGenerated: (preguntas: Pregunta[]) => void;
}

export default function ChatView({ onQuestionsGenerated }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente para generar preguntas tipo ICFES o ECAES. Puedes pedirme que genere preguntas sobre cualquier tema. Por ejemplo: "Dame 10 preguntas sobre matemáticas" o "Genera 5 preguntas de química" tener en cuenta que debes especificar a que prueba lo quieres ajustar (ICFES o ECAES) o simplemente usar la opcion CHAT para consultar cualquier tema.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (selectedOption === '') {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Por favor, selecciona una opción.'
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    try {

      if (selectedOption === 'chat') {
        const response = await sendChatMessage(inputValue);
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.output
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }
      let response: Pregunta[] = [];
      if (selectedOption === 'icfes') {
        response = await sendChatMessageQuestionsIcfes(inputValue);
      } else if (selectedOption === 'ecaes') {
        response = await sendChatMessageQuestionsEcaes(inputValue);
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `He generado ${response.length} preguntas para ti. Haz clic en "Iniciar Cuestionario" para comenzar.`
      };

      setMessages(prev => [...prev, assistantMessage]);
      onQuestionsGenerated(response);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al generar las preguntas. Por favor, intenta de nuevo.'
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Guia digital para Examenes</h1>
        <p className="text-sm text-gray-600 mt-1">Asistente inteligente para práctica de exámenes</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl px-6 py-4 rounded-2xl shadow-md ${
                  message.role === 'user'
                    ? 'bg-blue-400 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <div className="prose max-w-full">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xl px-6 py-4 rounded-2xl shadow-md bg-white text-gray-800 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p>{selectedOption === 'chat' ? 'Pensando...' : 'Generando preguntas...'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="flex space-x-3">
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-1/6"
            >
              <option value="">Selecciona una opción</option>
              <option value="icfes">ICFES</option>
              <option value="ecaes">ECAES</option>
              <option value="chat">CHAT</option>
            </select>
            <TextareaAutosize
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu solicitud aquí... ej: Dame 10 preguntas de matemáticas"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
              maxRows={5}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-md"
            >
              <Send className="w-5 h-5" />
              <span>Enviar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
