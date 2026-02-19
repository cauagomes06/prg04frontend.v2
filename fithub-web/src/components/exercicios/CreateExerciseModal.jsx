import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";

export function CreateExerciseModal({ show, handleClose, onSuccess, exerciseToEdit }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    grupoMuscular: "",
    descricao: "",
    urlVideo: ""
  });

  // Lista de grupos (mesma da sua tela principal)
  const gruposMusculares = [
    "PEITO", "COSTAS", "PERNAS", "OMBROS", "BÍCEPS", 
    "TRÍCEPS", "ABDÔMEN", "GLÚTEOS", "PANTURRILHA", "FULL BODY"
  ];

  // Efeito para preencher o formulário se for edição
  useEffect(() => {
    if (exerciseToEdit) {
      setFormData({
        nome: exerciseToEdit.nome || "",
        grupoMuscular: exerciseToEdit.grupoMuscular || "",
        descricao: exerciseToEdit.descricao || "",
        urlVideo: exerciseToEdit.urlVideo || ""
      });
    } else {
      // Limpa o formulário se for um novo cadastro
      setFormData({ nome: "", grupoMuscular: "", descricao: "", urlVideo: "" });
    }
  }, [exerciseToEdit, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Define a URL e o Método dependendo se existe um ID (Edição) ou não (Cadastro)
    const isEditing = !!exerciseToEdit?.id;
    const url = isEditing 
      ? `/api/exercicios/update/${exerciseToEdit.id}` 
      : "/api/exercicios/register";
    const method = isEditing ? "PUT" : "POST";

    try {
      await apiFetch(url, {
        method: method,
        body: JSON.stringify(formData),
      });

      onSuccess(); // Recarrega a tabela e mostra o SuccessModal
      handleClose();
    } catch (error) {
      alert("Erro ao salvar exercício: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold text-success">
          <i className={`fas ${exerciseToEdit ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
          {exerciseToEdit ? "Editar Exercício" : "Novo Exercício"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row>
            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">NOME DO EXERCÍCIO</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: Supino Reto"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">GRUPO MUSCULAR</Form.Label>
                <Form.Select
                  required
                  value={formData.grupoMuscular}
                  onChange={(e) => setFormData({ ...formData, grupoMuscular: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {gruposMusculares.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold small">URL DO VÍDEO (OPCIONAL)</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://youtube.com/..."
              value={formData.urlVideo}
              onChange={(e) => setFormData({ ...formData, urlVideo: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-0">
            <Form.Label className="fw-bold small">DESCRIÇÃO / INSTRUÇÕES</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Descreva a execução correta..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="bg-light border-0">
          <Button variant="link" onClick={handleClose} className="text-muted fw-bold text-decoration-none">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="success" 
            className="px-4 fw-bold shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i> Salvando...
              </>
            ) : (
              exerciseToEdit ? "Salvar Alterações" : "Cadastrar Exercício"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}