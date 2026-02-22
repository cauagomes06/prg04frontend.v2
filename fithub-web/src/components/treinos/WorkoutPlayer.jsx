import React, { useState, useEffect } from "react";
import { ProgressBar, Button, Badge } from "react-bootstrap";
import { execucaoApi } from "../../services/api";
import { ErrorModal } from "../common/ErrorModal";
import { LevelUpModal } from "../common/LevelUpModal";
import "../../styles/workoutPlayer.css";

export function WorkoutPlayer({ treino, onFechar }) {
  const listaExercicios = treino?.items || treino?.itens || [];

  const [timestampInicio] = useState(new Date().toISOString());
  const [segundosDecorridos, setSegundosDecorridos] = useState(0);
  const [tempoDescanso, setTempoDescanso] = useState(0);
  const [isDescansando, setIsDescansando] = useState(false);

  const [exercicioAtualIdx, setExercicioAtualIdx] = useState(0);
  const [logExecucao, setLogExecucao] = useState({});
  const [isFinalizando, setIsFinalizando] = useState(false);

  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [pontosGanhos, setPontosGanhos] = useState(0);
  const [novoNivel, setNovoNivel] = useState(1);

  const exercicioAtual = listaExercicios[exercicioAtualIdx];
  const idExAtual = exercicioAtual?.exercicioId || exercicioAtual?.id;
  const seriesTotal = parseInt(exercicioAtual?.series) || 0;
  const descansoSegundos = parseInt(exercicioAtual?.descanso) || 0;
  const seriesAtuais = logExecucao[idExAtual] || 0;

  useEffect(() => {
    const sTimer = setInterval(() => setSegundosDecorridos((p) => p + 1), 1000);
    return () => clearInterval(sTimer);
  }, []);

  useEffect(() => {
    let dTimer;
    if (isDescansando && tempoDescanso > 0) {
      dTimer = setInterval(() => setTempoDescanso((p) => p - 1), 1000);
    } else if (tempoDescanso === 0) {
      setIsDescansando(false);
    }
    return () => clearInterval(dTimer);
  }, [isDescansando, tempoDescanso]);

  const handleToggleSerie = (indexSerie) => {
    const novasSeries = indexSerie + 1;
    if (seriesAtuais === novasSeries) {
      setLogExecucao({ ...logExecucao, [idExAtual]: seriesAtuais - 1 });
      setIsDescansando(false);
      setTempoDescanso(0);
    } else {
      setLogExecucao({ ...logExecucao, [idExAtual]: novasSeries });
      if (descansoSegundos > 0) {
        setTempoDescanso(descansoSegundos);
        setIsDescansando(true);
      } else {
        setIsDescansando(false);
      }
    }
  };

  const handleFinalizarTreino = async () => {
    setIsFinalizando(true);
    const dadosSessao = {
      treinoId: treino.id,
      dataInicio: timestampInicio,
      dataFim: new Date().toISOString(),
      itens: Object.keys(logExecucao).map((id) => ({
        exercicioId: parseInt(id),
        seriesConcluidas: logExecucao[id],
      })),
    };

    try {
      const response = await execucaoApi.finalizar(dadosSessao);
      setPontosGanhos(response.pontosGanhos || 0);
      setNovoNivel(response.nivelAtual || 1);
      setShowSuccessScreen(true);

      if (response.subiuDeNivel) {
        setTimeout(() => {
          setShowLevelUpModal(true);
        }, 300);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao salvar o treino.",
      );
      setShowError(true);
    } finally {
      setIsFinalizando(false);
    }
  };

  const formatarTempo = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (listaExercicios.length === 0) return null;

  return (
    <>
      {showSuccessScreen ? (
        <div className="success-overlay">
          <div className="text-center animate-up-1">
            <i className="fas fa-trophy fa-7x text-warning mb-4 trophy-pulse"></i>
          </div>
          <h1 className="fw-black display-3 mb-2 text-center animate-up-2">
            TREINO CONCLUÍDO!
          </h1>
          <div className="animate-up-2 mb-4 mt-2">
            <Badge
              bg="light"
              text="success"
              className="xp-badge-concluded shadow-sm fw-black"
            >
              +{pontosGanhos} PONTOS
            </Badge>
          </div>
          <p className="fs-5 mb-5 opacity-75 text-center px-4 animate-up-3">
            Excelente trabalho! O seu esforço foi registrado.
          </p>
          <Button
            variant="light"
            size="lg"
            className="btn-continue-workout shadow-lg animate-up-3"
            onClick={onFechar}
          >
            CONTINUAR
          </Button>
        </div>
      ) : (
        <div className="workout-player-overlay">
          <div className="player-topbar border-bottom d-flex justify-content-between align-items-center px-3 py-3 shadow-sm">
            <div className="d-flex align-items-center gap-3">
              <div className="session-timer bg-success text-white px-3 py-1 rounded-3 fw-bold">
                {formatarTempo(segundosDecorridos)}
              </div>
              <h5 className="player-treino-nome mb-0 fw-bold text-dark text-truncate">
                {treino.nome}
              </h5>
            </div>
            <Button
              variant="link"
              className="text-danger p-0 fs-3"
              onClick={onFechar}
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>

          <ProgressBar
            variant="success"
            now={((exercicioAtualIdx + 1) / listaExercicios.length) * 100}
            className="player-progress-bar"
          />

          <div className="player-content">
            <div className="text-center mb-4 mt-2">
              <Badge bg="dark" className="mb-2 uppercase">
                Exercício {exercicioAtualIdx + 1} de {listaExercicios.length}
              </Badge>
              <h2 className="fw-black text-dark display-6">
                {exercicioAtual.nomeExercicio}
              </h2>
            </div>

            <div className="sets-list px-2">
              {Array.from({ length: seriesTotal }).map((_, i) => {
                const isDone = seriesAtuais > i;
                const isNext = i === seriesAtuais || i === seriesAtuais - 1;
                return (
                  <div
                    key={i}
                    className={`set-row ${isDone ? "completed" : ""} ${isNext ? "next-available" : "locked"}`}
                    onClick={() => isNext && handleToggleSerie(i)}
                  >
                    <span className="set-number fs-4 fw-bold text-muted">
                      #{i + 1}
                    </span>
                    <div className="set-details text-center">
                      <span className="fs-3 fw-bold text-dark">
                        {exercicioAtual.repeticoes}
                      </span>
                      <small className="label-reps">Repetições</small>
                    </div>
                    <i
                      className={`fas fa-check-circle fs-1 check-icon ${isDone ? "active" : ""}`}
                    ></i>
                  </div>
                );
              })}
            </div>

            {isDescansando && (
              <div className="inline-rest-container mx-2 mt-4">
                <div className="inline-rest-circle">
                  <span className="inline-rest-number">{tempoDescanso}</span>
                </div>
                <Button
                  variant="outline-success"
                  className="rounded-pill mt-3 px-4 fw-bold"
                  onClick={() => setIsDescansando(false)}
                >
                  PULAR
                </Button>
              </div>
            )}
          </div>

          <div className="player-footer border-top p-3 position-absolute bottom-0 w-100">
            <div className="d-flex gap-2">
              <Button
                variant="light"
                className="btn-footer-secondary"
                onClick={() => setExercicioAtualIdx((p) => p - 1)}
                disabled={exercicioAtualIdx === 0}
              >
                ANTERIOR
              </Button>
              {exercicioAtualIdx === listaExercicios.length - 1 ? (
                <Button
                  variant="dark"
                  className="btn-footer-primary shadow"
                  onClick={handleFinalizarTreino}
                  disabled={isFinalizando}
                >
                  {isFinalizando ? "SALVANDO..." : "FINALIZAR"}
                </Button>
              ) : (
                <Button
                  variant="success"
                  className="btn-footer-primary shadow"
                  onClick={() => {
                    setExercicioAtualIdx((p) => p + 1);
                    setIsDescansando(false);
                  }}
                >
                  PRÓXIMO
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <LevelUpModal
        show={showLevelUpModal}
        level={novoNivel}
        onHide={() => setShowLevelUpModal(false)}
      />
      <ErrorModal
        show={showError}
        handleClose={() => setShowError(false)}
        message={errorMessage}
      />
    </>
  );
}
