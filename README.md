# Fit Hub Web - Frontend

O **Fit Hub Web** é a interface de utilizador da plataforma Fit Hub. Permite aos utilizadores gerirem os seus treinos, inscreverem-se em aulas, acompanharem o seu progresso através de um sistema de gamificação e aos administradores gerirem a plataforma de forma eficiente.

## 💻 Tecnologias e Ferramentas

O projeto frontend foi construído com as melhores práticas de desenvolvimento web moderno:

* **React** (Biblioteca principal)
* **Vite** (Ferramenta de build super rápida)
* **React Router** (Navegação SPA)
* **CSS Puro** (Estilização modular e responsiva)
* **Axios** (Comunicação com a API)
* **Docker & Nginx** (Containerização e Servidor Web)

## ✨ Principais Funcionalidades

* **Autenticação:** Login e registo seguros integrados com a API (JWT).
* **Player de Treinos:** Uma interface interativa para acompanhar os exercícios durante a execução passo a passo.
* **Gamificação:** Barra de XP, pop-ups de subida de nível (`LevelUpModal`), galeria de conquistas e alertas sonoros de medalhas (`TrophyToast`).
* **Painel Administrativo:** Gestão de utilizadores, planos de subscrição e visualização de estatísticas financeiras e de plataforma através do Dashboard.
* **Gestão de Aulas e Competições:** Inscrição em turmas e acompanhamento de rankings nas competições ativas.
* **Personalização:** Suporte a temas (Dark/Light mode) e gestão de perfil de utilizador.

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão recomendada LTS)
* A API do Backend (Fit Hub API) a correr localmente na porta `8080`.

Clone este repositório:
git clone https://github.com/cauagomes06/prg04frontend.v2.git

Navegue para a diretoria do projeto web:
cd fithub-web

Instale as dependências do projeto:
npm install

O projeto está pré-configurado para comunicar com a API local em http://localhost:8080 (através do ficheiro src/services/api.js). Garanta que o backend está a ser executado.

Inicie o servidor de desenvolvimento:
npm run dev
Bash
npm run dev
A aplicação estará acessível através do endereço local fornecido pelo Vite (geralmente http://localhost:5173).
