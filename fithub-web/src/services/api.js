// src/services/api.js
const API_URL = "http://localhost:8080";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("fithub_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(API_URL + endpoint, config);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("fithub_token");
        window.location.href = "/login"; // Força o logout
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro: ${response.statusText}`);
    }

    // Verifica se há conteúdo para retornar (evita erro em respostas vazias)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return null;
  } catch (error) {
    throw error;
  }
};