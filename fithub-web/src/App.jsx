import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import { Login } from "./pages/Login.jsx";
import { Layout } from "./components/Layout.jsx";
import { MeusTreinos } from "./pages/MeusTreinos";
import { Biblioteca } from "./pages/BibliotecaTreinos.jsx";
import { Exercicios } from "./pages/Exercicios"; 
import { Perfil } from "./pages/Perfil";
import { Notificacoes } from "./pages/Notificacoes";
import  {Competicoes}  from "./pages/Competicoes.jsx";

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

// Páginas de Exemplo (Criaremos os arquivos reais depois)
const Dashboard = () => <h2>Bem-vindo às Notificações</h2>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas (Portal) */}
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
            <Route path="dashboard" element={<Notificacoes />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="treinos" element={<MeusTreinos />} />{" "}
            <Route path="biblioteca" element={<Biblioteca />} />{" "}
            <Route path="exercicios" element={<Exercicios />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="competicoes" element={<Competicoes />} />            
          </Route>

          {/* Qualquer rota desconhecida vai para login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
