export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  ENDPOINTS: {
    ECAES: '/ecaes/preguntas',
    ICFES:  '/icfes/preguntas',
    CHAT: '/chat',
    REVIEW: '/explicacion'
  }
};
