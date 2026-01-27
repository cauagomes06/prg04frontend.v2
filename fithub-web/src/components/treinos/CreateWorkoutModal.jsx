import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Table, Spinner } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { ConfirmModal } from "../common/ConfirmModal";
import { SuccessModal } from "../common/SuccessModal";
import { ErrorModal } from "../common/ErrorModal"; // Importando o Modal de Erro correto

export function CreateWorkoutModal({ show, handleClose, onSuccess }) {
  const { user } = useContext(AuthContext);

  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [loadingExercicios, setLoadingExercicios] = useState(false);

  const [nome, setNome] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("TODOS");

  const [exercicioSelecionado, setExercicioSelecionado] = useState("");
  const [series, setSeries] = useState("3");
  const [repeticoes, setRepeticoes] = useState("10-12");
  const [descanso, setDescanso] = useState("60");

  const [itensTreino, setItensTreino] = useState([]);

  // Estados de Modais Internos
  const [confirmData, setConfirmData] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [successData, setSuccessData] = useState({ show: false, message: "" });
  const [errorData, setErrorData] = useState({ show: false, message: "" });

  // Carregar exercícios ao abrir o modal
  // Carregar exercícios ao abrir o modal
  useEffect(() => {
    if (show) {
      setLoadingExercicios(true);

      // ADICIONEI ?size=100 para tentar trazer todos os exercícios para o dropdown
      apiFetch("/api/exercicios/buscar?size=100")
        .then((data) => {
          // CORREÇÃO: Verifica se é Page (tem .content) ou Lista Pura
          if (data.content && Array.isArray(data.content)) {
            setExerciciosDisponiveis(data.content); // Pega a lista de dentro do Page
          } else if (Array.isArray(data)) {
            setExerciciosDisponiveis(data); // Caso o backend mude para List no futuro
          } else {
            console.warn("Formato de resposta inesperado:", data);
            setExerciciosDisponisveis([]);
          }
        })
        .catch((err) => {
          console.error("Erro ao carregar exercícios:", err);
          setExerciciosDisponiveis([]);
          setErrorData({
            show: true,
            message: "Não foi possível carregar a lista de exercícios.",
          });
        })
        .finally(() => setLoadingExercicios(false));

      // Resetar formulário
      setNome("");
      setObjetivo("");
      setItensTreino([]);
      setFiltroGrupo("TODOS");
      setExercicioSelecionado("");
    }
  }, [show]);

  // Derivação segura dos grupos musculares (Evita crash se a lista for nula)
  const gruposMusculares = [
    "TODOS",
    ...new Set(
      (exerciciosDisponiveis || [])
        .map((ex) => ex.grupoMuscular)
        .filter(Boolean),
    ),
  ];

  const exerciciosFiltrados =
    filtroGrupo === "TODOS"
      ? exerciciosDisponiveis || []
      : (exerciciosDisponiveis || []).filter(
          (ex) => ex.grupoMuscular === filtroGrupo,
        );

  // Adicionar item à tabela
  const handleAddItem = () => {
    if (!exercicioSelecionado) {
      setErrorData({ show: true, message: "Selecione um exercício válido!" });
      return;
    }

    const exercicioObj = exerciciosDisponiveis.find(
      (ex) => ex.id === parseInt(exercicioSelecionado),
    );

    if (!exercicioObj) return;

    const novoItem = {
      exercicioId: parseInt(exercicioSelecionado),
      nomeExercicio: exercicioObj.nome,
      grupo: exercicioObj.grupoMuscular,
      series,
      repeticoes,
      descanso,
    };

    setItensTreino([...itensTreino, novoItem]);
    setExercicioSelecionado("");
  };

  const handleRemoveItem = (index) => {
    setItensTreino(itensTreino.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (itensTreino.length === 0) {
      setErrorData({
        show: true,
        message: "Adicione pelo menos um exercício ao treino!",
      });
      return;
    }

    setConfirmData({
      show: true,
      title: "Salvar treino",
      message: "Deseja realmente salvar esta ficha de treino?",
      onConfirm: () => executarCriacao(),
    });
  };

  const executarCriacao = async () => {
    setConfirmData({ ...confirmData, show: false });

    const treinoDto = {
      nome,
      descricao: objetivo,
      alunoId: user.id,
      instrutorId: user.id,
      items: itensTreino.map((item, index) => ({
        exercicioId: item.exercicioId,
        series: item.series.toString(),
        repeticoes: item.repeticoes,
        descanso: item.descanso.toString(),
        ordem: index + 1,
      })),
    };

    try {
      await apiFetch("/api/treinos/register", {
        method: "POST",
        body: JSON.stringify(treinoDto),
      });

      setSuccessData({ show: true, message: "Treino criado com sucesso!" });

      // Atualiza a lista no fundo imediatamente
      if (onSuccess) onSuccess();

      setTimeout(() => {
        // Usa 'prev' para garantir que estamos mexendo no estado mais atual,
        // ou apenas reseta para o estado inicial limpo.
        setSuccessData((prev) => ({ ...prev, show: false }));
        handleClose();
      }, 1500);
    } catch (error) {
      setErrorData({
        show: true,
        message: "Erro ao criar treino: " + error.message,
      });
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-success">
            <i className="fas fa-file-signature me-2"></i> Criar Nova Ficha
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Nome e Objetivo */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Nome do Treino</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Treino A - Peito e Tríceps"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Objetivo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Hipertrofia"
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h5 className="mb-3 text-muted">Adicionar Exercícios</h5>

            {loadingExercicios ? (
              <div className="text-center py-3">
                <Spinner animation="border" variant="success" size="sm" />
                <span className="ms-2">Carregando lista de exercícios...</span>
              </div>
            ) : (
              <Row className="g-2 mb-2 align-items-end">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="small text-muted">Grupo</Form.Label>
                    <Form.Select
                      value={filtroGrupo}
                      onChange={(e) => {
                        setFiltroGrupo(e.target.value);
                        setExercicioSelecionado("");
                      }}
                    >
                      {gruposMusculares.map((grupo) => (
                        <option key={grupo} value={grupo}>
                          {grupo}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={9}>
                  <Form.Group>
                    <Form.Label className="small text-muted">
                      Exercício
                    </Form.Label>
                    <Form.Select
                      value={exercicioSelecionado}
                      onChange={(e) => setExercicioSelecionado(e.target.value)}
                    >
                      <option value="">-- Selecione --</option>
                      {exerciciosFiltrados.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.nome}{" "}
                          {filtroGrupo === "TODOS"
                            ? `(${ex.grupoMuscular})`
                            : ""}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* Configuração de Séries/Reps */}
            <Row className="align-items-end g-2 mb-3">
              <Col md={3}>
                <Form.Label className="small text-muted">Séries</Form.Label>
                <Form.Control
                  type="text"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="small text-muted">Reps</Form.Label>
                <Form.Control
                  type="text"
                  value={repeticoes}
                  onChange={(e) => setRepeticoes(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="small text-muted">
                  Descanso (s)
                </Form.Label>
                <Form.Control
                  type="text"
                  value={descanso}
                  onChange={(e) => setDescanso(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-success"
                  className="w-100 fw-bold"
                  onClick={handleAddItem}
                  disabled={loadingExercicios}
                >
                  <i className="fas fa-plus me-1"></i> Incluir
                </Button>
              </Col>
            </Row>

            {/* Tabela de Itens Adicionados */}
            {itensTreino.length > 0 ? (
              <div className="table-responsive border rounded-3 mt-3">
                <Table striped hover size="sm" className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-3">Exercício</th>
                      <th className="text-center">Séries</th>
                      <th className="text-center">Reps</th>
                      <th className="text-center">Desc</th>
                      <th className="text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensTreino.map((item, index) => (
                      <tr key={index} className="align-middle">
                        <td className="ps-3 fw-bold text-secondary">
                          {item.nomeExercicio}
                        </td>
                        <td className="text-center">{item.series}</td>
                        <td className="text-center">{item.repeticoes}</td>
                        <td className="text-center">{item.descanso}s</td>
                        <td className="text-center">
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted border border-dashed rounded bg-light mt-3">
                <small>Nenhum exercício adicionado a esta ficha ainda.</small>
              </div>
            )}

            {/* Botões de Rodapé */}
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Button variant="light" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="success" type="submit" className="px-4 fw-bold">
                Salvar Ficha
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modais de Feedback */}
      <ConfirmModal
        show={confirmData.show}
        title={confirmData.title}
        message={confirmData.message}
        handleClose={() => setConfirmData({ ...confirmData, show: false })}
        handleConfirm={confirmData.onConfirm}
      />
      <SuccessModal
        show={successData.show}
        message={successData.message}
        handleClose={() => setSuccessData({ ...successData, show: false })}
      />
      <ErrorModal
        show={errorData.show}
        message={errorData.message}
        handleClose={() => setErrorData({ ...errorData, show: false })}
      />
    </>
  );
}
