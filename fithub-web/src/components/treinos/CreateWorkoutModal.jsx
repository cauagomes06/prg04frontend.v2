import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Table, Spinner } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { ConfirmModal } from "../common/ConfirmModal";
import { SuccessModal } from "../common/SuccessModal";
import { ErrorModal } from "../common/ErrorModal";

export function CreateWorkoutModal({ show, handleClose, onSuccess, treinoParaEditar }) {
  const { user } = useContext(AuthContext);

  // --- PALETA VERDE CLARO (MINT THEME) ---
  const mintBg = "#f0fdf4";      // Fundo ultra leve
  const mintHeader = "#dcfce7";  // Cabeçalhos
  const mintText = "#15803d";    // Texto verde médio (legível e suave)
  const mintAction = "#4ade80";  // Verde botões (claro e vibrante)

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

  const [confirmData, setConfirmData] = useState({ show: false, title: "", message: "", onConfirm: null });
  const [successData, setSuccessData] = useState({ show: false, message: "" });
  const [errorData, setErrorData] = useState({ show: false, message: "" });

  useEffect(() => {
    if (show) {
      setLoadingExercicios(true);
      apiFetch("/api/exercicios/buscar?size=100")
        .then((data) => {
          const lista = data.content || data;
          setExerciciosDisponiveis(Array.isArray(lista) ? lista : []);
        })
        .finally(() => setLoadingExercicios(false));

      if (treinoParaEditar) {
        setNome(treinoParaEditar.nome || "");
        setObjetivo(treinoParaEditar.descricao || "");
        const itensFormatados = (treinoParaEditar.items || []).map(item => ({
          exercicioId: item.exercicioId,
          nomeExercicio: item.nomeExercicio,
          series: item.series,
          repeticoes: item.repeticoes,
          descanso: item.descanso
        }));
        setItensTreino(itensFormatados);
      } else {
        setNome("");
        setObjetivo("");
        setItensTreino([]);
      }
    }
  }, [show, treinoParaEditar]);

  const handleAddItem = () => {
    if (!exercicioSelecionado) return;
    const exObj = exerciciosDisponiveis.find(ex => ex.id === parseInt(exercicioSelecionado));
    if (!exObj) return;

    setItensTreino([...itensTreino, {
      exercicioId: exObj.id,
      nomeExercicio: exObj.nome,
      series,
      repeticoes,
      descanso,
    }]);
    setExercicioSelecionado("");
  };

  const executarPersistencia = async () => {
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
      const url = treinoParaEditar ? `/api/treinos/update/${treinoParaEditar.id}` : "/api/treinos/register";
      const method = treinoParaEditar ? "PUT" : "POST";
      await apiFetch(url, { method, body: JSON.stringify(treinoDto) });
      setSuccessData({ show: true, message: "Ficha salva com sucesso!" });
      if (onSuccess) onSuccess();
      setTimeout(() => { handleClose(); setSuccessData({show: false, message: ""}); }, 1500);
    } catch (error) {
      setErrorData({ show: true, message: "Erro: " + error.message });
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered contentClassName="border-0 rounded-4 shadow-sm">
        {/* Header Verde Menta */}
        <Modal.Header closeButton style={{ backgroundColor: mintHeader, border: 'none' }} className="rounded-top-4 px-4 py-3">
          <Modal.Title className="fw-bold" style={{ color: mintText }}>
            <i className={`fas ${treinoParaEditar ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
            {treinoParaEditar ? "Editar Ficha" : "Nova Ficha de Treino"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 py-4" style={{ backgroundColor: mintBg }}>
          <Form onSubmit={(e) => { e.preventDefault(); setConfirmData({ show: true, title: "Confirmar", message: "Salvar dados da ficha?", onConfirm: executarPersistencia }); }}>
            
            {/* Informações Básicas */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small" style={{ color: mintText }}>NOME DO TREINO</Form.Label>
                  <Form.Control className="border-0 shadow-sm rounded-3 py-2" style={{ backgroundColor: '#ffffff' }} type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Group>
                    <Form.Label className="fw-bold small" style={{ color: mintText }}>OBJETIVO</Form.Label>
                    <Form.Control className="border-0 shadow-sm rounded-3 py-2" style={{ backgroundColor: '#ffffff' }} type="text" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
                  </Form.Group>
                </Form.Group>
              </Col>
            </Row>

            <h6 className="fw-bold mb-3" style={{ color: mintText, fontSize: '0.8rem', letterSpacing: '1px' }}>
                <i className="fas fa-list-check me-2"></i>CONFIGURAR EXERCÍCIOS
            </h6>

            {/* Container de Adição */}
            <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border border-light">
                <Row className="g-2 align-items-end mb-3">
                    <Col md={4}>
                        <Form.Label className="small fw-bold text-muted">Grupo Muscular</Form.Label>
                        <Form.Select className="border-0 bg-light" value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)}>
                            {["TODOS", ...new Set(exerciciosDisponiveis.map(ex => ex.grupoMuscular))].map(g => <option key={g} value={g}>{g}</option>)}
                        </Form.Select>
                    </Col>
                    <Col md={8}>
                        <Form.Label className="small fw-bold text-muted">Exercício</Form.Label>
                        <Form.Select className="border-0 bg-light" value={exercicioSelecionado} onChange={(e) => setExercicioSelecionado(e.target.value)}>
                            <option value="">-- Selecione --</option>
                            {exerciciosDisponiveis.filter(ex => filtroGrupo === "TODOS" || ex.grupoMuscular === filtroGrupo).map(ex => <option key={ex.id} value={ex.id}>{ex.nome}</option>)}
                        </Form.Select>
                    </Col>
                </Row>
                
                <Row className="g-2 align-items-end">
                    <Col xs={3}>
                        <Form.Label className="small fw-bold text-muted">Séries</Form.Label>
                        <Form.Control className="border-0 bg-light text-center" value={series} onChange={e => setSeries(e.target.value)} />
                    </Col>
                    <Col xs={3}>
                        <Form.Label className="small fw-bold text-muted">Reps</Form.Label>
                        <Form.Control className="border-0 bg-light text-center" value={repeticoes} onChange={e => setRepeticoes(e.target.value)} />
                    </Col>
                    <Col xs={3}>
                        <Form.Label className="small fw-bold text-muted">Pausa (s)</Form.Label>
                        <Form.Control className="border-0 bg-light text-center" value={descanso} onChange={e => setDescanso(e.target.value)} />
                    </Col>
                    <Col xs={3}>
                        <Button className="w-100 fw-bold border-0 text-white" style={{ backgroundColor: mintAction }} onClick={handleAddItem}>
                            <i className="fas fa-plus"></i>
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Tabela Clean */}
            <div className="table-responsive rounded-4 overflow-hidden shadow-sm border border-light">
              <Table hover className="mb-0 bg-white">
                <thead>
                  <tr style={{ backgroundColor: mintHeader, color: mintText, fontSize: '0.75rem' }}>
                    <th className="ps-3 py-3 border-0">EXERCÍCIO</th>
                    <th className="text-center py-3 border-0">SÉRIES</th>
                    <th className="text-center py-3 border-0">REPS</th>
                    <th className="text-center py-3 border-0">AÇÃO</th>
                  </tr>
                </thead>
                <tbody>
                  {itensTreino.length > 0 ? itensTreino.map((item, index) => (
                    <tr key={index} className="align-middle border-light">
                      <td className="ps-3 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{item.nomeExercicio}</td>
                      <td className="text-center text-muted small">{item.series}</td>
                      <td className="text-center text-muted small">{item.repeticoes}</td>
                      <td className="text-center">
                        <Button variant="link" className="text-danger p-0" onClick={() => setItensTreino(itensTreino.filter((_, i) => i !== index))}>
                          <i className="fas fa-minus-circle"></i>
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center py-4 text-muted small">Nenhum exercício na lista</td></tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-light">
              <Button variant="link" onClick={handleClose} className="text-decoration-none fw-bold text-muted">Cancelar</Button>
              <Button className="px-5 fw-bold rounded-pill border-0 shadow-sm text-white" style={{ backgroundColor: mintAction }} type="submit">
                {treinoParaEditar ? "SALVAR" : "CRIAR"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modais Feedback */}
      <ConfirmModal show={confirmData.show} title={confirmData.title} message={confirmData.message} handleClose={() => setConfirmData({ ...confirmData, show: false })} handleConfirm={confirmData.onConfirm} />
      <SuccessModal show={successData.show} message={successData.message} handleClose={() => setSuccessData({ ...successData, show: false })} />
      <ErrorModal show={errorData.show} message={errorData.message} handleClose={() => setErrorData({ ...errorData, show: false })} />
    </>
  );
}