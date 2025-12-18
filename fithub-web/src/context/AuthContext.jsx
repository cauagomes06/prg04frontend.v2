// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../services/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao abrir a app, verifica se existe um token válido
    const checkLogin = async () => {
      const token = localStorage.getItem("fithub_token");
      
      if (token) {
        try {
          // Tenta buscar os dados do usuário para confirmar que o token é válido
          const userData = await apiFetch("/api/usuarios/me");
          setUser(userData);
        } catch (error) {
          // Se der erro (ex: token expirado), limpa tudo
          console.error("Sessão inválida:", error);
          localStorage.removeItem("fithub_token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLogin();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("fithub_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("fithub_token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};