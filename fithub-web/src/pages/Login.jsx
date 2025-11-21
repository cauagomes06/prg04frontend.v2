import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importa ambos corretamente
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import "../styles/login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Inicializa o hook de navegação

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

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
      
      // 4. Redireciona para o portal (USO DO NAVIGATE)
      navigate("/portal"); 

    } catch (err) {
      setError("Falha no login. Verifique suas credenciais.");
      console.error(err);
      localStorage.removeItem("fithub_token");
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
          <form onSubmit={handleSubmit} className="login-formulario w-100" style={{maxWidth: "450px"}}>
            <h2 className="fw-bold mb-3">Acesse a sua Conta</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

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
            <div className="mb-3">
              <label className="form-label fw-bold">Senha</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn btn-success btn-lg w-100 rounded-pill fw-bold">
              Entrar
            </button>
            
            {/* Link para a página de Registo (USO DO LINK) */}
            <p className="mt-4 text-center">
              Não tem uma conta? <Link to="/register" className="text-success fw-bold" style={{cursor: "pointer", textDecoration: "none"}}>Cadastre-se</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}