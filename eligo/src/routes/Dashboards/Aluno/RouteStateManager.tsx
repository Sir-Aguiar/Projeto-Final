import axios, { AxiosError } from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";
import { FindStudentsStats } from "../../../services/Alunos";
import NotFound from "../../Errors/NotFound";

interface IAluno {
  idAluno: number;
  nome: string;
  turma: { idTurma: number; nome: string; curso: { idCurso: number; nome: string } };
}
type Context = {
  StudentData?: IAluno;
  MonthPresenceComparation?: any[];
  MonthlyPresence?: any[];
  DisciplinePresence?: any[];
  MonthPresence: number;
  AvarageMonthPresence: number;
  TotalPresence: number;
  currentDate: Date;
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
};

const StudentDashboardContext = createContext<Context | null>(null);

export const StudentDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { idAluno } = useParams();
  const authHeader = useAuthHeader();
  const [isUserAuthorized, setAuthorization] = useState(true);
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
  const [month, setMonth] = useState(currentDate.getMonth());

  const loadStudentStats = async () => {
    try {
      const { aluno, faltas_ano, faltas_mes, faltas_total, media_falta_mes } = await FindStudentsStats(
        RouteAPI,
        Number(idAluno),
        month,
      );

      setStudentData(aluno);
      setMonthlyPresence([["Mês", "Faltas"], ...faltas_ano]);
      setTotalPresence(faltas_total);
      setMonthPresence(faltas_mes.faltas);
      setAvarageMonthPresence(media_falta_mes);

      setMonthPresenceComparation([
        ["Elemento", "Faltas", { role: "style" }],
        ["Aluno", faltas_mes.faltas, "#F75C45"],
        ["Média", media_falta_mes, "#7944e4"],
      ]);

      setDisciplinesPresence(
        faltas_mes.disciplinas.map((disciplina: any) => [
          disciplina.disciplina.nome,
          Number((disciplina.faltas / (faltas_mes.faltas / 100)).toFixed(2)),
        ]),
      );
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (response) {
          if (response.status === 401) {
            setAuthorization(false);
            return;
          }
          alert(response.data.error.message);
        }

        if (error.status === 500) {
          return;
        }
      }
    }
  };

  useEffect(() => {
    loadStudentStats();
  }, [month]);
  useEffect(() => {
    document.title = `Eligo ${`| ${StudentData?.nome}` || ""}`;
  }, [StudentData]);
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
        month,
        setMonth,
      }}
    >
      {isUserAuthorized ? children : <NotFound />}
    </StudentDashboardContext.Provider>
  );
};

export const useStudentDashboardContext = () => {
  const context = useContext(StudentDashboardContext);

  if (!context) throw new Error("StudentDashboardContext must be called from within the StudentDashboardProvider");

  return context;
};
