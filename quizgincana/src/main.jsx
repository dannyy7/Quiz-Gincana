import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import './index.css'
import Intro from './jogo/Intro';
import PaginaPrincipal from './jogo/PaginaPrincipal';
import SignUp from './jogo/SignUp';
import Login from './jogo/Login';
import CriarQuiz from './jogo/CriarQuiz';
import PerguntaEditor from './jogo/PerguntaEditor';


const router = createBrowserRouter([
  { path: "/", element: <Intro/> },
  { path: "/PaginaPrincipal", element: <PaginaPrincipal/> },
  { path: "/SignUp", element: <SignUp/>},
  { path: "/Login", element: <Login/>},
  { path: "/Criarquiz", element: <CriarQuiz/>},
  { path: "/PerguntaEditor", element: <PerguntaEditor/>},
]);
 //array de rotas, path é o caminho para as rotas

//Nesse projeto estão sendo usados o router, supabase, biblioteca react-hook-mask, e configurações padrão do react -(pro projeto rodar é necessario instalar tudo isso)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)