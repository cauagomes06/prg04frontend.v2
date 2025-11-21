import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";

export function EditDataModal({ show, handleClose, perfil, onSuccess }) {
  const [formData, setFormData] = useState({ nomeCompleto: "", telefone: "" });

  // Preenche o formulário quando o perfil muda ou o modal abre
  useEffect(() => {
    if (perfil?.pessoa) {
      setFormData({
        nomeCompleto: perfil.pessoa.nomeCompleto,
        telefone: perfil.pessoa.telefone,
      });
    }
  }, [perfil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/api/usuarios/me/dados-pessoais", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      onSuccess(); // Notifica o pai para atualizar e mostrar sucesso
      handleClose();
    } catch (error) {
      alert("Erro ao atualizar: " + error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Dados Pessoais</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome Completo</Form.Label>
            <Form.Control
              type="text"
              required
              value={formData.nomeCompleto}
              onChange={(e) =>
                setFormData({ ...formData, nomeCompleto: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="text"
              required
              value={formData.telefone}
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              Salvar Alterações
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}