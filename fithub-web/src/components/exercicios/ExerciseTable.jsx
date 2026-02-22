import { Card, Table, Badge, Button, Spinner } from "react-bootstrap";
import "../../styles/exercicio.css";

export function ExerciseTable({ exercicios, loading, onDelete, onEdit }) {
  return (
    <Card className="shadow-sm border-0 rounded-4 overflow-hidden exercise-card-container">
      <Card.Body className="p-0">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 fw-bold exercise-status-text">
              Carregando catálogo...
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0 exercise-table">
              <thead className="exercise-table-thead">
                <tr className="small fw-bold text-uppercase">
                  <th className="ps-4 py-3 border-0">Exercício</th>
                  <th className="py-3 border-0">Grupo</th>
                  <th className="py-3 border-0">Descrição</th>
                  <th className="py-3 border-0">Mídia</th>
                  <th className="pe-4 py-3 text-end border-0">Ações</th>
                </tr>
              </thead>
              <tbody>
                {exercicios.map((ex) => (
                  <tr key={ex.id}>
                    <td className="ps-4 fw-bold exercise-name-cell">
                      {ex.nome}
                    </td>
                    <td>
                      <Badge className="px-2 py-1 exercise-group-badge">
                        {ex.grupoMuscular}
                      </Badge>
                    </td>
                    <td className="small exercise-desc-col">
                      {ex.descricao ? (
                        <span className="text-truncate d-block exercise-desc-text">
                          {ex.descricao}
                        </span>
                      ) : (
                        <span className="fst-italic exercise-no-desc">
                          Sem descrição
                        </span>
                      )}
                    </td>
                    <td>
                      {ex.urlVideo ? (
                        <a
                          href={ex.urlVideo}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-play-media rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm"
                        >
                          <i className="fas fa-play small"></i>
                        </a>
                      ) : (
                        <span className="media-placeholder">-</span>
                      )}
                    </td>
                    <td className="pe-4 text-end">
                      <Button
                        variant="link"
                        className="me-2 p-0 shadow-none exercise-edit-btn"
                        onClick={() => onEdit(ex)}
                        title="Editar exercício"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="link"
                        className="text-danger p-0 shadow-none"
                        onClick={() => onDelete(ex.id)}
                        title="Excluir exercício"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {exercicios.length === 0 && (
              <div className="text-center p-5">
                <i className="fas fa-dumbbell fa-3x mb-3 table-empty-state"></i>
                <p className="fw-bold exercise-status-text">
                  Nenhum exercício encontrado.
                </p>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
