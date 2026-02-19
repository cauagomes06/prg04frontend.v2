import { Card, Table, Badge, Button, Spinner } from "react-bootstrap";

export function ExerciseTable({ exercicios, loading, onDelete, onEdit }) {
  return (
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
                {exercicios.map((ex) => (
                  <tr key={ex.id} className="border-bottom">
                    <td className="ps-4 fw-bold text-dark">{ex.nome}</td>
                    <td>
                      <Badge bg="light" text="dark" className="border">
                        {ex.grupoMuscular}
                      </Badge>
                    </td>
                    <td className="text-muted small" style={{ maxWidth: "350px" }}>
                      {ex.descricao ? (
                        <span className="text-truncate d-inline-block" style={{ maxWidth: "340px" }}>
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
                      {/* BOTÃO EDITAR ADICIONADO */}
                      <Button
                        variant="link"
                        className="text-primary me-2 p-0"
                        onClick={() => onEdit(ex)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>

                      <Button
                        variant="link"
                        className="text-danger p-0"
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
                <i className="fas fa-dumbbell fa-3x mb-3 opacity-50"></i>
                <p>Nenhum exercício encontrado.</p>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}