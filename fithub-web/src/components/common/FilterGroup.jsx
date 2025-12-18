import { Button } from "react-bootstrap";

export function FilterGroup({ options, selected, onSelect }) {
  return (
    <div className="d-flex gap-2 flex-wrap">
      {options.map(option => (
        <Button 
          key={option} 
          variant={selected === option ? "success" : "outline-secondary"} 
          onClick={() => onSelect(option)} 
          className="rounded-pill px-3 py-1 text-capitalize text-filter-small" 
          size="sm"
        >
          {option.toLowerCase()}
        </Button>
      ))}
    </div>
  );
}