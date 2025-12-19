import { useState, useEffect } from "react";
import { Modal, Button, Form, Tabs, Tab, Alert } from "react-bootstrap";
import { apiFetch } from "../../services/api";

export function ConfigModal({ show, handleClose, userId, currentPlanId, onPlanChangeRequest }) {
  const [key, setKey] = useState("senha");
  const [planos, setPlanos] = useState([]);
  const [senhas, setSenhas] = useState({ atual: "", nova: "", confirma: "" });
  const [novoPlanoId, setNovoPlanoId] = useState("");

  // Feedback
  const [feedback, setFeedback] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    if (show) {
      // Carregar planos ao abrir
      apiFetch("/api/planos/buscar").then(setPlanos).catch(console.error);
      setNovoPlanoId(currentPlanId); // Resetar seleção
      setFeedback({ show: false, success: false, message: "" });
    }
  }, [show, currentPlanId]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (senhas.nova !== senhas.confirma) {
      setFeedback({ show: true, success: false, message: "As senhas não coincidem!" });
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
      setFeedback({ show: true, success: true, message: "Senha atualizada com sucesso!" });
      setSenhas({ atual: "", nova: "", confirma: "" });
    } catch (error) {
      setFeedback({ show: true, success: false, message: "Erro: " + error.message });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Configurações da Conta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3" fill>
          
          {/* ABA SENHA */}
          <Tab eventKey="senha" title="Alterar Senha">
            <Form onSubmit={handleUpdatePassword}>
              <Form.Group className="mb-3">
                <Form.Label>Senha Atual</Form.Label>
                <Form.Control type="password" required value={senhas.atual} onChange={(e) => setSenhas({ ...senhas, atual: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nova Senha</Form.Label>
                <Form.Control type="password" required value={senhas.nova} onChange={(e) => setSenhas({ ...senhas, nova: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Nova Senha</Form.Label>
                <Form.Control type="password" required value={senhas.confirma} onChange={(e) => setSenhas({ ...senhas, confirma: e.target.value })} />
              </Form.Group>

              {feedback.show && (
                <Alert variant={feedback.success ? "success" : "danger"} onClose={() => setFeedback({ ...feedback, show: false })} dismissible>
                  {feedback.message}
                </Alert>
              )}

              <Button variant="success" type="submit" className="w-100">Atualizar Senha</Button>
            </Form>
          </Tab>

          {/* ABA PLANO */}
          <Tab eventKey="plano" title="Gerir Plano">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Selecione o novo plano:</Form.Label>
                <Form.Select value={novoPlanoId} onChange={(e) => setNovoPlanoId(e.target.value)}>
                  {planos.map((p) => (
                    <option key={p.idPlano} value={p.idPlano}>{p.nomePlano} - R$ {p.preco}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button 
                className="w-100" 
                variant="success" 
                onClick={() => onPlanChangeRequest(novoPlanoId)}
              >
                Confirmar Mudança
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}