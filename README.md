# FitHub Web - Frontend (React/Vite)

Interface de utilizador (Frontend) para o sistema de gestão de ginásios FitHub, desenvolvida utilizando React com Vite e estilizada com React-Bootstrap e CSS personalizado.

## 🚀 Tecnologias

* **Framework:** React v19.2.0
* **Build Tool:** Vite
* **Estilização:** Bootstrap 5.3.8 + React-Bootstrap + CSS Customizado
* **Roteamento:** React Router DOM
* **Gestão de Estado:** React Context API (`AuthContext`)
* **Linguagem:** JavaScript/JSX

## ✨ Principais Funcionalidades

O portal web é dividido em áreas protegidas por autenticação, oferecendo uma experiência dinâmica para clientes e instrutores/administradores:

### 🌐 Área do Usuário
* **Login e Registo**.
* **Meu Perfil:** Visualização e edição de dados pessoais, foto de perfil, e gestão de plano/senha.
* **Meus Treinos:** Criação de novas fichas e visualização/gestão de treinos pessoais.
* **Biblioteca de Treinos:** Exploração e cópia de treinos públicos da comunidade.
* **Aulas de Grupo:** Visualização da agenda e reserva de vagas.
* **Competições:** Inscrição em desafios, submissão de resultados e acompanhamento do Ranking Geral e por competição.
* **Notificações:** Centro de mensagens para updates do sistema.

### 👨‍💼 Área de Administração/Instrutor
* **Dashboard (Admin):** Visão geral de estatísticas (Alunos, Aulas, Receita).
* **Gerenciar Usuários (Admin):** Listagem, pesquisa e alteração de perfis de usuário.
* **Banco de Exercícios:** CRUD para gerir o catálogo de exercícios.
* **Ferramentas de Classe:** Agendamento de novas aulas e cancelamento.

## ⚙️ Configuração e Execução

### 1. Pré-requisitos
* Node.js (versão 18+ recomendada)
* npm (incluído no Node.js)
* **Backend:** A API deve estar em execução no endereço configurado em `src/services/api.js`.

### 2. Endereço da API

O arquivo `src/services/api.js` está configurado para consumir o backend:

```javascript
const API_URL = "https://fithub-api-kx7l.onrender.com" //
// ...
