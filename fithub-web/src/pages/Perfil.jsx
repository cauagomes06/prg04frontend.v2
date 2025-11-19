import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { SuccessModal } from "../components/SuccessModal";
import { ConfirmModal } from "../components/ConfirmModal";
import "../styles/perfil.css";
import {
  Card,
  Button,
  Modal,
  Form,
  Tabs,
  Tab,
  Alert,
  Row,
  Col,
} from "react-bootstrap";

export function Perfil() {
  const { user, login } = useContext(AuthContext);

  // Estados de Dados
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planos, setPlanos] = useState([]);

  // Modal principal
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("senha");

  // Formulários
  const [senhas, setSenhas] = useState({ atual: "", nova: "", confirma: "" });
  const [novoPlanoId, setNovoPlanoId] = useState("");

  // Feedback
  const [feedbackShow, setFeedbackShow] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Modais de confirmação e sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);

  // Carregar dados do perfil
  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const data = await apiFetch("/api/usuarios/me");
      setPerfil(data);
      setNovoPlanoId(data.planoId);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setLoading(false);
    }
  };

  // Carregar planos quando abrir o modal
  const handleOpenModal = () => {
    setShowModal(true);
    apiFetch("/api/planos/buscar")
      .then((data) => setPlanos(data))
      .catch((err) => console.error("Erro ao carregar planos:", err));
  };

  // Alterar senha
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (senhas.nova !== senhas.confirma) {
      setFeedbackSuccess(false);
      setFeedbackMessage("As novas senhas não coincidem!");
      setFeedbackShow(true);
      return;
    }

    try {
      await apiFetch(`/api/usuarios/update/senha/${perfil.id}`, {
        method: "PUT",
        body: JSON.stringify({
          senhaAtual: senhas.atual,
          novaSenha: senhas.nova,
          confirmaSenha: senhas.confirma,
        }),
      });
      setFeedbackSuccess(true);
      setFeedbackMessage("Senha atualizada com sucesso!");
      setFeedbackShow(true);
      setSenhas({ atual: "", nova: "", confirma: "" });
      setShowModal(false);
    } catch (error) {
      setFeedbackSuccess(false);
      setFeedbackMessage("Erro ao atualizar senha: " + error.message);
      setFeedbackShow(true);
    }
  };

  // Abrir modal de confirmação ao mudar plano
  const handleOpenConfirmModal = (planId) => {
    if (planId === perfil.planoId) {
      setFeedbackSuccess(false);
      setFeedbackMessage("Você já possui este plano.");
      setFeedbackShow(true);
      return;
    }
    setPendingPlan(planId);
    setShowConfirmModal(true);
  };

  // Confirmar alteração do plano
  const confirmarUpdate = async () => {
    try {
      await apiFetch(`/api/planos/mudar/${perfil.id}`, {
        method: "PATCH",
        body: JSON.stringify({ novoPlanoId: pendingPlan }),
      });

      setShowSuccessModal(true);
      setShowConfirmModal(false);
      setShowModal(false);
      carregarPerfil();
    } catch (error) {
      setFeedbackSuccess(false);
      setFeedbackMessage("Erro ao mudar plano: " + error.message);
      setFeedbackShow(true);
    }
  };

  if (loading)
    return <div className="text-center mt-5">Carregando perfil...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 fw-bold text-dark">Meu Perfil</h1>

      {/* --- Cabeçalho --- */}
      <div className="perfil-header d-flex align-items-center gap-4 mb-4">
        <div className="perfil-avatar">
          <i className="fas fa-user fa-4x"></i>
        </div>

        <div className="flex-grow-1">
          <h2 className="fw-bold">{perfil?.pessoa?.nomeCompleto}</h2>
          <p className="text-muted mb-1">
            <i className="fas fa-envelope me-2"></i>
            {perfil?.username}
          </p>
          <span className="badge badge-plano text-success rounded-pill">
            {perfil?.nomePlano || "Sem Plano"}
          </span>
        </div>

        <Button className="btn-green px-3 py-2" onClick={handleOpenModal}>
          <i className="fas fa-cog me-2"></i> Configurações
        </Button>
      </div>

      {/* --- Estatísticas --- */}
      <Row>
        <Col md={6}>
          <Card className="card-estats border-0">
            <Card.Body>
              <h4 className="card-estats-title mb-4 pb-2 border-bottom">
                Estatísticas
              </h4>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Score Total</span>
                <span className="fw-bold fs-5 text-success">
                  {perfil?.scoreTotal || 0} pts
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Membro desde</span>
                <span className="fw-bold">
                  {perfil?.dataCriacao
                    ? new Date(perfil.dataCriacao).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- Modal Configurações --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Configurações da Conta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
            fill
          >
            {/* Alterar Senha */}
            <Tab eventKey="senha" title="Alterar Senha">
              <Form onSubmit={handleUpdatePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Senha Atual</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={senhas.atual}
                    onChange={(e) =>
                      setSenhas({ ...senhas, atual: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nova Senha</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={senhas.nova}
                    onChange={(e) =>
                      setSenhas({ ...senhas, nova: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Nova Senha</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={senhas.confirma}
                    onChange={(e) =>
                      setSenhas({ ...senhas, confirma: e.target.value })
                    }
                  />
                </Form.Group>
                <Button variant="success" type="submit" className="w-100">
                  Atualizar Senha
                </Button>
              </Form>
            </Tab>

            {/* Gerir Plano */}
            <Tab eventKey="plano" title="Gerir Plano">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Selecione o novo plano:</Form.Label>
                  <Form.Select
                    value={novoPlanoId}
                    onChange={(e) => setNovoPlanoId(e.target.value)}
                  >
                    <option value="">Carregando planos...</option>
                    {planos.map((p) => (
                      <option key={p.idPlano} value={p.idPlano}>
                        {p.nomePlano} - R$ {p.preco}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Alert variant="info" className="small">
                  <i className="fas fa-info-circle me-1"></i>
                  Ao mudar de plano, o valor será atualizado na próxima fatura.
                </Alert>

                <Button
                  type="button"
                  className="w-100"
                  variant="success"
                  onClick={() => handleOpenConfirmModal(novoPlanoId)}
                >
                  Confirmar Mudança
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>

      {/* --- Modais de confirmação e sucesso --- */}
      <ConfirmModal
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        handleConfirm={confirmarUpdate}
        message="Tem certeza que deseja mudar para este novo plano?"
      />

      <SuccessModal
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
        message="Plano alterado com sucesso!"
      />

      {/* Feedback inline */}
      {feedbackShow && (
        <Alert
          variant={feedbackSuccess ? "success" : "danger"}
          className="mt-3"
          onClose={() => setFeedbackShow(false)}
          dismissible
        >
          {feedbackMessage}
        </Alert>
      )}
    </div>
  );
}
