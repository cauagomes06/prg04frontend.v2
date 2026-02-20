import { Modal, Button, Form, Image, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";

export function EditDataModal({ show, handleClose, perfil, onSuccess }) {
  // Estados para dados de texto
  const [formData, setFormData] = useState({ nomeCompleto: "", telefone: "" });
  
  // Estados para imagem
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Preenche o formulário quando o perfil muda ou o modal abre
  useEffect(() => {
    if (perfil?.pessoa) {
      setFormData({
        nomeCompleto: perfil.pessoa.nomeCompleto || "",
        telefone: perfil.pessoa.telefone || "",
      });
      setPreview(perfil.criadorFoto || perfil.fotoUrl || null);
      setSelectedFile(null);
    }
  }, [perfil, show]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. ATUALIZAÇÃO DA FOTO
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        await apiFetch("/api/usuarios/me/foto", {
          method: "PATCH",
          body: uploadData, 
        });
      }

      // 2. ATUALIZAÇÃO DOS DADOS PESSOAIS
      if (formData.nomeCompleto !== perfil?.pessoa?.nomeCompleto || formData.telefone !== perfil?.pessoa?.telefone) {
          await apiFetch("/api/usuarios/me/dados-pessoais", {
            method: "PUT",
            body: JSON.stringify(formData),
          });
      }

      if (onSuccess) onSuccess(); 
      handleClose();
      
    } catch (error) {
      console.error("Erro no update:", error);
      // Aqui você poderia usar o ErrorModal, mas manteremos o fluxo funcional
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
        show={show} 
        onHide={handleClose} 
        centered 
        backdrop="static" 
        contentClassName="border-0 rounded-4 shadow overflow-hidden"
    >
      {/* Header Adaptável */}
      <Modal.Header closeButton className="borda-customizada" style={{ backgroundColor: "var(--primary-light)" }}>
        <Modal.Title className="fw-bold text-success">
            <i className="fas fa-user-edit me-2"></i>Editar Perfil
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4" style={{ backgroundColor: "var(--card-bg)" }}>
        <Form onSubmit={handleSubmit}>
          
          {/* --- ÁREA DE FOTO --- */}
          <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative mb-3">
              {preview ? (
                <Image 
                  src={preview} 
                  roundedCircle 
                  className="shadow-sm object-fit-cover"
                  style={{ width: "120px", height: "120px", border: "4px solid var(--border-color)" }} 
                />
              ) : (
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm borda-customizada"
                  style={{ width: "120px", height: "120px", backgroundColor: "var(--bg-light)" }}
                >
                  <i className="fas fa-camera fa-2x text-muted opacity-50"></i>
                </div>
              )}
              
              <div 
                className="position-absolute bottom-0 end-0 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px", border: "2px solid var(--card-bg)", backgroundColor: "var(--primary-color)" }}
              >
                  <i className="fas fa-pencil-alt text-white small"></i>
              </div>
            </div>
            
            <Form.Group className="w-100 text-center">
               <label htmlFor="file-upload" className="btn btn-sm btn-outline-success rounded-pill px-4 fw-bold shadow-none" style={{ cursor: 'pointer' }}>
                   Alterar Imagem
               </label>
               <Form.Control 
                    id="file-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="d-none" 
               />
            </Form.Group>
          </div>

          {/* --- DADOS PESSOAIS --- */}
          <div className="p-3 rounded-4 borda-customizada mb-3" style={{ backgroundColor: "var(--bg-light)" }}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-success text-uppercase">Nome Completo</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Seu nome"
                  className="border-0 shadow-none"
                  style={{ backgroundColor: "var(--card-bg)", color: "var(--text-dark)" }}
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-0">
                <Form.Label className="fw-bold small text-success text-uppercase">Telefone</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="(00) 00000-0000"
                  className="border-0 shadow-none"
                  style={{ backgroundColor: "var(--card-bg)", color: "var(--text-dark)" }}
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top" style={{ borderColor: "var(--border-color) !important" }}>
            <Button variant="link" onClick={handleClose} disabled={loading} className="text-muted fw-bold text-decoration-none shadow-none">
              Cancelar
            </Button>
            <Button 
                type="submit" 
                className="btn-success rounded-pill px-4 fw-bold border-0 shadow-sm" 
                disabled={loading}
            >
              {loading ? (
                <><Spinner animation="border" size="sm" className="me-2" /> Salvando...</>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}