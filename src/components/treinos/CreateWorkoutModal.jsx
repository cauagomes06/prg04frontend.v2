import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { ConfirmModal } from "../common/ConfirmModal";
import { SuccessModal } from "../common/SuccessModal";

export function CreateWorkoutModal({ show, handleClose, onSuccess }) {
  const { user } = useContext(AuthContext);

  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);

  const [nome, setNome] = useState("");
  const [objetivo, setObjetivo] = useState("");

  const [filtroGrupo, setFiltroGrupo] = useState("TODOS");

  const [exercicioSelecionado, setExercicioSelecionado] = useState("");
  const [series, setSeries] = useState("3");
  const [repeticoes, setRepeticoes] = useState("10-12");
  const [descanso, setDescanso] = useState("60");

  const [itensTreino, setItensTreino] = useState([]);

  // ⬇️ MODAIS ⬇️
  const [confirmData, setConfirmData] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [successData, setSuccessData] = useState({
    show: false,
    message: "",
  });

  // Carregar exercícios ao abrir
  useEffect(() => {
    if (show) {
      apiFetch("/api/exercicios/buscar")
        .then((data) => setExerciciosDisponiveis(data))
        .catch((err) => console.error("Erro ao carregar exercícios:", err));

      setNome("");
      setObjetivo("");
      setItensTreino([]);
      setFiltroGrupo("TODOS");
    }
  }, [show]);

  const gruposMusculares = [
    "TODOS",
    ...new Set(
      exerciciosDisponiveis.map((ex) => ex.grupoMuscular).filter(Boolean)
    ),
  ];

  const exerciciosFiltrados =
    filtroGrupo === "TODOS"
      ? exerciciosDisponiveis
      : exerciciosDisponiveis.filter((ex) => ex.grupoMuscular === filtroGrupo);

  // Adicionar item
  const handleAddItem = () => {
    if (!exercicioSelecionado) {
      setSuccessData({
        show: true,
        title: "Aviso!",
        message: "Selecione um exercício!",
      });
      return;
    }

    const exercicioObj = exerciciosDisponiveis.find(
      (ex) => ex.id == exercicioSelecionado
    );

    const novoItem = {
      exercicioId: parseInt(exercicioSelecionado),
      nomeExercicio: exercicioObj?.nome,
      grupo: exercicioObj?.grupoMuscular,
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

  // ============================
  // CONFIRMAR ANTES DE SALVAR
  // ============================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (itensTreino.length === 0) {
      setSuccessData({
        show: true,
        title:"Aviso!",
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

  // ============================
  // EXECUÇÃO FINAL DA CRIAÇÃO
  // ============================
  const executarCriacao = async () => {
    setConfirmData({ ...confirmData, show: false });

    const treinoDto = {
      nome,
      descricao: objetivo,
      alunoId: user.id,
      instrutorId: user.id,
      items: itensTreino.map((item) => ({
        exercicioId: item.exercicioId,
        series: item.series.toString(),
        repeticoes: item.repeticoes,
        descanso: item.descanso.toString(),
        ordem: 1,
      })),
    };

    try {
      await apiFetch("/api/treinos/register", {
        method: "POST",
        body: JSON.stringify(treinoDto),
      });

      setSuccessData({
        show: true,
        title:"Sucesso!",
        message: "Treino criado com sucesso!",
      });

      onSuccess();
      handleClose();
    } catch (error) {
      setSuccessData({
        show: true,
        title:"Erro",
        message: "Erro ao criar treino: " + error.message,
      });
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Criar Nova Ficha</Modal.Title>
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
                    placeholder="Ex: Treino A"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    Objetivo / Descrição
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Foco em Hipertrofia"
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h5 className="mb-3">Adicionar Exercícios</h5>

            {/* Filtro + Exercícios */}
            <Row className="g-2 mb-2">
              <Col md={3}>
                <Form.Label>Filtrar por Grupo</Form.Label>
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
              </Col>

              <Col md={9}>
                <Form.Label>Selecione o Exercício</Form.Label>
                <Form.Select
                  value={exercicioSelecionado}
                  onChange={(e) => setExercicioSelecionado(e.target.value)}
                >
                  <option value="">-- Selecione --</option>
                  {exerciciosFiltrados.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.nome}
                      {filtroGrupo === "TODOS" ? ` (${ex.grupoMuscular})` : ""}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Séries / Reps / Descanso */}
            <Row className="align-items-end g-2 mb-3">
              <Col md={3}>
                <Form.Label>Séries</Form.Label>
                <Form.Control
                  type="text"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Reps</Form.Label>
                <Form.Control
                  type="text"
                  value={repeticoes}
                  onChange={(e) => setRepeticoes(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Descanso</Form.Label>
                <Form.Control
                  type="text"
                  value={descanso}
                  onChange={(e) => setDescanso(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Button
                  variant="success"
                  className="w-100"
                  onClick={handleAddItem}
                >
                  <i className="fas fa-plus"></i> Adicionar
                </Button>
              </Col>
            </Row>

            {/* Tabela */}
            {itensTreino.length > 0 && (
              <Table striped bordered hover size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th>Exercício</th>
                    <th>Séries</th>
                    <th>Reps</th>
                    <th>Descanso</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {itensTreino.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nomeExercicio}</td>
                      <td>{item.series}</td>
                      <td>{item.repeticoes}</td>
                      <td>{item.descanso}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            {/* Botões */}
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar Ficha
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modais */}
      <ConfirmModal
        show={confirmData.show}
        title={confirmData.title}
        message={confirmData.message}
        handleClose={() => setConfirmData({ ...confirmData, show: false })}
        handleConfirm={confirmData.onConfirm}
      />

      <SuccessModal
        show={successData.show}
        title={successData.title}
        message={successData.message}
        handleClose={() => setSuccessData({ ...successData, show: false })}
      />
    </>
  );
}
