import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export function CreateClassModal({ show, handleClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const [instrutores, setInstrutores] = useState([]);
  
  // Estados do Formulário
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    dataHoraInicio: "",
    duracaoMinutos: 60,
    vagasTotais: 20,
    instrutorIdentificador: ""
  });

  const [error, setError] = useState("");

  // Carregar lista de instrutores ao abrir o modal
  useEffect(() => {
    if (show) {
      // Limpa o form
      setFormData({
        nome: "",
        descricao: "",
        dataHoraInicio: "",
        duracaoMinutos: 60,
        vagasTotais: 20,
        instrutorIdentificador: user?.id || "" // Se for personal, já sugere ele mesmo
      });
      setError("");

      // Busca instrutores para o select
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
            // Garante que números sejam enviados como números
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
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Agendar Nova Aula</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Nome da Aula</Form.Label>
                <Form.Control 
                  type="text" 
                  name="nome" 
                  placeholder="Ex: Spinning Intenso"
                  value={formData.nome} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Instrutor Responsável</Form.Label>
                <Form.Select 
                  name="instrutorIdentificador"
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
            <Form.Label className="fw-bold">Descrição</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2}
              name="descricao" 
              value={formData.descricao} 
              onChange={handleChange} 
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Data e Hora</Form.Label>
                <Form.Control 
                  type="datetime-local" 
                  name="dataHoraInicio" 
                  value={formData.dataHoraInicio} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Duração (min)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="duracaoMinutos" 
                  value={formData.duracaoMinutos} 
                  onChange={handleChange} 
                  min="10"
                  required 
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Vagas Totais</Form.Label>
                <Form.Control 
                  type="number" 
                  name="vagasTotais" 
                  value={formData.vagasTotais} 
                  onChange={handleChange} 
                  min="1"
                  required 
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button variant="success" type="submit">Confirmar Agendamento</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}