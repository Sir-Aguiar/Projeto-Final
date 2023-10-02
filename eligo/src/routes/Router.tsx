import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { RequireAuth, useIsAuthenticated } from "react-auth-kit";
import Login from "./Login/Login";
import LandingPage from "./LandingPage/LandingPage";
import Register from "./Register/Register";
import Navbar from "../components/Navigation/Navbar/NavBar";
import Escolas from "./Escolas/Escolas";
import { EscolasProvider } from "./Escolas/RouteStateManager";
import { TurmasProvider } from "./Turmas/RouteStateManager";
import Turmas from "./Turmas/Turmas";
import { AlunosProvider } from "./Alunos/RouteStateManager";
import Alunos from "./Alunos/Alunos";
import { EscolaProvider } from "./Escola/RouteStateManager";
import Escola from "./Escola/Escola";
import NotFound from "./Errors/NotFound";
import Aula from "./Aula/Aula";
import { AulaProvider } from "./Aula/RouteStateManager";
import Footer from "../components/Footer/Footer";
import { StudentDashboardProvider } from "./Dashboards/Aluno/RouteStateManager";
import Aluno from "./Dashboards/Aluno/Aluno";
import Turma from "./Dashboards/Turma/Turma";
import { ClassDashboardProvider } from "./Dashboards/Turma/RouteStateManager";
import { UsuarioProvider } from "./Usuario/RouteStateManager";
import Usuario from "./Usuario/Usuario";
import Homepage from "./Homepage/Homepage";

const PrivateRoutes = () => {
  return (
    <RequireAuth loginPath={"/login"}>
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    </RequireAuth>
  );
};

const Router = () => {
  const isUserLogged = useIsAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route
            path="/escolas"
            element={
              <EscolasProvider>
                <Escolas />
              </EscolasProvider>
            }
          />
          <Route
            path="/turmas"
            element={
              <TurmasProvider>
                <Turmas />
              </TurmasProvider>
            }
          />
          <Route
            path="/alunos"
            element={
              <AlunosProvider>
                <Alunos />
              </AlunosProvider>
            }
          />
          <Route
            path="/escola/:idEscola"
            element={
              <EscolaProvider>
                <Escola />
              </EscolaProvider>
            }
          />
          <Route
            path="/aula"
            element={
              <AulaProvider>
                <Aula />
              </AulaProvider>
            }
          />
          <Route
            path="/aluno/:idAluno"
            element={
              <StudentDashboardProvider>
                <Aluno />
              </StudentDashboardProvider>
            }
          />
          <Route
            path="/turma/:idTurma"
            element={
              <ClassDashboardProvider>
                <Turma />
              </ClassDashboardProvider>
            }
          />
          <Route
            path="/usuario"
            element={
              <UsuarioProvider>
                <Usuario />
              </UsuarioProvider>
            }
          />
          {isUserLogged() ? <Route path="/" element={<Homepage />} /> : <></>}
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        {isUserLogged() ? <></> : <Route path="/" element={<LandingPage />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export { Router };
