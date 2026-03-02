const API_URL = "http://localhost:8080";

/**
 * Função base para chamadas à API com tratamento de Token e Erros
 */
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

    let data = null;
    const text = await response.text(); 
    
    if (text) {
      try {
        data = JSON.parse(text); 
      } catch (e) {
        data = text; 
      }
    }

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("fithub_token");
        window.location.href = "/login";
        return;
      }

      const errorMessage = data?.message || (typeof data === 'string' ? data : response.statusText);
      throw new Error(errorMessage || "Erro inesperado no servidor");
    }

    return data;

  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
};

/**
 * Objeto centralizador das chamadas de Execução e Gamificação
 */
export const execucaoApi = {
  // Envia o resumo do treino finalizado (dataInicio, dataFim, lista de exercícios)
  finalizar: (dadosSessao) => {
    return apiFetch('/api/execucoes/finalizar', {
      method: 'POST',
      body: JSON.stringify(dadosSessao)
    });
  },

  // Busca o histórico de treinos do usuário de forma paginada
  getHistorico: (page = 0, size = 10) => {
    return apiFetch(`/api/execucoes/meu-historico?page=${page}&size=${size}`);
  }
};