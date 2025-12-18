import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Espera 3 segundos para o usuário ler a mensagem e redireciona para o Perfil
    const timer = setTimeout(() => {
      navigate("/portal"); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="text-center p-5 bg-white rounded-4 shadow-sm">
        <h1 className="text-success display-1 mb-3">
          <i className="bi bi-check-circle-fill"></i>
        </h1>
        <h2 className="fw-bold mb-3">Pagamento Confirmado!</h2>
        <p className="lead text-muted mb-4">
          A sua assinatura foi ativada com sucesso.
          <br />
          A redirecionar para o seu perfil...
        </p>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">A carregar...</span>
        </div>
        
        <div className="mt-4">
            <button onClick={() => navigate("/portal")} className="btn btn-success">
                Ir agora
            </button>
        </div>
      </div>
    </div>
  );
}