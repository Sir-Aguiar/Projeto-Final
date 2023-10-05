import axios, { AxiosError } from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";
import { FindClassStats } from "../../../services/Turmas";
import NotFound from "../../Errors/NotFound";
import { HandleError } from "../../../utils/defaultErrorHandler";
import { useToast } from "../../../components/Toast/Toast";

interface ITurma {
  idTurma: number;
  nome: string;
  escola: {
    idGestor: number;
    idEscola: number;
    nome: string;
  };
  curso: {
    idCurso: number;
    nome: string;
  };
}

interface IAluno {
  idAluno: number;
  nome: string;
  faltas: number;
}

type Context = {
  ClassPopulation?: any[];
  AvarageAbsence?: any[];
  ClassInfo?: { turma: ITurma; alunos: IAluno[] };
};

const ClassDashboardContext = createContext<Context | null>(null);

export const ClassDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { idTurma } = useParams();
  const { notify } = useToast();
  const authHeader = useAuthHeader();
  const [isUserAuthorized, setAuthorization] = useState(true);

  const RouteAPI = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: authHeader(),
    },
  });

  const [ClassPopulation, setClassPopulation] = useState<any[]>();
  const [AvarageAbsence, setAvarageAbsence] = useState<any[]>();
  const [ClassInfo, setClassInfo] = useState<{ turma: ITurma; alunos: IAluno[] }>();
  const loadClassStats = async () => {
    try {
      const response = await FindClassStats(RouteAPI, Number(idTurma));
      setClassPopulation([
        ["Grupo", "Populacao"],
        ["Turma", response.populacao.turma],
        ["Curso", response.populacao.curso - response.populacao.turma],
      ]);
      setAvarageAbsence([["Mês", "Ausências"], ...response.media_faltas]);
      setClassInfo(response.turma_info);
      console.log(response);
    } catch (error: any) {
      HandleError(error, notify, "Erro ao carregar dados da turma");
    }
  };

  useEffect(() => {
    loadClassStats();
  }, []);

  return (
    <ClassDashboardContext.Provider value={{ ClassPopulation, AvarageAbsence, ClassInfo }}>
      {isUserAuthorized ? children : <NotFound />}
    </ClassDashboardContext.Provider>
  );
};

export const useClassDashboardContext = () => {
  const context = useContext(ClassDashboardContext);

  if (!context) throw new Error("ClassDashboardContext must be called from within the ClassDashboardProvider");

  return context;
};
