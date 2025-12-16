import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

// Páginas
import Intro from './jogo/Intro';
import PaginaPrincipal from './jogo/PaginaPrincipal';
import SignUp from './jogo/SignUp';
import Login from './jogo/Login';
import CriarQuiz from './jogo/CriarQuiz';
import PerguntaEditor from './jogo/PerguntaEditor';
import Pergunta from './jogo/Pergunta';
import Lobby from './jogo/Lobby';
import RecupSenha from './jogo/RecupSenha';
import Ranking from './jogo/Ranking';
import Podio from './jogo/Podio';

// Definição das rotas
const router = createBrowserRouter([
  { path: "/", element: <Intro /> },
  { path: "/PaginaPrincipal", element: <PaginaPrincipal /> },
  { path: "/SignUp", element: <SignUp /> },
  { path: "/Login", element: <Login /> },

  { path: "/CriarQuiz/:quizID", element: <CriarQuiz /> },
  { path: "/PerguntaEditor/:quizID/:perguntaID", element: <PerguntaEditor /> },

  // 🔥 ROTAS DO JOGO (FALTAVAM)
  { path: "/quiz/:quizId/pergunta/:perguntaId", element: <Pergunta /> },
  { path: "/ranking/:quizId", element: <Ranking /> },
  { path: "/podio/:quizId", element: <Podio /> },

  // 🔹 rotas antigas (mantidas)
  { path: "/Pergunta", element: <Pergunta /> },
  { path: "/Ranking", element: <Ranking /> },
  { path: "/Podio", element: <Podio /> },

  // Sala / Lobby
  { path: "/Sala/:codigo", element: <Lobby /> },
  { path: "/Lobby", element: <Lobby /> },

  { path: "/RecupSenha", element: <RecupSenha /> }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
