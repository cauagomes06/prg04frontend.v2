import { Modal, Button } from "react-bootstrap";
import confetti from "canvas-confetti"; 
import { useEffect } from "react";

export function LevelUpModal({ show, level, onHide }) {
  
  useEffect(() => {
    if (show) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10001 };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: Math.random() * 0.2, y: Math.random() - 0.2 } 
        });
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: Math.random() * 0.2 + 0.8, y: Math.random() - 0.2 } 
        });
      }, 250);
    }
  }, [show]);

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      contentClassName="border-0 rounded-4 overflow-hidden shadow-lg"
    >
      <Modal.Body className="text-center p-5" style={{ backgroundColor: "var(--bg-light)" }}>
        <div className="mb-4 trophy-pulse d-inline-block">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-lg"
            style={{ width: "120px", height: "120px", backgroundColor: "var(--primary-color)", color: "white" }}
          >
            <i className="fas fa-chevron-double-up fa-4x"></i>
          </div>
        </div>

        <h2 className="fw-900 text-dark mb-1">LEVEL UP!</h2>
        <p className="text-muted fw-bold mb-4 text-uppercase small letter-spacing-1">
          Você atingiu um novo patamar
        </p>

        <div className="mb-4">
            <span className="display-1 fw-900 text-success" style={{ letterSpacing: "-5px" }}>
                {level}
            </span>
        </div>

        <p className="text-dark mb-4 px-3">
          Sua dedicação está a dar frutos. Novos desafios e treinos esperam por si na biblioteca.
        </p>

        <Button 
          variant="success" 
          onClick={onHide} 
          className="w-100 rounded-pill py-3 fw-900 fs-5 shadow-lg border-0"
          style={{ letterSpacing: "1px" }}
        >
          CONTINUAR A EVOLUIR
        </Button>
      </Modal.Body>
    </Modal>
  );
}