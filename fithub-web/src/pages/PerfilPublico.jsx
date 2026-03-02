import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Container, Spinner, Button, Row, Col, Badge } from "react-bootstrap";

import { LibraryCard } from "../components/treinos/LibraryCard";
import { GaleriaConquistas } from "../components/perfil/GaleriaConquistas";
import "../styles/perfil.css";

export function PerfilPublico() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [treinosPublicos, setTreinosPublicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      setError(false);
      try {
        // 1. Busca os dados do Perfil Público
        const dadosPerfil = await apiFetch(`/api/usuarios/${id}/perfil-publico`);
        setPerfil(dadosPerfil);

        // 2. Busca os Treinos Públicos desse usuário
        const dadosTreinos = await apiFetch(`/api/usuarios/${id}/treinos-publicos?page=0&size=10`);
        setTreinosPublicos(dadosTreinos.content || []);
      } catch (err) {
        console.error("Erro ao carregar perfil público:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center mt-5">
        <Spinner animation="border" variant="success" />
        <h5 className="mt-3 text-success">Carregando perfil...</h5>
      </Container>
    );
  }

  if (error || !perfil) {
    return (
      <Container className="py-5 text-center mt-5">
        <i className="fas fa-user-times fa-3x text-muted mb-3"></i>
        <h4 className="text-muted">Usuário não encontrado.</h4>
        <Button variant="outline-success" className="mt-3 rounded-pill" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left me-2"></i> Voltar
        </Button>
      </Container>
    );
  }

  return (
    <div className="py-4 min-vh-100" style={{ backgroundColor: "var(--bg-light)" }}>
      <Container>
        {/* BOTÃO VOLTAR */}
        <Button variant="link" className="text-muted fw-bold p-0 mb-4 text-decoration-none" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left me-2"></i> Voltar
        </Button>

        {/* HEADER DO PERFIL */}
        <div className="p-4 rounded-4 shadow-sm mb-4 border" style={{ backgroundColor: "var(--card-bg)" }}>
          <Row className="align-items-center text-center text-md-start">
            <Col md="auto" className="mb-3 mb-md-0">
              {perfil.fotoUrl ? (
                <img 
                  src={perfil.fotoUrl} 
                  alt={perfil.nomeCompleto} 
                  className="rounded-circle border border-4 border-success object-fit-cover"
                  style={{ width: "120px", height: "120px" }}
                />
              ) : (
                <div className="rounded-circle border border-4 border-success d-flex align-items-center justify-content-center mx-auto mx-md-0" style={{ width: "120px", height: "120px", backgroundColor: "var(--bg-light)" }}>
                  <i className="fas fa-user fa-3x text-secondary"></i>
                </div>
              )}
            </Col>
            <Col>
              <h2 className="fw-black text-dark mb-1">{perfil.nomeCompleto}</h2>
              <p className="text-muted fw-bold mb-2">@{perfil.username.split('@')[0]}</p>
              
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2 mt-2">
                <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill shadow-sm fs-6">
                  <i className="fas fa-star me-1"></i> Nível {perfil.nivel}: {perfil.tituloNivel}
                </Badge>
                <Badge bg="success" className="px-3 py-2 rounded-pill shadow-sm fs-6">
                  <i className="fas fa-fire me-1"></i> {perfil.scoreTotal} XP
                </Badge>
              </div>
            </Col>
          </Row>
        </div>

        {/* GALERIA DE CONQUISTAS */}
        <div className="mb-5">
          <h4 className="fw-bold text-dark mb-3">
            <i className="fas fa-medal text-warning me-2"></i> Troféus de {perfil.nomeCompleto.split(' ')[0]}
          </h4>
          {/* O componente GaleriaConquistas precisa estar preparado para receber um usuarioId opcional */}
          <GaleriaConquistas usuarioId={perfil.id} apenasObtidas ={true} />
        </div>

        {/* TREINOS PÚBLICOS */}
        <div>
          <h4 className="fw-bold text-dark mb-3">
            <i className="fas fa-dumbbell text-success me-2"></i> Treinos Públicos
          </h4>
          {treinosPublicos.length === 0 ? (
            <div className="text-center py-5 border border-dashed rounded-4 text-muted" style={{ backgroundColor: "var(--card-bg)" }}>
              <p className="mb-0 fw-semibold">Este usuário ainda não compartilhou nenhum treino.</p>
            </div>
          ) : (
            <Row className="g-4">
              {treinosPublicos.map((treino) => (
                <Col xs={12} md={6} lg={4} key={treino.id}>
                   {/* Reutilizando o seu componente de card da biblioteca */}
                  <LibraryCard treino={treino} hideCreatorLink={true} />
                </Col>
              ))}
            </Row>
          )}
        </div>

      </Container>
    </div>
  );
}