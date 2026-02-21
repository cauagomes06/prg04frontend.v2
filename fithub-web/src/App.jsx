import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { useContext } from "react";

// Imports das Páginas
import AdminPlans from "./pages/AdminPlans.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Layout } from "./components/common/Layout.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { MeusTreinos } from "./pages/MeusTreinos.jsx";
import { Biblioteca } from "./pages/BibliotecaTreinos.jsx";
import { Exercicios } from "./pages/Exercicios.jsx";
import { Perfil } from "./pages/Perfil.jsx";
import { Notificacoes } from "./pages/Notificacoes.jsx";
import { Competicoes } from "./pages/Competicoes.jsx";
import { Aulas } from "./pages/Aulas.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import { PerfilPublico } from "./pages/PerfilPublico.jsx"; // <- Adicionado o .jsx

// Imports de Pagamento (Adicionados)
import { PaymentSuccess } from "./pages/payment/PaymentSuccess.jsx";
import { PaymentFailure } from "./pages/payment/PaymentFailure.jsx";

// 1. Protetor de Rotas Geral (Logado)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">Carregando...</div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// 2. Protetor de Rotas de Admin (Role Check)
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">Carregando...</div>
    );

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
            {/* Redireciona /portal para /portal/perfil */}
            <Route index element={<Navigate to="perfil" />} />

            {/* Rotas Internas do Portal (TODAS RELATIVAS, SEM A BARRA INICIAL) */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notificacoes" element={<Notificacoes />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="treinos" element={<MeusTreinos />} />
            <Route path="biblioteca" element={<Biblioteca />} />
            <Route path="exercicios" element={<Exercicios />} />
            <Route path="competicoes" element={<Competicoes />} />
            <Route path="aulas" element={<Aulas />} />
            
            {/* --- CORREÇÃO AQUI --- Tirei a barra / do início */}
            <Route path="perfil/:id" element={<PerfilPublico />} />

            {/* Rota de Admin */}
            <Route
              path="admin/planos"
              element={
                <AdminRoute>
                  <AdminPlans />
                </AdminRoute>
              }
            />
            <Route path="admin" element={<AdminUsers />} />
          </Route>

          {/* Qualquer rota desconhecida vai para login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;