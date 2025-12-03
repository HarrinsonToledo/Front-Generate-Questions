import { API_CONFIG } from '../config/api';
import { ChatRequest, ChatResponse, Pregunta, PreguntaReview } from '../types';

const urlEcaes = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ECAES}`;
const urlIcfes = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ICFES}`;
const urlChat = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`;
const urlReview = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REVIEW}`;

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  

  const requestBody: ChatRequest = {
    message
  };

  const response = await fetch(urlChat, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data: ChatResponse = await response.json();
  return data;
};

export const sendChatMessageQuestionsEcaes = async (message: string): Promise<Pregunta[]> => {
  

  const requestBody: ChatRequest = {
    message
  };

  const response = await fetch(urlEcaes, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data: Pregunta[] = await response.json();
  return data;
};

export const sendChatMessageQuestionsIcfes = async (message: string): Promise<Pregunta[]> => {
  

  const requestBody: ChatRequest = {
    message
  };

  const response = await fetch(urlIcfes, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data: Pregunta[] = await response.json();
  return data;
};

export const getQuestionExplanation = async (preguntaReview: PreguntaReview): Promise<ChatResponse> => {
  const response = await fetch(urlReview, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preguntaReview)
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data: ChatResponse = await response.json();
  return data;
};

