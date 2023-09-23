import React, { useEffect } from "react";
import styles from "./Aluno.module.css";
import { useStudentDashboardContext } from "./RouteStateManager";
import Chart from "react-google-charts";
import LinearProgress from "@mui/material/LinearProgress";
const Aluno: React.FC = () => {
  const {
    StudentData,
    MonthPresenceComparation,
    MonthlyPresence,
    DisciplinePresence,
    AvarageMonthPresence,
    MonthPresence,
    TotalPresence,
    currentDate,
  } = useStudentDashboardContext();

  return (
    <div className={styles.content_section}>
      <aside className={styles.student_info}>
        <header className={styles.aside_header}>
          <h2 className={styles.info_head}>Aluno: {StudentData?.nome}</h2>
          <h2 className={styles.info_head}>Curso: {StudentData?.turma.curso.nome}</h2>
          <h2 className={styles.info_head}>Turma: {StudentData?.turma.nome}</h2>
        </header>
        <main className={styles.presence_compare}>
          <h1 className="text-sm font-medium text-center">Média de faltas do curso</h1>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="95%"
            data={MonthPresenceComparation}
            options={{ legend: { position: "bottom" } }}
          />
        </main>
      </aside>
      <main className={styles.presence_info}>
        <main className={styles.monthly_presence}>
          <h1 className="text-center font-semibold text-sm">Faltas em {currentDate.getFullYear()}</h1>
          <Chart
            chartType="LineChart"
            width="100%"
            height="95%"
            data={MonthlyPresence}
            options={{ legend: { position: "bottom" } }}
          />
        </main>
        <footer className={styles.presence_infograph}>
          <div className={styles.info_card}>
            <h1>{MonthlyPresence && MonthlyPresence[MonthlyPresence!.length - 1][1]}</h1>
            <h2>Faltas no mês de {MonthlyPresence && MonthlyPresence[MonthlyPresence!.length - 1][0]}</h2>
          </div>
          <div className={styles.info_card}>
            <h1>{AvarageMonthPresence}</h1>
            <h2>Média de faltas em Agosto</h2>
            <span>Entre alunos do {StudentData?.turma.curso.nome}</span>
          </div>
          <div className={styles.info_card}>
            <h1>{TotalPresence}</h1>
            <h2>Faltas acumuladas</h2>
            <span>No ano de {currentDate.getFullYear()}</span>
          </div>
        </footer>
      </main>
      <aside className={styles.discipline_presence}>
        <h1 className="text-center font-semibold text-sm mb-2">Faltas por Disciplina</h1>
        {DisciplinePresence &&
          DisciplinePresence.map((disciplina, index) => (
            <div className={styles.discipline_item} key={index}>
              <span>
                {disciplina[0]} ({disciplina[1].toFixed(2)}%)
              </span>
              <div className="w-full h-[2px] bg-slate-200">
                <div className={`h-[2px] bg-blue-500`} style={{ width: `${disciplina[1].toFixed(2)}%` }}></div>
              </div>
            </div>
          ))}
      </aside>
    </div>
  );
};

export default Aluno;
