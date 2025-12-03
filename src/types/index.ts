export interface Respuestas {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface PreguntaReview extends Pregunta {
  respuestaSeleccionada: string;
}

export interface Pregunta {
  enunciado: string;
  respuestas: Respuestas;
  respuestaCorrecta: string;
  imagen?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface QuizState {
  preguntas: Pregunta[];
  respuestasUsuario: Record<number, string>;
  completed: boolean;
}

export interface ApiResponse {
  preguntas: Pregunta[];
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  output: string;
}
