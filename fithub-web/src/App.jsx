import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

// Imports das Páginas
import AdminPlans from "./pages/AdminPlans";
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

// 1. Componente para proteger rotas gerais (qualquer usuário logado)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">Carregando...</div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// 2. Componente para proteger rotas de ADMIN
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="d-flex justify-content-center mt-5">Carregando...</div>;

  // Verifica se o perfil contém "ADMIN" (baseado no seu sistema de perfis)
  const isAdmin = user?.nomePerfil?.toUpperCase().includes("ROLE_ADMIN");

  // Se for admin, mostra o conteúdo; se não, manda de volta para o dashboard
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
            <Route index element={<Navigate to="/portal/perfil" />} />

            {/* Rotas de Usuário Comum */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notificacoes" element={<Notificacoes />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="treinos" element={<MeusTreinos />} />
            <Route path="biblioteca" element={<Biblioteca />} />
            <Route path="exercicios" element={<Exercicios />} />
            <Route path="competicoes" element={<Competicoes />} />
            <Route path="aulas" element={<Aulas />} />
            
            {/* 3. Rotas de Admin (Protegidas pelo AdminRoute) */}
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
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;