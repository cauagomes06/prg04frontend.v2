import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import "../styles/login.css";

// Opcional: Se quiser usar o ErrorModal igual na tela de AdminPlans, pode importar aqui.
// Importando o modal para um visual mais elegante (caso você já tenha ele configurado globalmente ou queira usar localmente)
import { ErrorModal } from "../components/common/ErrorModal";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false); // Estado para o modal

  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    try {
      // 1. Login para obter o token
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: email, password: password }),
      });

      // 2. Guarda token e busca dados do utilizador
      localStorage.setItem("fithub_token", data.token);
      const dadosUsuario = await apiFetch("/api/usuarios/me");

      // 3. Atualiza contexto
      login(data.token, dadosUsuario);

      // 4. Redireciona para o portal 
      navigate("/portal");
      
    } catch (err) {
      console.error(err);
      localStorage.removeItem("fithub_token");
      
      // Capturando a mensagem exata do Spring Boot
      const mensagemBackend = err.message || "Falha no login. Verifique suas credenciais.";
      
      setError(mensagemBackend); // Seta no state para exibir
      setShowErrorModal(true); // Exibe o Modal para mais destaque
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* Lado Esquerdo - Imagem */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 login-imagem">
          <div className="texto-boas-vindas text-white">
            <h1 className="display-4 fw-bold">Fit-Hub</h1>
            <p className="fs-4">Transforme os seus objetivos em realidade.</p>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
          <form
            onSubmit={handleSubmit}
            className="login-formulario w-100"
            style={{ maxWidth: "450px" }}
          >
            <h2 className="fw-bold mb-3">Acesse a sua Conta</h2>

            {/* Alerta Bootstrap (mantido como fallback ou para erros menores) */}
            {error && !showErrorModal && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3 senha-container">
              <label className="form-label fw-bold">Senha</label>

              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lg senha-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  } senha-icone`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 rounded-pill fw-bold"
            >
              Entrar
            </button>

            {/* Link para a página de Registo */}
            <p className="mt-4 text-center">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-success fw-bold"
                style={{ cursor: "pointer", textDecoration: "none" }}
              >
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      <ErrorModal
        show={showErrorModal}
        handleClose={() => setShowErrorModal(false)}
        message={error} // Passando a mensagem do Backend (ex: "Seu plano expirou...")
      />
      
    </div>
  );
}