import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/aulas.css";

export function CreateClassModal({ show, handleClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const [instrutores, setInstrutores] = useState([]);
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    dataHoraInicio: "",
    duracaoMinutos: 60,
    vagasTotais: 20,
    instrutorIdentificador: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setFormData({
        nome: "",
        descricao: "",
        dataHoraInicio: "",
        duracaoMinutos: 60,
        vagasTotais: 20,
        instrutorIdentificador: user?.id || ""
      });
      setError("");

      apiFetch("/api/aulas/instrutores")
        .then(setInstrutores)
        .catch(console.error);
    }
  }, [show, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await apiFetch("/api/aulas/register", {
        method: "POST",
        body: JSON.stringify({
            ...formData,
            duracaoMinutos: parseInt(formData.duracaoMinutos),
            vagasTotais: parseInt(formData.vagasTotais),
            instrutorIdentificador: parseInt(formData.instrutorIdentificador)
        })
      });
      
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.message || "Erro ao criar aula.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" contentClassName="border-0 rounded-4 overflow-hidden shadow">
      <Modal.Header closeButton className="aulas-modal-header">
        <Modal.Title className="fw-bold text-dark">Agendar Nova Aula</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="aulas-modal-body p-4">
        {error && <Alert variant="danger" className="rounded-3 border-0 shadow-sm">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold aulas-form-label">Nome da Aula</Form.Label>
                <Form.Control 
                  type="text" 
                  name="nome" 
                  className="aulas-input-custom shadow-none"
                  placeholder="Ex: Spinning Intenso"
                  value={formData.nome} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold aulas-form-label">Instrutor Responsável</Form.Label>
                <Form.Select 
                  name="instrutorIdentificador"
                  className="aulas-input-custom shadow-none"
                  value={formData.instrutorIdentificador}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {instrutores.map(inst => (
                    <option key={inst.id} value={inst.id}>
                        {inst.nomeCompleto}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold aulas-form-label">Descrição</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2}
              name="descricao" 
              className="aulas-input-custom shadow-none"
              placeholder="Breve descrição dos objetivos da aula..."
              value={formData.descricao} 
              onChange={handleChange} 
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold aulas-form-label">Data e Hora</Form.Label>
                <Form.Control 
                  type="datetime-local" 
                  name="dataHoraInicio" 
                  className="aulas-input-custom shadow-none"
                  value={formData.dataHoraInicio} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold aulas-form-label">Duração (min)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="duracaoMinutos" 
                  className="aulas-input-custom shadow-none"
                  value={formData.duracaoMinutos} 
                  onChange={handleChange} 
                  min="10"
                  required 
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold aulas-form-label">Vagas Totais</Form.Label>
                <Form.Control 
                  type="number" 
                  name="vagasTotais" 
                  className="aulas-input-custom shadow-none"
                  value={formData.vagasTotais} 
                  onChange={handleChange} 
                  min="1"
                  required 
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-color-custom">
            <Button variant="link" className="text-muted fw-bold text-decoration-none shadow-none" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="success" type="submit" className="rounded-pill px-4 fw-bold shadow-sm">
              Confirmar Agendamento
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}