import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

// Imports das Páginas
import AdminPlans from "./pages/AdminPlans.jsx"; 
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register";
import { Layout } from "./components/common/Layout.jsx";
import { Dashboard } from "./pages/Dashboard";
import { MeusTreinos } from "./pages/MeusTreinos";
import { Biblioteca } from "./pages/BibliotecaTreinos.jsx";
import { Exercicios } from "./pages/Exercicios";
import { Perfil } from "./pages/Perfil";
import { Notificacoes } from "./pages/Notificacoes";
import { Competicoes } from "./pages/Competicoes.jsx";
import { Aulas } from "./pages/Aulas";
import AdminUsers from "./pages/AdminUsers.jsx";

// Imports de Pagamento
import { PaymentSuccess } from "./pages/payment/PaymentSuccess";
import { PaymentFailure } from "./pages/payment/PaymentFailure";

// 1. Protetor de Rotas Geral (Logado)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="d-flex justify-content-center mt-5">Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

// 2. Protetor de Rotas de Admin (Role Check)
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="d-flex justify-content-center mt-5">Carregando...</div>;

  // Verifica se o perfil contém "ADMIN"
  const isAdmin = user?.nomePerfil?.toUpperCase().includes("ROLE_ADMIN");

  return isAdmin ? children : <Navigate to="/portal/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- Rotas de Retorno do Pagamento --- */}
          <Route path="/sucesso" element={<PaymentSuccess />} />
          <Route path="/falha" element={<PaymentFailure />} />
          <Route path="/pendente" element={<PaymentSuccess />} />

          {/* --- Área do Portal (Protegida) --- */}
          <Route
            path="/portal"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Redireciona /portal para /portal/dashboard */}
            <Route index element={<Navigate to="/portal/perfil" />} />

            {/* Rotas Internas do Portal */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notificacoes" element={<Notificacoes />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="treinos" element={<MeusTreinos />} />
            <Route path="biblioteca" element={<Biblioteca />} />
            <Route path="exercicios" element={<Exercicios />} />
            <Route path="competicoes" element={<Competicoes />} />
            <Route path="aulas" element={<Aulas />} />
            
            {/* --- Rotas de Admin (Protegidas) --- */}
            {/* Usamos caminhos relativos (sem "/") para evitar erros de aninhamento */}
            <Route path="admin" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />

            <Route path="admin/planos" element={
              <AdminRoute>
                <AdminPlans />
              </AdminRoute>
            } />
          </Route>

          {/* Qualquer rota desconhecida vai para login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;