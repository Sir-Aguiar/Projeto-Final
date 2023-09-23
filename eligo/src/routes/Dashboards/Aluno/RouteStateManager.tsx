import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";

interface IAluno {
  idAluno: number;
  nome: string;
  turma: { idTurma: number; nome: string; curso: { idCurso: number; nome: string } };
}

/* 
  ["Elemento","Faltas"]
  ["Aluno", 6]
  ["Média", 2]
*/

type Context = {
  StudentData?: IAluno;
  MonthPresenceComparation?: any[];
  MonthlyPresence?: any[];
  DisciplinePresence?: any[];
  MonthPresence: number;
  AvarageMonthPresence: number;
  TotalPresence: number;
  currentDate: Date;
};

const StudentDashboardContext = createContext<Context | null>(null);

export const StudentDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { idAluno } = useParams();
  const authHeader = useAuthHeader();

  const RouteAPI = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: authHeader(),
    },
  });

  /* Somar todas as faltas, calcular porcentagem que a disciplina representa DisciplinaFalta / (Total / 100) */
  const [StudentData, setStudentData] = useState<IAluno>();
  const [MonthPresenceComparation, setMonthPresenceComparation] = useState<any[]>();
  const [MonthlyPresence, setMonthlyPresence] = useState<any[]>();
  const [DisciplinePresence, setDisciplinesPresence] = useState<any[]>();
  const [TotalPresence, setTotalPresence] = useState(0);
  const [MonthPresence, setMonthPresence] = useState(0);
  const [AvarageMonthPresence, setAvarageMonthPresence] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const loadStudentStats = async () => {
    const response = await RouteAPI.get(`/students-stat?idAluno=${idAluno}`);

    setStudentData(response.data.aluno);
    setTotalPresence(response.data.faltas_total);
    setMonthPresence(response.data.faltas_mes);
    setAvarageMonthPresence(response.data.falta_media_mes);
    setMonthPresenceComparation([
      ["Elemento", "Faltas", { role: "style" }],
      ["Aluno", response.data.media_comparacao.faltas, "#F75C45"],
      ["Média", response.data.media_comparacao.media, "#7944e4"],
    ]);

    setMonthlyPresence([["Mês", "Faltas"], ...response.data.faltas_ano]);

    setDisciplinesPresence(
      response.data.disciplinas.map((disciplina: any) => [
        disciplina[0],
        disciplina[1] / (response.data.faltas_total / 100),
      ]),
    );
  };

  useEffect(() => {
    loadStudentStats();
  }, []);
  return (
    <StudentDashboardContext.Provider
      value={{
        StudentData,
        MonthPresenceComparation,
        MonthlyPresence,
        DisciplinePresence,
        currentDate,
        AvarageMonthPresence,
        MonthPresence,
        TotalPresence,
      }}
    >
      {children}
    </StudentDashboardContext.Provider>
  );
};

export const useStudentDashboardContext = () => {
  const context = useContext(StudentDashboardContext);

  if (!context) throw new Error("StudentDashboardContext must be called from within the StudentDashboardProvider");

  return context;
};
