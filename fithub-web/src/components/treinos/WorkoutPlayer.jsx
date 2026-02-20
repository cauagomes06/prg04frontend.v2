import React, { useState, useEffect } from "react";
import { ProgressBar, Button, Badge } from "react-bootstrap";
import { execucaoApi } from "../../services/api";
import { ErrorModal } from "../common/ErrorModal";
import "../../styles/WorkoutPlayer.css";

export function WorkoutPlayer({ treino, onFechar }) {
  const listaExercicios = treino?.items || treino?.itens || [];

  // Estados de Tempo
  const [timestampInicio] = useState(new Date().toISOString());
  const [segundosDecorridos, setSegundosDecorridos] = useState(0);
  const [tempoDescanso, setTempoDescanso] = useState(0);
  const [isDescansando, setIsDescansando] = useState(false);

  // Estados de Progresso e UI
  const [exercicioAtualIdx, setExercicioAtualIdx] = useState(0);
  const [logExecucao, setLogExecucao] = useState({});
  const [isFinalizando, setIsFinalizando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- NOVO ESTADO PARA OS PONTOS ---
  const [pontosGanhos, setPontosGanhos] = useState(0);

  const exercicioAtual = listaExercicios[exercicioAtualIdx];
  const idExAtual = exercicioAtual?.exercicioId || exercicioAtual?.id;

  const seriesTotal = parseInt(exercicioAtual?.series) || 0;
  const descansoSegundos = parseInt(exercicioAtual?.descanso) || 0;
  const seriesAtuais = logExecucao[idExAtual] || 0;

  // Timer da Sessão (Tempo Total)
  useEffect(() => {
    const sTimer = setInterval(() => setSegundosDecorridos((p) => p + 1), 1000);
    return () => clearInterval(sTimer);
  }, []);

  // Timer de Descanso
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
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }, 50);
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
      // --- CAPTURA A RESPOSTA PARA PEGAR OS PONTOS ---
      const response = await execucaoApi.finalizar(dadosSessao);
      // Assume que o backend retorna algo como { id: 12, pontosGanhos: 150, ... }
      // Se o seu backend não retornar 'pontosGanhos', ele mostrará 0.
      setPontosGanhos(response.pontosGanhos || 0);

      setShowSuccess(true); // Aciona a nova tela de vitória
    } catch (err) {
      console.error(err);
      const mensagemErro =
        err.response?.data?.message ||
        err.message ||
        "Erro desconhecido ao salvar o treino.";
      setErrorMessage(mensagemErro);
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

  // --- NOVA TELA DE VITÓRIA ANIMADA E COM PONTOS ---
  if (showSuccess) {
    return (
      <div className="success-overlay">
        <div className="text-center animate-up-1">
          {/* Troféu maior e com animação de pulso/brilho */}
          <i className="fas fa-trophy fa-7x text-warning mb-4 trophy-pulse"></i>
        </div>

        <h1
          className="fw-black display-3 mb-2 text-center animate-up-2"
          style={{ lineHeight: 1.1 }}
        >
          TREINO
          <br />
          CONCLUÍDO!
        </h1>

        {/* Badge de Pontos Ganhos */}
        <div className="animate-up-2 mb-4 mt-2">
          <Badge
            bg="light"
            text="success"
            className="fs-2 px-4 py-2 rounded-pill shadow-sm fw-black"
          >
            +{pontosGanhos} PONTOS
          </Badge>
        </div>

        <p
          className="fs-5 mb-5 opacity-75 text-center px-4 animate-up-3"
          style={{ maxWidth: "400px" }}
        >
          Excelente trabalho! O seu esforço foi registado no histórico.
        </p>

        <Button
          variant="light"
          size="lg"
          className="rounded-pill px-5 py-3 fw-bold text-success shadow-lg animate-up-3 w-75"
          onClick={onFechar}
        >
          CONTINUAR
        </Button>
      </div>
    );
  }

  // --- TELA DO PLAYER PRINCIPAL (Sem alterações aqui) ---
  return (
    <div className="workout-player-overlay">
      <div
        className="player-topbar border-bottom bg-white d-flex justify-content-between align-items-center px-3 py-3 shadow-sm"
        style={{ zIndex: 10 }}
      >
        <div className="d-flex align-items-center gap-3">
          <div className="session-timer bg-success text-white px-3 py-1 rounded-3 fw-bold">
            {formatarTempo(segundosDecorridos)}
          </div>
          <h5
            className="mb-0 fw-bold text-dark text-truncate"
            style={{ maxWidth: "180px" }}
          >
            {treino.nome}
          </h5>
        </div>
        <Button
          variant="link"
          className="text-danger p-0 fs-3 text-decoration-none"
          onClick={onFechar}
        >
          <i className="fas fa-times"></i>
        </Button>
      </div>

      <ProgressBar
        variant="success"
        now={((exercicioAtualIdx + 1) / listaExercicios.length) * 100}
        style={{ height: "6px", borderRadius: 0 }}
      />

      <div className="player-content">
        <div className="text-center mb-4 mt-2">
          <Badge bg="dark" className="mb-2">
            EXERCÍCIO {exercicioAtualIdx + 1} DE {listaExercicios.length}
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
                className={`set-row ${isDone ? "completed" : ""}`}
                onClick={() => isNext && handleToggleSerie(i)}
                style={{
                  opacity: isNext || isDone ? 1 : 0.4,
                  cursor: isNext ? "pointer" : "default",
                }}
              >
                <span className="set-number fs-4 fw-bold text-muted">
                  #{i + 1}
                </span>
                <div className="set-details text-center">
                  <span className="fs-3 fw-bold text-dark">
                    {exercicioAtual.repeticoes}
                  </span>
                  <small
                    className="d-block text-muted text-uppercase fw-bold"
                    style={{ fontSize: "0.6rem" }}
                  >
                    Repetições
                  </small>
                </div>
                <div className={`check-button`}>
                  <i
                    className={`fas fa-check-circle fs-1 ${isDone ? "text-success" : "text-light"}`}
                  ></i>
                </div>
              </div>
            );
          })}
        </div>

        {isDescansando && (
          <div
            key={seriesAtuais}
            className="inline-rest-container mx-2 mt-4 mb-5"
          >
            <Badge
              bg="success"
              className="mb-3 px-3 py-2 rounded-pill fs-6 text-uppercase tracking-wide"
            >
              Tempo de Descanso
            </Badge>
            <div className="inline-rest-circle">
              <span className="inline-rest-number">{tempoDescanso}</span>
              <span className="text-muted fw-bold small mt-1 text-uppercase">
                Segundos
              </span>
            </div>
            <Button
              variant="outline-success"
              className="rounded-pill px-5 py-2 fw-bold bg-white"
              onClick={() => setIsDescansando(false)}
            >
              PULAR DESCANSO
            </Button>
          </div>
        )}
      </div>

      <div className="player-footer bg-white p-3 border-top shadow-lg position-absolute bottom-0 w-100">
        <div className="d-flex gap-2">
          <Button
            variant="light"
            className="flex-grow-1 py-3 fw-bold border rounded-4"
            onClick={() => setExercicioAtualIdx((p) => p - 1)}
            disabled={exercicioAtualIdx === 0}
          >
            ANTERIOR
          </Button>

          {exercicioAtualIdx === listaExercicios.length - 1 ? (
            <Button
              variant="dark"
              className="flex-grow-1 py-3 fw-bold rounded-4 shadow"
              onClick={handleFinalizarTreino}
              disabled={isFinalizando}
            >
              {isFinalizando ? "SALVANDO..." : "FINALIZAR TREINO"}
            </Button>
          ) : (
            <Button
              variant="success"
              className="flex-grow-1 py-3 fw-bold rounded-4 shadow"
              onClick={() => {
                setExercicioAtualIdx((p) => p + 1);
                setIsDescansando(false);
              }}
            >
              PRÓXIMO EXERCÍCIO
            </Button>
          )}
        </div>
      </div>

      <ErrorModal
        show={showError}
        handleClose={() => setShowError(false)}
        message={errorMessage}
      />
    </div>
  );
}
