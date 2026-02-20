import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { execucaoApi } from "../services/api";
import { PaginationComponent } from "../components/common/PaginationComponent";
import { ErrorModal } from "../components/common/ErrorModal";
import "../styles/Historico.css";

export function HistoricoTreinos() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const pageSize = 10;

  const carregarHistorico = async () => {
    setLoading(true);
    try {
      const data = await execucaoApi.getHistorico(currentPage, pageSize);
      if (data && data.content) {
        setHistorico(data.content);
        setTotalPages(data.totalPages);
      } else {
        setHistorico([]);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Não foi possível carregar seu histórico de treinos.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, [currentPage]);

  // Função para calcular a duração em minutos
  const calcularDuracao = (inicio, fim) => {
    if (!inicio || !fim) return "0";
    const diffMs = new Date(fim) - new Date(inicio);
    const diffMins = Math.round(diffMs / 60000);
    return diffMins;
  };

  // Funções para formatar a data separadamente para o design do card
  const getDia = (dataString) =>
    new Date(dataString).getDate().toString().padStart(2, "0");
  const getMes = (dataString) =>
    new Date(dataString).toLocaleString("pt-BR", { month: "short" });

  return (
    <div className="historico-container py-5">
      <Container>
        <div className="mb-5 text-center text-md-start">
          <h1 className="fw-black text-dark display-5 mb-2">Meu Histórico</h1>
          <p className="text-muted fs-5">
            Acompanhe sua evolução e os pontos que você conquistou.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              variant="success"
              style={{ width: "3rem", height: "3rem" }}
            />
            <h5 className="mt-3 fw-bold text-success">
              Carregando conquistas...
            </h5>
          </div>
        ) : historico.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5">
            <i className="fas fa-clipboard-list fa-4x text-muted mb-4 opacity-25"></i>
            <h4 className="fw-bold text-dark">Nenhum treino concluído ainda</h4>
            <p className="text-muted">
              Vá para a biblioteca, inicie um treino e comece a ganhar pontos!
            </p>
          </div>
        ) : (
          <>
            <div className="historico-list d-flex flex-column gap-3 mb-4">
              {historico.map((exec) => (
                <div
                  key={exec.id}
                  className="historico-card p-3 p-md-4 shadow-sm d-flex flex-column flex-md-row align-items-md-center gap-3 gap-md-4"
                >
                  {/* Bloco de Data (Quadrado Verde) */}
                  <div className="historico-date-box d-flex flex-row flex-md-column justify-content-center align-items-center flex-shrink-0">
                    <span className="historico-day me-2 me-md-0">
                      {getDia(exec.dataInicio)}
                    </span>
                    <span className="historico-month">
                      {getMes(exec.dataInicio)}
                    </span>
                  </div>

                  {/* Informações Principais */}
                  <div className="flex-grow-1">
                    <h4 className="fw-bolder text-dark mb-1">
                      {exec.nomeTreino || "Treino Realizado"}
                    </h4>
                    <div className="d-flex flex-wrap gap-3 text-muted small fw-bold">
                      <span>
                        <i className="far fa-clock me-1"></i>{" "}
                        {calcularDuracao(exec.dataInicio, exec.dataFim)} min de
                        treino
                      </span>
                      <span>
                        <i className="fas fa-calendar-alt me-1"></i>{" "}
                        {new Date(exec.dataInicio).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {/* Badge de Pontos */}
                  <div className="historico-pontos d-flex align-items-center gap-2 mt-2 mt-md-0 align-self-start align-self-md-center flex-shrink-0 shadow-sm">
                    <i className="fas fa-star text-warning"></i>+
                    {exec.pontosGanhos || 0} PTS
                  </div>
                </div>
              ))}
            </div>

            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              loading={loading}
            />
          </>
        )}

        <ErrorModal
          show={showError}
          handleClose={() => setShowError(false)}
          message={errorMessage}
        />
      </Container>
    </div>
  );
}
