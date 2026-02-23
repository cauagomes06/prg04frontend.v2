import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import '../../styles/trophy-toast.css';

export function TrophyToast({ show, onClose, conquista }) {
    if (!conquista) return null;

    return (
        <ToastContainer className="trophy-toast-container">
            <Toast 
                show={show} 
                onClose={onClose} 
                delay={5000} // Fica na tela por 5 segundos
                autohide 
                className="trophy-toast"
            >
                <Toast.Header closeButton={false} className="trophy-toast-header">
                    <strong className="me-auto text-warning">
                        <i className="fas fa-trophy me-2"></i> 
                        Conquista Desbloqueada!
                    </strong>
                    <small className="text-muted">Agora mesmo</small>
                </Toast.Header>
                <Toast.Body className="trophy-toast-body flex-row align-items-center p-3">
                    <div className="trophy-toast-icon">
                        <i className={`fas ${conquista.icone || 'fa-medal'}`}></i>
                    </div>
                    <div>
                        <div className="trophy-toast-title">{conquista.nome}</div>
                        <div className="trophy-toast-desc">{conquista.descricao}</div>
                    </div>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}