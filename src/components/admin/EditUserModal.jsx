import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export function EditUserModal({
  show,
  user,
  perfisDisponiveis,
  onClose,
  onSave,
}) {
  const [novoPerfilId, setNovoPerfilId] = useState("");

  // Limpa o select sempre que o modal abre ou o usuário muda
  useEffect(() => {
    setNovoPerfilId("");
  }, [user]);

  const handleConfirm = () => {
    onSave(novoPerfilId);
  };

  const formatarNome = (nome) => {
    // Se o nome não existir (null ou undefined), retorna um texto padrão para não quebrar
    if (!nome) return "Sem Nome";

    return (
      nome.replace("ROLE_", "").charAt(0) +
      nome.replace("ROLE_", "").slice(1).toLowerCase()
    );
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          <i className="fas fa-user-edit me-2 text-primary"></i>
          Editar Acesso
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted">
          Alterando perfil de: <strong>{user?.username}</strong>
        </p>
        <Form.Group>
          <Form.Label className="fw-bold">Novo Perfil</Form.Label>
          <Form.Select
            value={novoPerfilId}
            onChange={(e) => setNovoPerfilId(e.target.value)}
          >
            <option value="">Selecione...</option>

            {perfisDisponiveis &&
              perfisDisponiveis.map((perfil) => (
                <option key={perfil.idPerfil} value={String(perfil.idPerfil)}>
                  {perfil.idPerfil} - {formatarNome(perfil.nomePerfil)}
                </option>
              ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Salvar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
