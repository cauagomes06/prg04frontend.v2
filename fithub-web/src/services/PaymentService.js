import { apiFetch } from "./api";

export const paymentService = {
  /**
   * Cria a preferência de pagamento no backend e retorna o link (para planos pagos).
   * @param {number} usuarioId - ID do usuário
   * @param {number} planoId - ID do plano escolhido
   */
  async criarCheckout(usuarioId, planoId) {
    // Chama o endpoint do seu backend Java
    const response = await apiFetch("/api/pagamentos/checkout", {
      method: "POST",
      body: JSON.stringify({ 
        usuarioId: usuarioId, 
        planoId: planoId 
      }),
    });

    // O backend Java retorna { initPoint: "https://mercadopago..." }
    return response;
  },

  /**
   * Altera o plano do usuário diretamente (para planos gratuitos ou admin).
   * @param {number} planoId - ID do novo plano
   */
  async alterarPlano(planoId) {
    // Chama o endpoint PATCH que criamos no UsuarioController
    const response = await apiFetch("/api/usuarios/alterar-plano", {
      method: "PATCH",
      body: JSON.stringify({ 
        planoId: planoId 
      }),
    });

    return response;
  
  },

  async obterRelatorioFaturamento() {
    // Chama o endpoint que criamos no PagamentoController
    const response = await apiFetch("/api/pagamentos/relatorio/faturamento", {
      method: "GET",
    });
    return response;
  }

};