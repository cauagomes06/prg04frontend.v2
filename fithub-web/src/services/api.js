const API_URL = "http://localhost:8080";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("fithub_token");
  const isFormData = options.body instanceof FormData;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const config = {
    ...options,
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${cleanEndpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("fithub_token");
        window.location.href = "/login";
        return;
      }
      // 403 lança erro mas NÃO desloga
      if (response.status === 403) {
        throw new Error("Acesso negado: você não tem permissão para este recurso.");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    return (contentType && contentType.includes("application/json")) ? response.json() : null;
  } catch (error) {
    throw error;
  }
};