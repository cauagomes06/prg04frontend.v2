import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

import { Login } from "./pages/Login.jsx";
import { Layout } from "./components/common/Layout.jsx";
import { MeusTreinos } from "./pages/MeusTreinos";
import { Biblioteca } from "./pages/BibliotecaTreinos.jsx";
import { Exercicios } from "./pages/Exercicios";
import { Perfil } from "./pages/Perfil";
import { Notificacoes } from "./pages/Notificacoes";
import { Competicoes } from "./pages/Competicoes.jsx";
import { Aulas } from "./pages/Aulas";
import { Dashboard } from "./pages/Dashboard";
import { Register } from "./pages/Register";

// Componente para proteger rotas (se não estiver logado, manda para login)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">Carregando...</div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/portal"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Redireciona /portal para /portal/dashboard */}
            <Route index element={<Navigate to="/portal/dashboard" />} />
            {/* --- ROTAS SEPARADAS --- */}
            <Route path="dashboard" element={<Dashboard />} />{" "}

            <Route path="notificacoes" element={<Notificacoes />} />{" "}
           
            <Route path="dashboard" element={<Notificacoes />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="treinos" element={<MeusTreinos />} />
            <Route path="biblioteca" element={<Biblioteca />} />
            <Route path="exercicios" element={<Exercicios />} />
            <Route path="competicoes" element={<Competicoes />} />
            <Route path="aulas" element={<Aulas />} />
          </Route>
          {/* Qualquer rota desconhecida vai para login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
