import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { apiFetch } from "../../services/api";

export function AvaliacaoModal({ show, handleClose, treino, onSuccess }) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!treino) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Ajuste o endpoint conforme sua API (ex: /api/avaliacoes/treino/1)
      await apiFetch(`/api/avaliacoes/treino/${treino.id}`, {
        method: "POST",
        body: JSON.stringify({
          nota: nota,
          comentario: comentario
        }),
      });

      // Limpa os campos após o sucesso
      setNota(5);
      setComentario("");
      
      // Callback para atualizar a lista na tela de Biblioteca
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      // A mensagem de erro vinda do backend (ex: "Não pode avaliar o próprio treino")
      // será capturada pelo catch na Biblioteca.jsx se você preferir centralizar lá,
      // ou você pode tratar aqui.
      alert(error.message || "Erro ao enviar avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark">
          Avaliar Treino
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <p className="text-muted small mb-4">
          Conte para a comunidade o que você achou do treino <strong>{treino.nome}</strong>.
        </p>

        {/* --- SELETOR DE ESTRELAS INTERATIVO --- */}
        <div className="text-center mb-4">
          <div className="d-flex justify-content-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fa-2x cursor-pointer transition-all ${
                  (hoveredStar || nota) >= star 
                    ? "fas fa-star text-warning" 
                    : "far fa-star text-muted opacity-50"
                }`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setNota(star)}
              ></i>
            ))}
          </div>
          <div className="mt-2 fw-bold text-dark">
             {nota === 1 && "Muito Ruim"}
             {nota === 2 && "Ruim"}
             {nota === 3 && "Regular"}
             {nota === 4 && "Muito Bom"}
             {nota === 5 && "Excelente!"}
          </div>
        </div>

        {/* --- CAMPO DE COMENTÁRIO --- */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold small">Seu comentário (opcional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Dê detalhes sobre o que gostou ou o que pode melhorar..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="rounded-3 border-light shadow-sm"
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button 
          variant="light" 
          onClick={handleClose} 
          className="rounded-pill px-4 fw-bold text-muted"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          variant="success" 
          onClick={handleSubmit} 
          className="rounded-pill px-4 fw-bold shadow-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Confirmar Avaliação"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}