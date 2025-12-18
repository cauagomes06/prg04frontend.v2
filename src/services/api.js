const API_URL = "http://localhost:8080"

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("fithub_token");

  // 1. Se o body for FormData (upload), NÃO definimos Content-Type manualmente
  const isFormData = options.body instanceof FormData;

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const defaultHeaders = {
    ...( !isFormData && { "Content-Type": "application/json" }), // Só adiciona se não for upload
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
const response = await fetch(`${API_URL}${cleanEndpoint}`, config);
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("fithub_token");
        window.location.href = "/login";
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro: ${response.statusText}`);
    }

    // Verifica se há conteúdo para retornar
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return null;
  } catch (error) {
    throw error;  

  }
};