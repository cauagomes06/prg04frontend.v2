import { Card, Button, Badge } from "react-bootstrap";

export function ClassCard({ aula, isInstructor, onReservar, onVerParticipantes, onDelete }) {
  const dataAula = new Date(aula.dataHoraInicio);
  const agora = new Date();
  const isPassada = dataAula < agora;

  const dataFormatada = dataAula.toLocaleString("pt-BR", {
    weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  const isEsgotada = aula.vagasDisponiveis <= 0;
  const isReservado = aula.jaReservado; 

  let btnLabel = "Reservar Vaga";
  let btnVariant = "success";
  let btnDisabled = false;

  if (isPassada) {
    btnLabel = "Encerrada";
    btnVariant = "outline-secondary"; 
    btnDisabled = true;
  } else if (isReservado) {
    btnLabel = "Reservado";
    btnVariant = "secondary";
    btnDisabled = true;
  } else if (isEsgotada) {
    btnLabel = "Lotado";
    btnVariant = "danger";
    btnDisabled = true;
  }

  return (
    <Card className={`h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card ${isPassada ? 'opacity-75' : ''}`}>
      {/* Cabeçalho adaptável */}
      <div 
        className={`p-4 text-center border-bottom position-relative`}
        style={{ backgroundColor: isPassada ? 'rgba(0,0,0,0.05)' : 'var(--bg-light)' }}
      >
          <i className={`fas fa-calendar-check fa-3x opacity-5 ${isPassada ? 'text-muted' : 'text-success'}`}></i>
          
{isPassada && (
            <Badge bg="secondary" className="position-absolute top-0 end-0 m-3">
              ENCERRADA
            </Badge>
          )}

          {!isPassada && isReservado && (
            <Badge 
              className="position-absolute top-0 end-0 m-3 shadow-sm border-0"
              style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}
            >
              INSCRITO
            </Badge>
          )}

          {!isPassada && !isReservado && isEsgotada && (
            <Badge bg="danger" className="position-absolute top-0 end-0 m-3">
              ESGOTADO
            </Badge>
          )}
      </div>

      <Card.Body className="d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className={`fw-bold mb-0 text-truncate ${isPassada ? 'text-muted' : 'text-dark'}`} title={aula.nome}>
            {aula.nome}
          </h5>
          {!isEsgotada && !isReservado && !isPassada && (
             <Badge bg="success" pill className="px-3">{aula.vagasDisponiveis} vagas</Badge>
          )}
        </div>
        
        <p className="text-muted small mb-3 flex-grow-1">{aula.descricao || "Sem descrição."}</p>
        
        <div className="mb-4 small">
          <div className="d-flex align-items-center mb-2">
            <i className={`far fa-clock me-2 ${isPassada ? 'text-muted' : 'text-primary'}`} style={{width: '20px'}}></i>
            <strong className={isPassada ? 'text-muted text-decoration-line-through' : 'text-dark'}>{dataFormatada}</strong>
          </div>
          <div className="d-flex align-items-center mb-2 text-muted">
            <i className="fas fa-stopwatch me-2" style={{width: '20px'}}></i>
            <span>{aula.duracaoMinutos} min</span>
          </div>
          <div className="d-flex align-items-center text-muted">
            <i className="far fa-user me-2" style={{width: '20px'}}></i>
            <span>{aula.instrutor?.nomeCompleto || "Instrutor"}</span>
          </div>
        </div>

        <div className="d-grid gap-2 mt-auto">
          <Button 
            variant="outline-secondary" 
            className="fw-bold rounded-pill shadow-none" 
            size="sm"
            style={{ color: 'var(--text-dark)', borderColor: 'var(--border-color)' }}
            onClick={() => onVerParticipantes(aula.id)}
          >
            <i className="fas fa-users me-2"></i> Participantes
          </Button>

          {isInstructor && (
             <Button 
               variant="outline-danger" 
               className="fw-bold rounded-pill" 
               size="sm"
               onClick={() => onDelete(aula.id)}
             >
               <i className="fas fa-trash-alt me-2"></i> Cancelar Aula
             </Button>
          )}

          {!isInstructor && (
              <Button 
                  variant={btnVariant}
                  className="fw-bold rounded-pill shadow-sm"
                  disabled={btnDisabled}
                  onClick={() => onReservar(aula.id)}
              >
                  {isReservado && !isPassada ? <><i className="fas fa-check me-2"></i>{btnLabel}</> : btnLabel}
              </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}