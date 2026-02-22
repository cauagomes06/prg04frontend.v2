import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Tabs,
  Tab,
  Alert,
  Spinner,
} from "react-bootstrap";
import { apiFetch } from "../../services/api";
import "../../styles/perfil.css";

export function ConfigModal({
  show,
  handleClose,
  userId,
  currentPlanId,
  onPlanChangeRequest,
}) {
  const [key, setKey] = useState("senha");
  const [planos, setPlanos] = useState([]);
  const [senhas, setSenhas] = useState({ atual: "", nova: "", confirma: "" });
  const [novoPlanoId, setNovoPlanoId] = useState("");
  const [loading, setLoading] = useState(false);

  const [feedback, setFeedback] = useState({
    show: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    if (show) {
      apiFetch("/api/planos/buscar").then(setPlanos).catch(console.error);
      setNovoPlanoId(currentPlanId);
      setFeedback({ show: false, success: false, message: "" });
      setSenhas({ atual: "", nova: "", confirma: "" });
    }
  }, [show, currentPlanId]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (senhas.nova !== senhas.confirma) {
      setFeedback({
        show: true,
        success: false,
        message: "As senhas não coincidem!",
      });
      setLoading(false);
      return;
    }

    try {
      await apiFetch(`/api/usuarios/update/senha/${userId}`, {
        method: "PUT",
        body: JSON.stringify({
          senhaAtual: senhas.atual,
          novaSenha: senhas.nova,
          confirmaSenha: senhas.confirma,
        }),
      });
      setFeedback({
        show: true,
        success: true,
        message: "Senha atualizada com sucesso!",
      });
      setSenhas({ atual: "", nova: "", confirma: "" });
    } catch (error) {
      setFeedback({
        show: true,
        success: false,
        message: "Erro: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="border-0 rounded-4 overflow-hidden shadow"
    >
      <Modal.Header closeButton className="config-modal-header border-bottom">
        <Modal.Title className="fw-bold text-dark">
          Configurações da Conta
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 config-modal-body">
        <Tabs
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="custom-tabs mb-4 border-0"
          fill
        >
          {/* ABA SENHA */}
          <Tab
            eventKey="senha"
            title={
              <span>
                <i className="fas fa-lock me-2"></i>Segurança
              </span>
            }
          >
            <Form onSubmit={handleUpdatePassword} className="mt-3">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-success">
                  SENHA ATUAL
                </Form.Label>
                <Form.Control
                  type="password"
                  required
                  className="border-0 p-3 shadow-none config-input-field"
                  value={senhas.atual}
                  onChange={(e) =>
                    setSenhas({ ...senhas, atual: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-success">
                  NOVA SENHA
                </Form.Label>
                <Form.Control
                  type="password"
                  required
                  className="border-0 p-3 shadow-none config-input-field"
                  value={senhas.nova}
                  onChange={(e) =>
                    setSenhas({ ...senhas, nova: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-success">
                  CONFIRMAR NOVA SENHA
                </Form.Label>
                <Form.Control
                  type="password"
                  required
                  className="border-0 p-3 shadow-none config-input-field"
                  value={senhas.confirma}
                  onChange={(e) =>
                    setSenhas({ ...senhas, confirma: e.target.value })
                  }
                />
              </Form.Group>

              {feedback.show && (
                <Alert
                  variant={feedback.success ? "success" : "danger"}
                  className="rounded-3 border-0 py-2 small"
                >
                  {feedback.message}
                </Alert>
              )}

              <Button
                variant="success"
                type="submit"
                className="w-100 rounded-pill fw-bold py-2 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Atualizar Senha"
                )}
              </Button>
            </Form>
          </Tab>

          {/* ABA PLANO */}
          <Tab
            eventKey="plano"
            title={
              <span>
                <i className="fas fa-gem me-2"></i>Meu Plano
              </span>
            }
          >
            <div className="mt-3">
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-success">
                  ALTERAR PARA:
                </Form.Label>
                <Form.Select
                  value={novoPlanoId}
                  className="border-0 p-3 shadow-none config-input-field"
                  onChange={(e) => setNovoPlanoId(e.target.value)}
                >
                  {planos.map((p) => (
                    <option key={p.idPlano} value={p.idPlano}>
                      {p.nomePlano} — R$ {p.preco.toFixed(2)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="p-3 rounded-3 mb-4 plan-note-box">
                <small className="text-muted fw-bold mb-1">
                  Nota importante:
                </small>
                <small className="text-dark">
                  Ao confirmar, você será redirecionado para concluir o
                  pagamento do novo plano.
                </small>
              </div>

              <Button
                className="w-100 rounded-pill fw-bold py-2 shadow-sm"
                variant="success"
                onClick={() => onPlanChangeRequest(novoPlanoId)}
                disabled={String(novoPlanoId) === String(currentPlanId)}
              >
                {String(novoPlanoId) === String(currentPlanId)
                  ? "Plano Atual"
                  : "Ir para o Pagamento"}
              </Button>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}
