const API_URL = "http://localhost:8080";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("fithub_token");
  
  // 1. Verifica se é um upload de arquivo (FormData)
  const isFormData = options.body instanceof FormData;
  
  // Garante que o endpoint comece com /
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const config = {
    ...options,
    headers: {
      // Se for FormData, o navegador define o Content-Type automaticamente
      ...(!isFormData && { "Content-Type": "application/json" }),
      
      // Adiciona o Token se existir
      ...(token && { Authorization: `Bearer ${token}` }),
      
      // Mantém headers extras passados na chamada
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${cleanEndpoint}`, config);

    // --- A SOLUÇÃO: LER O CORPO UMA ÚNICA VEZ ---
    let data = null;
    const text = await response.text(); // Lemos como texto primeiro (abre a "caixa")
    
    if (text) {
      try {
        data = JSON.parse(text); // Tenta converter para objeto se for JSON
      } catch (e) {
        data = text; // Se não for JSON, mantém como texto puro (ex: URL ou String)
      }
    }

    // 2. Tratamento de Erros HTTP (401, 403, 400, 500)
    if (!response.ok) {
      // Caso especial: Token expirado ou inválido
      if (response.status === 401) {
        localStorage.removeItem("fithub_token");
        window.location.href = "/login";
        return;
      }

      // Se chegamos aqui, usamos o 'data' que já lemos lá em cima
      // O Spring Boot envia o erro no campo 'message' através do seu ErrorMessage
      const errorMessage = data?.message || (typeof data === 'string' ? data : response.statusText);
      
      throw new Error(errorMessage || "Erro inesperado no servidor");
    }

    // 3. RETORNO DE SUCESSO
    // Como já fizemos o parse lá em cima, basta retornar a variável 'data'
    return data;

  } catch (error) {
    // Se o erro for o que acabamos de dar throw, ele cai aqui e é repassado para o componente
    console.error("Erro na API:", error);
    throw error;
  }
};