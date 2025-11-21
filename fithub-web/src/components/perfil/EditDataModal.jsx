import { Modal, Button, Form, Image } from "react-bootstrap";
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
        nomeCompleto: perfil.pessoa.nomeCompleto,
        telefone: perfil.pessoa.telefone,
      });
      // Mostra a foto atual se existir, senão null
      setPreview(perfil.fotoUrl || null);
      setSelectedFile(null);
    }
  }, [perfil, show]);

  // Lidar com a seleção de ficheiro
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Cria um URL temporário para mostrar a pré-visualização imediata
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Se houver ficheiro, faz o upload primeiro
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);

        // Chama o endpoint de upload que criamos no backend
        const fileResponse = await apiFetch("/api/files/upload", {
          method: "POST",
          body: uploadData, 
          // Nota: O api.js modificado vai detetar FormData e remover o Content-Type JSON
        });

        // 2. Com o URL recebido, atualiza a foto do utilizador
        if (fileResponse && fileResponse.url) {
          await apiFetch("/api/usuarios/me/foto", {
            method: "PATCH",
            body: JSON.stringify({ fotoUrl: fileResponse.url }),
          });
        }
      }

      // 3. Atualiza os dados textuais (Nome/Telefone)
      await apiFetch("/api/usuarios/me/dados-pessoais", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      onSuccess(); // Notifica o pai para atualizar tudo
      handleClose();
      
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          
          {/* --- ÁREA DE FOTO --- */}
          <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative mb-3">
              {preview ? (
                <Image 
                  src={preview} 
                  roundedCircle 
                  style={{ width: "120px", height: "120px", objectFit: "cover", border: "3px solid #0ad354" }} 
                />
              ) : (
                <div 
                  className="bg-light rounded-circle d-flex align-items-center justify-content-center border"
                  style={{ width: "120px", height: "120px" }}
                >
                  <i className="fas fa-user fa-3x text-secondary"></i>
                </div>
              )}
            </div>
            
            <Form.Group controlId="formFile" className="w-75">
              <Form.Label className="small text-muted text-center w-100">Alterar Foto de Perfil</Form.Label>
              <Form.Control type="file" accept="image/*" size="sm" onChange={handleFileChange} />
            </Form.Group>
          </div>

          {/* --- DADOS PESSOAIS --- */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nome Completo</Form.Label>
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
            <Form.Label className="fw-bold">Telefone</Form.Label>
            <Form.Control
              type="text"
              required
              value={formData.telefone}
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? (
                <span><i className="fas fa-spinner fa-spin me-2"></i>A Guardar...</span>
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