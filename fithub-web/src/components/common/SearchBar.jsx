import { InputGroup, Form, Button } from "react-bootstrap";

export function SearchBar({ placeholder, value, onChange, onClear }) {
  return (
    <InputGroup 
      className="shadow-sm rounded-pill overflow-hidden mb-4 search-container"
      style={{ 
        backgroundColor: "var(--card-bg)", 
        border: "1px solid var(--border-color)" 
      }}
    >
      <InputGroup.Text className="border-0 ps-4 bg-transparent">
        <i className="fas fa-search text-muted"></i>
      </InputGroup.Text>
      
      <Form.Control 
        placeholder={placeholder} 
        className="border-0 py-3 bg-transparent shadow-none" 
        value={value} 
        onChange={onChange} 
        style={{ color: "var(--text-dark)" }} 
      />
      
      {value && (
        <Button 
          variant="link" 
          className="border-0 pe-4 text-muted text-decoration-none shadow-none bg-transparent d-flex align-items-center" 
          onClick={onClear}
        >
          <i className="fas fa-times"></i>
        </Button>
      )}
    </InputGroup>
  );
}