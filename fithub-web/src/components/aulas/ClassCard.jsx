import { Card, Button, Badge } from "react-bootstrap";

export function ClassCard({ aula, isInstructor, onReservar, onVerParticipantes, onDelete }) { // <--- Adicionado onDelete
  
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
      btnVariant = "light"; 
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
    <Card className={`h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect ${isPassada ? 'opacity-75' : ''}`}>
      <div className={`p-4 text-center border-bottom position-relative ${isPassada ? 'bg-secondary-subtle' : 'bg-light'}`}>
          <i className={`fas fa-calendar-check fa-3x opacity-50 ${isPassada ? 'text-secondary' : 'text-success'}`}></i>
          
          {isPassada && (
            <Badge bg="secondary" className="position-absolute top-0 end-0 m-3">ENCERRADA</Badge>
          )}
          {!isPassada && isReservado && (
            <Badge bg="info" className="position-absolute top-0 end-0 m-3 shadow-sm">INSCRITO</Badge>
          )}
          {!isPassada && !isReservado && isEsgotada && (
            <Badge bg="danger" className="position-absolute top-0 end-0 m-3">ESGOTADO</Badge>
          )}
      </div>

      <Card.Body className="d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className={`fw-bold mb-0 text-truncate ${isPassada ? 'text-muted' : 'text-dark'}`} title={aula.nome}>
            {aula.nome}
          </h5>
          {!isEsgotada && !isReservado && !isPassada && (
             <Badge bg="success" pill>{aula.vagasDisponiveis} vagas</Badge>
          )}
        </div>
        
        <p className="text-muted small mb-3 flex-grow-1">{aula.descricao || "Sem descrição."}</p>
        
        <div className="mb-4 small text-secondary">
          <div className="d-flex align-items-center mb-2">
            <i className={`far fa-clock me-2 width-icon ${isPassada ? 'text-muted' : 'text-primary'}`}></i>
            <strong className={isPassada ? 'text-muted text-decoration-line-through' : ''}>{dataFormatada}</strong>
          </div>
          <div className="d-flex align-items-center mb-2">
            <i className="fas fa-stopwatch me-2 text-muted width-icon"></i>
            <span>{aula.duracaoMinutos} min</span>
          </div>
          <div className="d-flex align-items-center">
            <i className="far fa-user me-2 text-muted width-icon"></i>
            <span>{aula.instrutor?.nomeCompleto || "Instrutor"}</span>
          </div>
        </div>

        <div className="d-grid gap-2 mt-auto">
          {/* AÇÕES PARA TODOS (Ver Lista) */}
          <Button 
            variant="outline-dark" 
            className="fw-bold rounded-pill" 
            size="sm"
            onClick={() => onVerParticipantes(aula.id)}
          >
            <i className="fas fa-users me-2"></i> Participantes
          </Button>

          {/* AÇÕES PARA INSTRUTOR (Apagar) */}
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

          {/* AÇÕES PARA ALUNO (Reservar) */}
          {!isInstructor && (
              <Button 
                  variant={btnVariant}
                  className="fw-bold rounded-pill"
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