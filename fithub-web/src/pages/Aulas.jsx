import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Container, Spinner, Button } from "react-bootstrap";

import { ClassGrid } from "../components/aulas/ClassGrid";
import { ParticipantsModal } from "../components/aulas/ParticipantsModal";
import { CreateClassModal } from "../components/aulas/CreateClassModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { ErrorModal } from "../components/common/ErrorModal"; 

export function Aulas() {
  const { user } = useContext(AuthContext);

  const [aulas, setAulas] = useState([]);
  const [aulasReservadas, setAulasReservadas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showParticipants, setShowParticipants] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 2. Estados de Erro
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedAulaId, setSelectedAulaId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const isInstructor =
    user?.nomePerfil &&
    (user.nomePerfil.includes("ROLE_PERSONAL") ||
      user.nomePerfil.includes("ROLE_ADMIN"));

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [dadosAulas, dadosReservas] = await Promise.all([
        apiFetch("/api/aulas/buscar"),
        apiFetch("/api/reservas/usuario"),
      ]);
      setAulas(dadosAulas);
      const idsReservados = dadosReservas.map((reserva) => reserva.aulaId);
      setAulasReservadas(idsReservados);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleReservar = async (id) => {
    try {
      await apiFetch(`/api/reservas/register`, {
        method: "POST",
        body: JSON.stringify({ aulaId: id }),
      });
      setSuccessMsg("Reserva realizada com sucesso!");
      setShowSuccess(true);
      carregarDados();
    } catch (error) {
      // 3. Substituir alert
      setErrorMessage("Não foi possível reservar: " + error.message);
      setShowError(true);
    }
  };

  const handleDeleteRequest = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await apiFetch(`/api/aulas/delete/${deleteId}`, { method: "DELETE" });
      setSuccessMsg("Aula cancelada com sucesso.");
      setShowSuccess(true);
      setShowConfirm(false);
      carregarDados();
    } catch (error) {
      // 3. Substituir alert
      setErrorMessage("Erro ao cancelar aula: " + error.message);
      setShowError(true);
      setShowConfirm(false); // Fecha confirmação para mostrar erro
    }
  };

  const handleCreateSuccess = () => {
    setSuccessMsg("Nova aula agendada com sucesso!");
    setShowSuccess(true);
    carregarDados();
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="success" />
      </div>
    );

  const aulasComStatus = aulas.map((aula) => ({
    ...aula,
    jaReservado: aulasReservadas.includes(aula.id),
  }));

  return (
    <div
      className="py-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold text-dark mb-1">Agenda de Aulas</h2>
            <p className="text-muted mb-0">
              Reserve o seu lugar e treine em grupo.
            </p>
          </div>
          <div className="d-flex gap-2">
            {isInstructor && (
              <Button
                variant="success"
                className="shadow-sm rounded-pill px-4 fw-bold"
                onClick={() => setShowCreate(true)}
              >
                <i className="fas fa-plus me-2"></i> Agendar Aula
              </Button>
            )}
            <Button
              variant="light"
              className="shadow-sm rounded-pill"
              onClick={carregarDados}
            >
              <i className="fas fa-sync-alt"></i>
            </Button>
          </div>
        </div>

        <ClassGrid
          aulas={aulasComStatus}
          isInstructor={isInstructor}
          onReservar={handleReservar}
          onVerParticipantes={(id) => {
            setSelectedAulaId(id);
            setShowParticipants(true);
          }}
          onDelete={handleDeleteRequest}
        />

        <ParticipantsModal
          show={showParticipants}
          handleClose={() => setShowParticipants(false)}
          aulaId={selectedAulaId}
        />
        <CreateClassModal
          show={showCreate}
          handleClose={() => setShowCreate(false)}
          onSuccess={handleCreateSuccess}
        />

        <ConfirmModal
          show={showConfirm}
          handleClose={() => setShowConfirm(false)}
          handleConfirm={confirmDelete}
          title="Cancelar Aula"
          message="Tem a certeza que deseja cancelar esta aula? Os alunos inscritos perderão a reserva."
        />
        <SuccessModal
          show={showSuccess}
          handleClose={() => setShowSuccess(false)}
          message={successMsg}
        />

        {/* 4. Inserir ErrorModal */}
        <ErrorModal
          show={showError}
          handleClose={() => setShowError(false)}
          message={errorMessage}
        />
      </Container>
    </div>
  );
}
