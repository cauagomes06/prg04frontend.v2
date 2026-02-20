import { Card, Table, Badge, Button, Spinner } from "react-bootstrap";

export function ExerciseTable({ exercicios, loading, onDelete, onEdit }) {
  return (
    <Card
      className="shadow-sm border-0 rounded-3 overflow-hidden borda-customizada"
      style={{ backgroundColor: "var(--card-bg)" }}
    >
      <Card.Body className="p-0">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted fw-bold">Carregando catálogo...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table
              hover
              className="align-middle mb-0"
              style={{
                "--bs-table-bg": "transparent",
                "--bs-table-color": "var(--text-dark)",
                "--bs-table-border-color": "var(--border-color)",
                "--bs-table-hover-bg": "var(--bg-light)",
              }}
            >
              <thead style={{ backgroundColor: "var(--bg-light)" }}>
                <tr className="text-secondary small fw-bold text-uppercase">
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
                    <td className="ps-4 fw-bold text-dark">{ex.nome}</td>
                    <td>
                      <Badge
                        style={{
                          backgroundColor: "var(--bg-light)",
                          color: "var(--text-dark)",
                          border: "1px solid var(--border-color)",
                        }}
                        className="px-2 py-1"
                      >
                        {ex.grupoMuscular}
                      </Badge>
                    </td>
                    <td
                      className="text-muted small"
                      style={{ maxWidth: "350px" }}
                    >
                      {ex.descricao ? (
                        <span
                          className="text-truncate d-inline-block"
                          style={{ maxWidth: "340px" }}
                        >
                          {ex.descricao}
                        </span>
                      ) : (
                        <span className="fst-italic opacity-50">
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
                          className="btn btn-sm d-inline-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            backgroundColor: "var(--primary-light)",
                            color: "var(--primary-color)",
                            width: "32px",
                            height: "32px",
                          }}
                        >
                          <i className="fas fa-play small"></i>
                        </a>
                      ) : (
                        <span className="text-muted opacity-25">-</span>
                      )}
                    </td>
                    <td className="pe-4 text-end">
                      <Button
                        variant="link"
                        className="text-primary me-2 p-0 shadow-none"
                        onClick={() => onEdit(ex)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="link"
                        className="text-danger p-0 shadow-none"
                        onClick={() => onDelete(ex.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {exercicios.length === 0 && (
              <div className="text-center p-5 text-muted">
                <i className="fas fa-dumbbell fa-3x mb-3 opacity-25"></i>
                <p className="fw-bold">Nenhum exercício encontrado.</p>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
