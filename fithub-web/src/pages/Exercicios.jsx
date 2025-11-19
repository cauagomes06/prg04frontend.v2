import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { Table, Button, Badge, Card, Modal, Spinner, Form, InputGroup } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { CreateExerciseModal } from "../components/CreateExerciseModal";

export function Exercicios() {
  const { user } = useContext(AuthContext);
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Modais ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- Estados auxiliares ---
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // --- FILTROS ---
  const [filtroMusculo, setFiltroMusculo] = useState("TODOS");
  const [termoBusca, setTermoBusca] = useState("");

  const gruposMusculares = [
    "TODOS", "PEITO", "COSTAS", "PERNAS", "OMBROS", "BRAÇOS", "ABDÔMEN", "GLÚTEOS", "PANTURRILHA", "FULL BODY"
  ];

  const isPersonalOrAdmin =
    user?.nomePerfil &&
    (user.nomePerfil.toUpperCase().includes("ROLE_ADMIN") ||
      user.nomePerfil.toUpperCase().includes("ROLE_PERSONAL"));

  const carregarExercicios = () => {
    setLoading(true);
    apiFetch("/api/exercicios/buscar")
      .then((data) => {
        setExercicios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarExercicios();
  }, []);

  // --- ABRIR MODAL DE CONFIRMAÇÃO ---
  const initiateDelete = (id) => {
    setExerciseToDelete(id);
    setShowDeleteConfirm(true);
  };

  // --- DELETAR ---
  const confirmDelete = async () => {
    if (!exerciseToDelete) return;

    try {
      await apiFetch(`/api/exercicios/delete/${exerciseToDelete}`, { method: "DELETE" });

      setShowDeleteConfirm(false);
      setExercicios(exercicios.filter((ex) => ex.id !== exerciseToDelete));
      setExerciseToDelete(null);
    } catch (error) {
      setShowDeleteConfirm(false);

      if (error.message && error.message.includes("integridade")) {
        setErrorMessage(
          "Não é possível excluir este exercício pois ele faz parte de uma ou mais fichas de treino ativas."
        );
      } else {
        setErrorMessage(error.message || "Ocorreu um erro ao tentar excluir.");
      }

      setShowErrorModal(true);
    }
  };

  // ---------------------------
  // 🔎 LÓGICA DE FILTRAGEM
  // ---------------------------
  const exerciciosFiltrados = exercicios.filter((ex) => {
    const termoMusculo = filtroMusculo.toUpperCase();
    const matchMusculo =
      filtroMusculo === "TODOS" ||
      ex.grupoMuscular?.toUpperCase().includes(termoMusculo);

    const textoBusca = termoBusca.toLowerCase();
    const matchBusca =
      ex.nome.toLowerCase().includes(textoBusca) ||
      ex.descricao?.toLowerCase().includes(textoBusca);

    return matchMusculo && matchBusca;
  });

  if (!isPersonalOrAdmin) {
    return (
      <div className="p-5 text-center text-muted">
        <h3>Acesso restrito a Instrutores.</h3>
      </div>
    );
  }

  return (
    <div className="p-4">

      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Banco de Exercícios</h2>
          <p className="text-muted mb-0">Gerencie o catálogo de exercícios da academia.</p>
        </div>
        <Button
          variant="success"
          className="px-4 fw-bold shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus me-2"></i> Novo Exercício
        </Button>
      </div>

      {/* 🔍 BARRA DE BUSCA */}
      <div className="mb-4">
        <InputGroup className="shadow-sm">
          <InputGroup.Text className="bg-white border-end-0">
            <i className="fas fa-search text-muted"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Pesquisar por nome ou descrição..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          {termoBusca && (
            <Button variant="outline-secondary" onClick={() => setTermoBusca("")}>
              <i className="fas fa-times"></i>
            </Button>
          )}
        </InputGroup>
      </div>

      {/* 🎯 BOTÕES DE FILTRO */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        {gruposMusculares.map((grupo) => (
          <Button
            key={grupo}
            variant={filtroMusculo === grupo ? "success" : "outline-secondary"}
            onClick={() => setFiltroMusculo(grupo)}
            className="rounded-pill px-3 py-1 text-capitalize"
            size="sm"
          >
            {grupo.toLowerCase()}
          </Button>
        ))}
      </div>

      {/* TABELA */}
      <Card className="shadow-sm border-0 rounded-3 overflow-hidden">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2 text-muted">Carregando dados...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 table-borderless">
                <thead className="bg-light text-secondary border-bottom">
                  <tr>
                    <th className="ps-4 py-3">Exercício</th>
                    <th className="py-3">Grupo</th>
                    <th className="py-3">Descrição</th>
                    <th className="py-3">Mídia</th>
                    <th className="pe-4 py-3 text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciciosFiltrados.map((ex) => (
                    <tr key={ex.id} className="border-bottom">
                      <td className="ps-4 fw-bold text-dark">{ex.nome}</td>
                      <td>
                        <Badge bg="light" text="dark" className="border">
                          {ex.grupoMuscular}
                        </Badge>
                      </td>
                      <td className="text-muted small" style={{ maxWidth: "350px" }}>
                        {ex.descricao ? (
                          <span
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: "340px" }}
                          >
                            {ex.descricao}
                          </span>
                        ) : (
                          <span className="fst-italic text-black-50">Sem descrição</span>
                        )}
                      </td>
                      <td>
                        {ex.urlVideo ? (
                          <a
                            href={ex.urlVideo}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-light text-primary border-0"
                          >
                            <i className="fas fa-play-circle fa-lg"></i>
                          </a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="pe-4 text-end">
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => initiateDelete(ex.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {exerciciosFiltrados.length === 0 && (
                <div className="text-center p-5 text-muted">
                  <i className="fas fa-dumbbell fa-3x mb-3 opacity-50"></i>
                  <p>Nenhum exercício encontrado.</p>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* MODAL CRIAR */}
      <CreateExerciseModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          carregarExercicios();
          setShowCreateModal(false);
          setShowSuccessModal(true);
        }}
      />

      {/* MODAL CONFIRMAR EXCLUSÃO */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger">
            <i className="fas fa-exclamation-triangle me-2"></i> Excluir Exercício
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja remover este exercício?
          <br />
          <small className="text-muted">Esta ação não pode ser desfeita.</small>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setShowDeleteConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Sim, Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DE ERRO */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="fas fa-times-circle me-2"></i> Operação Negada
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-3 text-danger">
            <i className="fas fa-link fa-3x"></i>
          </div>
          <h5 className="fw-bold">Não é possível excluir!</h5>
          <p className="mt-2 text-secondary">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0">
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL SUCESSO */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <i className="fas fa-check-circle me-2"></i> Exercício Criado
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <i className="fas fa-check-circle text-success fa-4x mb-3"></i>
          <h5 className="fw-bold">Exercício cadastrado com sucesso!</h5>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0">
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
