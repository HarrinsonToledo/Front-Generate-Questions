import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Pregunta } from '../types';

interface QuizViewProps {
  preguntas: Pregunta[];
  onBack: () => void;
  onComplete: (respuestas: Record<number, string>) => void;
}

export default function QuizView({ preguntas, onBack, onComplete }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState<Record<number, string>>({});

  const currentQuestion = preguntas[currentIndex];
  const progress = ((currentIndex + 1) / preguntas.length) * 100;
  const answeredCount = Object.keys(respuestasUsuario).length;

  const handleSelectAnswer = (opcion: string) => {
    setRespuestasUsuario(prev => ({
      ...prev,
      [currentIndex]: opcion
    }));
  };

  const handleNext = () => {
    if (currentIndex < preguntas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = () => {
    onComplete(respuestasUsuario);
  };

  const canFinish = answeredCount === preguntas.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver al Chat</span>
            </button>
            <div className="text-sm text-gray-600">
              {answeredCount} de {preguntas.length} respondidas
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Pregunta {currentIndex + 1} de {preguntas.length}
              </span>
              {respuestasUsuario[currentIndex] && (
                <span className="flex items-center space-x-1 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Respondida</span>
                </span>
              )}
            </div>

            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                {currentQuestion.enunciado}
              </ReactMarkdown>
            </div>

            {currentQuestion.imagen && (
              <div className="mt-6">
                <img
                  src={currentQuestion.imagen}
                  alt="Imagen de la pregunta"
                  className="max-w-full h-auto rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            {Object.entries(currentQuestion.respuestas).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleSelectAnswer(key)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                  respuestasUsuario[currentIndex] === key
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    respuestasUsuario[currentIndex] === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {key}
                  </span>
                  <span className="flex-1 text-gray-800 pt-1">{value}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </button>

            {/* CAMBIO CLAVE: Agregamos un contenedor con desplazamiento horizontal */}
            <div className="flex flex-grow justify-center min-w-0 mx-2">
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {preguntas.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full text-sm font-medium transition-all ${
                      index === currentIndex
                        ? 'bg-blue-600 text-white'
                        : respuestasUsuario[index]
                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            {/* FIN DEL CAMBIO CLAVE */}

            {currentIndex === preguntas.length - 1 ? (
              <button
                onClick={handleFinish}
                disabled={!canFinish}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Finalizar</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}