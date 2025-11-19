import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import "../styles/login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      // 1. Faz o login e recebe APENAS o token
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: email, password: password }),
      });
      
      // 2. Guarda o token temporariamente para a próxima requisição funcionar
      localStorage.setItem("fithub_token", data.token);

      // 3. AGORA busca os dados do usuário usando o token
      const dadosUsuario = await apiFetch("/api/usuarios/me");

      // 4. Atualiza o Contexto com o token E os dados do usuário
      login(data.token, dadosUsuario); 
      
      // 5. Redireciona para o portal
      navigate("/portal"); 

    } catch (err) {
      setError("Falha no login. Verifique suas credenciais.");
      console.error(err);
      // Se falhar, limpa qualquer token que possa ter ficado
      localStorage.removeItem("fithub_token");
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 login-imagem">
           <div className="texto-boas-vindas text-white">
             <h1 className="display-4 fw-bold">Fit-Hub</h1>
             <p className="fs-4">Transforme os seus objetivos em realidade.</p>
           </div>
        </div>
        
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
            
            <p className="mt-4 text-center">
              Não tem uma conta? <span className="text-success fw-bold" style={{cursor: "pointer"}}>Cadastre-se</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}