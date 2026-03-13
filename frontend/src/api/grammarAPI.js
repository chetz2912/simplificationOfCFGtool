// API functions for communicating with the backend

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const simplifyGrammar = async (grammarData) => {
  const response = await fetch(`${API_BASE_URL}/api/simplify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(grammarData),
  });

  if (!response.ok) {
    throw new Error('Failed to simplify grammar');
  }

  return response.json();
};

export const getExamples = async () => {
  const response = await fetch(`${API_BASE_URL}/api/examples`);

  if (!response.ok) {
    throw new Error('Failed to fetch examples');
  }

  return response.json();
};

export const checkHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error('Server is not healthy');
  }

  return response.json();
};
