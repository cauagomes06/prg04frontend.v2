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
      // Se for FormData, o navegador define o Content-Type (multipart).
      // Se for JSON/Texto, definimos application/json.
      ...(!isFormData && { "Content-Type": "application/json" }),
      
      // Adiciona o Token se existir
      ...(token && { Authorization: `Bearer ${token}` }),
      
      // Mantém headers extras passados na chamada
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${cleanEndpoint}`, config);

    // 2. Tratamento de Erros HTTP (401, 403, 400, 500)
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("fithub_token");
        window.location.href = "/login";
        return;
      }
      if (response.status === 403) {
        throw new Error("Acesso negado.");
      }

      // Tenta ler o erro como JSON, se falhar, lê como texto
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMessage = await response.text();
      }
      
      throw new Error(errorMessage || `Erro: ${response.statusText}`);
    }

    // 3. A MÁGICA (Parsing Seguro)
    // Lê a resposta como texto primeiro
    const textData = await response.text();

    // Se a resposta for vazia (ex: status 204), retorna null
    if (!textData) return null;

    // Tenta converter para JSON. Se funcionar, retorna o Objeto/Array.
    // Se der erro (SyntaxError), significa que é apenas uma String (ex: URL da foto), então retorna o texto.
    try {
      return JSON.parse(textData);
    } catch (e) {
      return textData;
    }

  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
};