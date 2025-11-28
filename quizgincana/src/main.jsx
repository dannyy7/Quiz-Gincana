import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import Intro from './jogo/Intro';
import PaginaPrincipal from './jogo/PaginaPrincipal';
import SignUp from './jogo/SignUp';
import Login from './jogo/Login';
import CriarQuiz from './jogo/CriarQuiz';
import PerguntaEditor from './jogo/PerguntaEditor';

const router = createBrowserRouter([
  { path: "/", element: <Intro /> },
  { path: "/PaginaPrincipal", element: <PaginaPrincipal /> },
  { path: "/SignUp", element: <SignUp /> },
  { path: "/Login", element: <Login /> },

  // Rota recebendo quizID
  { path: "/CriarQuiz/:quizID", element: <CriarQuiz /> },

  // Agora recebe quizID E index da pergunta
  { path: "/editarpergunta/:quizID/:index", element: <PerguntaEditor /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
