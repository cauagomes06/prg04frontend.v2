import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { apiFetch } from "../../services/api";

export function BroadcastModal({ show, onHide, onSuccess }) {
  const [mensagem, setMensagem] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/api/notificacoes/broadcast", {
        method: "POST",
        body: JSON.stringify({HZ ,mensagem, link }),
      });
      
      // Limpar e notificar sucesso
      setMensagem("");
      setLink("");
      onSuccess(); 
      onHide();
    } catch (error) {
      alert("Erro ao enviar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Enviar Notificação Global</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Mensagem</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              required
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite a mensagem para todos os utilizadores..."
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Link de Redirecionamento (Opcional)</Form.Label>
            <Form.Control 
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Ex: /portal/competicoes"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
             <Button variant="secondary" onClick={onHide}>
               Cancelar
             </Button>
             <Button type="submit" className="btn-custom-primary" disabled={loading}>
               {loading ? <i className="fas fa-spinner fa-spin"></i> : "Enviar"}
             </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}