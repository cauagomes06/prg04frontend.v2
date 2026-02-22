import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";
import "../../styles/exercicio.css";

export function CreateExerciseModal({
  show,
  handleClose,
  onSuccess,
  exerciseToEdit,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    grupoMuscular: "",
    descricao: "",
    urlVideo: "",
  });

  const gruposMusculares = [
    "PEITO", "COSTAS", "PERNAS", "OMBROS", "BÍCEPS", 
    "TRÍCEPS", "ABDÔMEN", "GLÚTEOS", "PANTURRILHA", "FULL BODY",
  ];

  useEffect(() => {
    if (exerciseToEdit) {
      setFormData({
        nome: exerciseToEdit.nome || "",
        grupoMuscular: exerciseToEdit.grupoMuscular || "",
        descricao: exerciseToEdit.descricao || "",
        urlVideo: exerciseToEdit.urlVideo || "",
      });
    } else {
      setFormData({ nome: "", grupoMuscular: "", descricao: "", urlVideo: "" });
    }
  }, [exerciseToEdit, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isEditing = !!exerciseToEdit?.id;
    const url = isEditing
      ? `/api/exercicios/update/${exerciseToEdit.id}`
      : "/api/exercicios/register";
    const method = isEditing ? "PUT" : "POST";

    try {
      await apiFetch(url, { method, body: JSON.stringify(formData) });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      contentClassName="border-0 rounded-4 overflow-hidden shadow"
    >
      <Modal.Header closeButton className="exercise-modal-header border-0">
        <Modal.Title className="fw-bold text-success">
          <i className={`fas ${exerciseToEdit ? "fa-edit" : "fa-plus-circle"} me-2`}></i>
          {exerciseToEdit ? "Editar Exercício" : "Cadastrar Exercício"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4 exercise-modal-body">
          <Row>
            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-success text-uppercase exercise-form-label">
                  Nome do Exercício
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: Supino Reto"
                  required
                  className="border-0 p-3 shadow-none exercise-input-custom"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-success text-uppercase exercise-form-label">
                  Grupo Muscular
                </Form.Label>
                <Form.Select
                  required
                  className="border-0 p-3 shadow-none exercise-input-custom"
                  value={formData.grupoMuscular}
                  onChange={(e) => setFormData({ ...formData, grupoMuscular: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {gruposMusculares.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold small text-success text-uppercase exercise-form-label">
              URL do Vídeo (YouTube/Vimeo)
            </Form.Label>
            <Form.Control
              type="url"
              placeholder="https://..."
              className="border-0 p-3 shadow-none exercise-input-custom"
              value={formData.urlVideo}
              onChange={(e) => setFormData({ ...formData, urlVideo: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-0">
            <Form.Label className="fw-bold small text-success text-uppercase exercise-form-label">
              Instruções de Execução
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Descreva o passo a passo..."
              className="border-0 p-3 shadow-none exercise-input-custom"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="exercise-modal-footer border-0">
          <Button
            variant="link"
            onClick={handleClose}
            className="text-muted fw-bold text-decoration-none shadow-none"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="success"
            className="px-4 rounded-pill fw-bold shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : exerciseToEdit ? (
              "Salvar Alterações"
            ) : (
              "Salvar Exercício"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}