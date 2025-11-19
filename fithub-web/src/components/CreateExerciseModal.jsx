import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { apiFetch } from "../services/api";

export function CreateExerciseModal({ show, handleClose, onSuccess }) {
  // LOG DE RENDERIZAÇÃO
  console.log("--> COMPONENTE CreateExerciseModal. Show:", show);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("Peito");
  const [urlVideo, setUrlVideo] = useState("");

  const grupos = [
    "Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps", "Abdômen", "Cardio", "Funcional"
  ];

  // Resetar campos quando abre
  useEffect(() => {
    if (show) {
        console.log("--> Modal ABERTO. Limpando campos.");
        setNome("");
        setDescricao("");
        setUrlVideo("");
        setGrupoMuscular("Peito");
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("--> SUBMIT INICIADO");

    const exercicioDto = {
      nome,
      descricao,
      grupoMuscular,
      urlVideo
    };

    console.log("--> DADOS A ENVIAR:", exercicioDto);

    try {
      console.log("--> CHAMANDO API: POST /api/exercicios/register");
      await apiFetch("/api/exercicios/register", {
        method: "POST",
        body: JSON.stringify(exercicioDto),
      });
      
      console.log("--> SUCESSO NA API");
      onSuccess();
      handleClose();
      
    } catch (error) {
      console.error("--> ERRO NA API:", error);
      alert("Erro ao criar exercício: " + error.message);
    }
  };

  // Se show for falso, o componente retorna null? Não, o Bootstrap controla isso, 
  // mas vamos garantir que o return está correto.

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cadastrar Novo Exercício</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nome do Exercício</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Ex: Supino Reto" 
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Grupo Muscular</Form.Label>
                <Form.Select 
                  value={grupoMuscular} 
                  onChange={e => setGrupoMuscular(e.target.value)}
                >
                  {grupos.map(g => <option key={g} value={g}>{g}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
               <Form.Group>
                <Form.Label className="fw-bold">Vídeo (URL)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="https://youtube..." 
                  value={urlVideo}
                  onChange={e => setUrlVideo(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descrição / Instruções</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Descreva a execução correta..." 
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Salvar Exercício
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}