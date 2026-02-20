import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export function ThemeToggle() {
  // Lê o tema salvo no localStorage ou define 'light' como padrão
  const [temaEscuro, setTemaEscuro] = useState(() => {
    const temaSalvo = localStorage.getItem("fithub-theme");
    return temaSalvo === "dark";
  });

  // Toda vez que 'temaEscuro' mudar, atualizamos o HTML e o LocalStorage
  useEffect(() => {
    if (temaEscuro) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("fithub-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("fithub-theme", "light");
    }
  }, [temaEscuro]);

  return (
    <Button 
      variant="outline-secondary" 
      className="rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm"
      style={{ width: "40px", height: "40px", backgroundColor: "var(--card-bg)" }}
      onClick={() => setTemaEscuro(!temaEscuro)}
      title={temaEscuro ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
    >
      {/* Mostra uma Lua se estiver claro, e um Sol se estiver escuro */}
      <i className={`fas ${temaEscuro ? "fa-sun text-white" : "fa-moon text-dark"}`}></i>
    </Button>
  );
}