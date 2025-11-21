import { InputGroup, Form, Button } from "react-bootstrap";

export function SearchBar({ placeholder, value, onChange, onClear }) {
  return (
    <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0 mb-4 search-container">
      <InputGroup.Text className="bg-white border-0 ps-4">
        <i className="fas fa-search text-muted"></i>
      </InputGroup.Text>
      <Form.Control 
        placeholder={placeholder} 
        className="border-0 py-3" 
        value={value} 
        onChange={onChange} 
      />
      {value && (
        <Button variant="white" className="border-0 bg-white pe-4" onClick={onClear}>
          <i className="fas fa-times text-muted"></i>
        </Button>
      )}
    </InputGroup>
  );
}