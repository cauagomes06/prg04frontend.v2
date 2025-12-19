import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import { ErrorModal } from "../common/ErrorModal"; // Importe o modal de erro

export function PlanModal({ show, handleClose, onSuccess, planToEdit }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  // ESTADOS PARA O MODAL DE ERRO
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (show) {
      if (planToEdit) {
        setNome(planToEdit.nome || "");
        setDescricao(planToEdit.descricao || "");
        setPreco(planToEdit.preco || "");
      } else {
        setNome("");
        setDescricao("");
        setPreco("");
      }
    }
  }, [show, planToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const planDto = {
      nome,
      descricao,
      preco: parseFloat(preco)
    };

    try {
      const url = planToEdit 
        ? `/api/planos/update/${planToEdit.idPlano}` 
        : "/api/planos/register";
      
      const method = planToEdit ? "PUT" : "POST";

      await apiFetch(url, {
        method,
        body: JSON.stringify(planDto),
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      // Captura a mensagem do backend: "Ja existe um plano com este nome..."
      setErrorMsg(error.message || "Ocorreu um erro ao salvar o plano.");
      setShowError(true);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{planToEdit ? "Editar Plano" : "Cadastrar Novo Plano"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nome do Plano</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Plano Trimestral" 
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Preço (R$)</Form.Label>
              <Form.Control 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={preco}
                onChange={e => setPreco(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Descrição</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Descreva as vantagens..." 
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                {planToEdit ? "Atualizar Plano" : "Salvar Plano"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ErrorModal 
        show={showError} 
        handleClose={() => setShowError(false)} 
        title="Erro no Cadastro"
        message={errorMsg} 
      />
    </>
  );
}