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
        nomeCompleto: perfil.pessoa.nomeCompleto || "",
        telefone: perfil.pessoa.telefone || "",
      });
      // Mostra a foto atual se existir, senão null
      setPreview(perfil.criadorFoto || perfil.fotoUrl || null);
      setSelectedFile(null);
    }
  }, [perfil, show]);

  // Lidar com a seleção de ficheiro
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Cria um URL temporário para mostrar a pré-visualização imediata
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Limpeza de memória ao desmontar
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. ATUALIZAÇÃO DA FOTO (Se houver nova foto selecionada)
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile); // A chave deve ser 'file' para bater com o Java

        // Chama o endpoint direto do usuário que aceita MultipartFile
        // O apiFetch modificado detectará FormData e NÃO adicionará Content-Type JSON
        await apiFetch("/api/usuarios/me/foto", {
          method: "PATCH",
          body: uploadData, 
        });
      }

      // 2. ATUALIZAÇÃO DOS DADOS PESSOAIS (Nome/Telefone)
      // Verifica se houve mudança nos dados de texto antes de enviar
      if (formData.nomeCompleto !== perfil?.pessoa?.nomeCompleto || formData.telefone !== perfil?.pessoa?.telefone) {
          // Ajuste a rota conforme seu backend (ex: /dados-pessoais ou o endpoint de update do usuário)
          await apiFetch("/api/usuarios/me/dados-pessoais", {
            method: "PUT",
            body: JSON.stringify(formData),
          });
      }

      // 3. Sucesso total
      if (onSuccess) onSuccess(); 
      handleClose();
      
    } catch (error) {
      console.error("Erro no update:", error);
      alert("Erro ao atualizar perfil: " + (error.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" contentClassName="border-0 rounded-4 shadow">
      {/* Header com estilo verde claro consistente */}
      <Modal.Header closeButton style={{ backgroundColor: "#dcfce7", borderBottom: "none" }}>
        <Modal.Title className="fw-bold" style={{ color: "#166534" }}>
            <i className="fas fa-user-edit me-2"></i>Editar Perfil
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4" style={{ backgroundColor: "#f0fdf4" }}>
        <Form onSubmit={handleSubmit}>
          
          {/* --- ÁREA DE FOTO --- */}
          <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative mb-3">
              {preview ? (
                <Image 
                  src={preview} 
                  roundedCircle 
                  className="shadow-sm object-fit-cover"
                  style={{ width: "120px", height: "120px", border: "4px solid #fff" }} 
                />
              ) : (
                <div 
                  className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm border border-light"
                  style={{ width: "120px", height: "120px" }}
                >
                  <i className="fas fa-camera fa-2x text-muted opacity-50"></i>
                </div>
              )}
              
              {/* Botão flutuante para indicar edição */}
              <div 
                className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px", border: "2px solid #f0fdf4" }}
              >
                  <i className="fas fa-pencil-alt text-success small"></i>
              </div>
            </div>
            
            <Form.Group className="w-100 text-center">
               <label htmlFor="file-upload" className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold" style={{ cursor: 'pointer' }}>
                   Escolher Nova Foto
               </label>
               <Form.Control 
                    id="file-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="d-none" // Esconde o input padrão feio
               />
            </Form.Group>
          </div>

          {/* --- DADOS PESSOAIS --- */}
          <div className="bg-white p-3 rounded-4 shadow-sm border border-light mb-3">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-success">NOME COMPLETO</Form.Label>
                <Form.Control
                  type="text"
                  required
                  className="border-0 bg-light"
                  value={formData.nomeCompleto}
                  onChange={(e) =>
                    setFormData({ ...formData, nomeCompleto: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-0">
                <Form.Label className="fw-bold small text-success">TELEFONE</Form.Label>
                <Form.Control
                  type="text"
                  required
                  className="border-0 bg-light"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                />
              </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top border-light">
            <Button variant="link" onClick={handleClose} disabled={loading} className="text-muted fw-bold text-decoration-none">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-pill px-4 fw-bold border-0 shadow-sm" style={{ backgroundColor: "#22c55e" }} disabled={loading}>
              {loading ? (
                <span><i className="fas fa-spinner fa-spin me-2"></i>Salvando...</span>
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