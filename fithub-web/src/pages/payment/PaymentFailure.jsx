import { useNavigate } from "react-router-dom";

export function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="text-center p-5 bg-white rounded-4 shadow-sm">
        <h1 className="text-danger display-1 mb-3">
          <i className="bi bi-x-circle-fill"></i>
        </h1>
        <h2 className="fw-bold mb-3">Pagamento não concluído</h2>
        <p className="text-muted mb-4">
          Houve um problema ao processar o seu pagamento.
        </p>
        <button onClick={() => navigate("/perfil")} className="btn btn-outline-danger">
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}