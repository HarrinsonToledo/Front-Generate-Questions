import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, MessageSquare, HelpCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Pregunta, PreguntaReview } from '../types';
import { getQuestionExplanation } from '../services/apiService';

interface ResultsViewProps {
  preguntas: Pregunta[];
  respuestasUsuario: Record<number, string>;
  onRetry: () => void;
  onNewChat: () => void;
}

export default function ResultsView({
  preguntas,
  respuestasUsuario,
  onRetry,
  onNewChat
}: ResultsViewProps) {
  const [explanations, setExplanations] = useState<Record<number, { loading: boolean; text: string | null; error: boolean }>>({});

  const handleExplainClick = async (index: number) => {
    setExplanations(prev => ({ ...prev, [index]: { loading: true, text: null, error: false } }));

    try {
      const preguntaToReview: PreguntaReview = {
        ...preguntas[index],
        respuestaSeleccionada: respuestasUsuario[index]
      };

      const response = await getQuestionExplanation(preguntaToReview);
      setExplanations(prev => ({ ...prev, [index]: { loading: false, text: response.output, error: false } }));
    } catch (error) {
      console.error('Error fetching explanation:', error);
      setExplanations(prev => ({ ...prev, [index]: { loading: false, text: 'No se pudo cargar la explicación.', error: true } }));
    }
  };
  const correctCount = preguntas.filter(
    (pregunta, index) => respuestasUsuario[index] === pregunta.respuestaCorrecta
  ).length;

  const percentage = Math.round((correctCount / preguntas.length) * 100);

  const getScoreColor = (percent: number) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-50 border-green-200';
    if (percent >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Resultados del Cuestionario</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 ${getScoreBgColor(percentage)}`}>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tu Puntuación</h2>
            <div className={`text-6xl font-bold ${getScoreColor(percentage)} mb-4`}>
              {percentage}%
            </div>
            <p className="text-xl text-gray-700">
              {correctCount} de {preguntas.length} respuestas correctas
            </p>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={onRetry}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reintentar</span>
            </button>
            <button
              onClick={onNewChat}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Nuevo Cuestionario</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Revisión Detallada</h3>

          {preguntas.map((pregunta, index) => {
            const userAnswer = respuestasUsuario[index];
            const isCorrect = userAnswer === pregunta.respuestaCorrecta;
            const explanation = explanations[index];

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border-l-4"
                style={{
                  borderLeftColor: isCorrect ? '#10b981' : '#ef4444'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    Pregunta {index + 1}
                  </span>
                  {isCorrect ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Correcta</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">Incorrecta</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-800 font-medium mb-4 whitespace-pre-wrap">
                  {pregunta.enunciado}
                </p>

                {pregunta.imagen && (
                  <div className="mb-4">
                    <img
                      src={pregunta.imagen}
                      alt="Imagen de la pregunta"
                      className="max-w-md h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  {Object.entries(pregunta.respuestas).map(([key, value]) => {
                    const isUserAnswer = key === userAnswer;
                    const isCorrectAnswer = key === pregunta.respuestaCorrecta;

                    let borderColor = 'border-gray-200';
                    let bgColor = 'bg-gray-50';

                    if (isCorrectAnswer) {
                      borderColor = 'border-green-500';
                      bgColor = 'bg-green-50';
                    } else if (isUserAnswer && !isCorrect) {
                      borderColor = 'border-red-500';
                      bgColor = 'bg-red-50';
                    }

                    return (
                      <div
                        key={key}
                        className={`px-4 py-3 rounded-lg border-2 ${borderColor} ${bgColor}`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-semibold text-sm ${
                            isCorrectAnswer
                              ? 'bg-green-600 text-white'
                              : isUserAnswer && !isCorrect
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-300 text-gray-700'
                          }`}>
                            {key}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-800">{value}</p>
                            {isCorrectAnswer && (
                              <p className="text-sm text-green-600 font-medium mt-1">
                                ✓ Respuesta correcta
                              </p>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <p className="text-sm text-red-600 font-medium mt-1">
                                ✗ Tu respuesta
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  {explanation ? (
                    explanation.loading ? (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generando explicación...</span>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {explanation.error ? (
                          <div className="flex items-center justify-between">
                            <p className="text-red-600">{explanation.text}</p>
                            <button
                              onClick={() => handleExplainClick(index)}
                              className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-sm font-medium"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Reintentar</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-semibold text-gray-800">Explicación:</h4>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation.text || ''}</ReactMarkdown>
                          </>
                        )}
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => handleExplainClick(index)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Explícame esta pregunta</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
