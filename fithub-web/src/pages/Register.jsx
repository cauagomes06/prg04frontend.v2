import { useState, useEffect, useContext } from "react";
import { paymentService } from "../services/PaymentService.js";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../services/api.js";
import { SuccessModal } from "../components/common/SuccessModal.jsx";
import { ErrorModal } from "../components/common/ErrorModal.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/login.css";

export function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados dos Modais
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    telefone: "",
    email: "",
    password: "",
    planoId: "",
  });

  // carregamento de planos
  useEffect(() => {
    apiFetch("/api/planos/buscar")
      .then((data) => {
        // Só define se for uma lista válida
        if (Array.isArray(data)) {
          setPlanos(data);
        } else {
          console.warn("API retornou dados inválidos:", data);
          setPlanos([]); // Define array vazio para evitar o erro do .map
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar planos", err);
        setPlanos([]); // Garante que não fica null
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.planoId) {
      setErrorMessage("Por favor, selecione um plano.");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    // Payload de registro (Mantive igual ao seu)
    const payload = {
      username: formData.email,
      password: formData.password,
      perfil: 3, // ROLE_CLIENTE
      plano: parseInt(formData.planoId),
      pessoa: {
        nomeCompleto: formData.nomeCompleto,
        cpf: formData.cpf,
        telefone: formData.telefone,
      },
    };

    try {
      // 1. Cria a conta
      await apiFetch("/api/usuarios/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // 2. Faz o Login automático para pegar o Token
      const loginData = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });

      // Salva token e carrega usuário
      localStorage.setItem("fithub_token", loginData.token);
      const userProfile = await apiFetch("/api/usuarios/me");
      login(loginData.token, userProfile);

      // 3. INICIA O PAGAMENTO DO PLANO ESCOLHIDO
      // Usa o ID do usuário recém-criado (userProfile.id) e o plano do form
      const checkoutResponse = await paymentService.criarCheckout(
        userProfile.id,
        parseInt(formData.planoId)
      );

      // 4. Redireciona para o Mercado Pago
      if (checkoutResponse && checkoutResponse.initPoint) {
        window.location.href = checkoutResponse.initPoint;
      } else {
        throw new Error("Link de pagamento não gerado.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Erro ao criar conta.");
      setShowErrorModal(true);
      setLoading(false); // Só tira o loading se der erro, pois se der certo ele sai da página
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate("/portal");
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* Coluna da Imagem */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 login-imagem">
          <div className="text-white">
            <h1 className="display-4 fw-bold">Junte-se ao FitHub</h1>
            <p className="fs-4">
              O primeiro passo para a sua transformação começa aqui.
            </p>
          </div>
        </div>

        {/* Coluna do Formulário */}
        <div className="col-lg-7 d-flex flex-column justify-content-center align-items-center p-4 bg-light">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-4 shadow-sm w-100"
            style={{ maxWidth: "600px" }}
          >
            <h2 className="fw-bold mb-4 text-center text-dark">
              Crie a sua conta
            </h2>

            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-bold">Nome Completo</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  className="form-control"
                  placeholder="apenas números"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Senha</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mt-4">
                <label className="form-label fw-bold mb-2">
                  Escolha o seu Plano:
                </label>
                {/* 2. CORREÇÃO DE SEGURANÇA NO RENDER (?.map) */}
                <div className="row g-2">
                  {planos?.length > 0 ? (
                    planos.map((plano) => (
                      <div className="col-md-4" key={plano.idPlano}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="planoId"
                          id={`plano-${plano.idPlano}`}
                          value={plano.idPlano}
                          onChange={handleChange}
                          required
                        />
                        <label
                          className="btn btn-outline-success w-100 h-100 d-flex flex-column justify-content-center py-3"
                          htmlFor={`plano-${plano.idPlano}`}
                        >
                          <span className="fw-bold">{plano.nomePlano}</span>
                          <span className="small">R$ {plano.preco}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center text-muted p-3 border rounded">
                      {loading
                        ? "A carregar planos..."
                        : "Nenhum plano disponível."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 rounded-pill fw-bold mt-4"
              disabled={loading}
            >
              {loading ? "A processar..." : "Registar e Pagar"}
            </button>

            <p className="mt-4 text-center">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-success fw-bold text-decoration-none"
              >
                Fazer Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Modais */}
      <SuccessModal
        show={showSuccessModal}
        handleClose={handleCloseSuccess}
        title="Sucesso!"
        message={successMessage}
      />

      <ErrorModal
        show={showErrorModal}
        handleClose={() => setShowErrorModal(false)}
        title="Erro"
        message={errorMessage}
      />
    </div>
  );
}
