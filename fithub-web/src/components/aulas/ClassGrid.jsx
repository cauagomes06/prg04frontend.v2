import { Row, Col } from "react-bootstrap";
import { ClassCard } from "./ClassCard";

export function ClassGrid({ aulas, isInstructor, onReservar, onVerParticipantes, onDelete}) {
  
  if (aulas.length === 0) {
    return (
      <div className="text-center py-5 text-muted bg-white rounded-4 shadow-sm border">
        <i className="far fa-calendar-times fa-3x mb-3 opacity-25"></i>
        <h5>Não há aulas agendadas no momento.</h5>
        <p className="small">Fique atento a novas atualizações na agenda!</p>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {aulas.map((aula) => (
        <Col md={6} lg={4} key={aula.id}>
          <ClassCard 
            aula={aula} 
            isInstructor={isInstructor} 
            onReservar={onReservar}
            onVerParticipantes={onVerParticipantes}
            onDelete={onDelete}
          />
        </Col>
      ))}
    </Row>
  );
}