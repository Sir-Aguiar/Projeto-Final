import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";

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
  const authHeader = useAuthHeader();

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
      const response = await RouteAPI.get(`/class-stats?idTurma=${idTurma}`);
      setClassPopulation([
        ["Grupo", "Populacao"],
        ["Turma", response.data.populacao.turma],
        ["Curso", response.data.populacao.curso - response.data.populacao.turma],
      ]);
      setAvarageAbsence([["Mês", "Ausências"], ...response.data.media_faltas]);
      setClassInfo(response.data.turma_info);
      console.log(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadClassStats();
  }, []);

  return (
    <ClassDashboardContext.Provider value={{ ClassPopulation, AvarageAbsence, ClassInfo }}>
      {children}
    </ClassDashboardContext.Provider>
  );
};

export const useClassDashboardContext = () => {
  const context = useContext(ClassDashboardContext);

  if (!context) throw new Error("ClassDashboardContext must be called from within the ClassDashboardProvider");

  return context;
};
