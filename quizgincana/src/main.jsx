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

// Definição das rotas
const router = createBrowserRouter([
  { path: "/", element: <Intro /> },
  { path: "/PaginaPrincipal", element: <PaginaPrincipal /> },
  { path: "/SignUp", element: <SignUp /> },
  { path: "/Login", element: <Login /> },
  { path: "/CriarQuiz/:quizID", element: <CriarQuiz /> },
  { path: "/PerguntaEditor/:quizID/:perguntaID", element: <PerguntaEditor /> },
  { path: "/Pergunta", element: <Pergunta /> },
  { path: "/Lobby", element: <Lobby /> },
  { path: "/RecupSenha", element: <RecupSenha/>}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
