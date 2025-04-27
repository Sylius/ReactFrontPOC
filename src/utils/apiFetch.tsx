export const apiFetch = (endpoint: string, options?: RequestInit) => {
  if (import.meta.env.VITE_APP_ENV === 'development') {
    return fetch(endpoint, options);
  }
  return fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, options);
};
