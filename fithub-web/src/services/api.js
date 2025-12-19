const API_URL = "http://localhost:8080";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("fithub_token");
  const isFormData = options.body instanceof FormData;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const defaultHeaders = {
    ...(!isFormData && { "Content-Type": "application/json" }),
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
      // 401 = Token inválido ou expirado (LOGOUT OBRIGATÓRIO)
      if (response.status === 401) {
        localStorage.removeItem("fithub_token");
        window.location.href = "/login";
        return;
      }

      // 403 = O usuário está logado mas NÃO tem permissão para este recurso específico.
      // NÃO apagamos o token aqui para evitar o loop de sair do sistema.
      if (response.status === 403) {
        throw new Error("Acesso negado: você não tem permissão para este recurso.");
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return null;
  } catch (error) {
    throw error;
  }
};