import React, { useEffect } from "react";
import styles from "./Aluno.module.css";
import { useStudentDashboardContext } from "./RouteStateManager";
import Chart from "react-google-charts";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import firstLetterUpper from "../../../utils/firstLetterUpper";

const Aluno: React.FC = () => {
  const {
    StudentData,
    MonthPresenceComparation,
    MonthlyPresence,
    DisciplinePresence,
    AvarageMonthPresence,
    MonthPresence,
    TotalPresence,
    month,
    setMonth,
    currentDate,
  } = useStudentDashboardContext();

  const monthName = new Date(currentDate.getFullYear(), month, 1).toLocaleDateString("pt-br", { month: "long" });

  return (
    <div className={styles.content_section}>
      <div className={styles.data_sec}>
        <aside className={styles.student_info}>
          <header className={styles.aside_header}>
            <FormControl fullWidth>
              <InputLabel>Mês</InputLabel>
              <Select label="Mês" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {firstLetterUpper(
                      new Date(currentDate.getFullYear(), value, 1).toLocaleDateString("pt-br", { month: "long" }),
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <h2 className={styles.info_head}>Aluno: {StudentData?.nome}</h2>
            <h2 className={styles.info_head}>Curso: {StudentData?.turma.curso.nome}</h2>
            <h2 className={styles.info_head}>Turma: {StudentData?.turma.nome}</h2>
          </header>
          <main className={styles.presence_compare}>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="100%"
              data={MonthPresenceComparation}
              options={{ legend: { position: "bottom" }, title: "Em relação ao curso" }}
            />
          </main>
        </aside>
        <main className={styles.presence_info}>
          <main className={styles.monthly_presence}>
            <Chart
              chartType="LineChart"
              width="100%"
              height="95%"
              data={MonthlyPresence}
              options={{
                title: `Faltas em ${currentDate.getFullYear()}`,
                legend: { position: "bottom" },
                curveType: "function",
                animation: {
                  duration: 300,
                  startup: true,
                },
                chartArea: {
                  width: "90%",
                  height: "65%",
                },
                fontSize: 10,
                vAxis: {
                  viewWindow: {
                    min: 0,
                  },
                },
              }}
            />
          </main>
          <footer className={styles.presence_infograph}>
            <div className={styles.info_card}>
              <h2>Faltas no mês de {firstLetterUpper(monthName)}</h2>
              <h1>{MonthPresence}</h1>
            </div>
            <div className={styles.info_card}>
              <div className="flex flex-col items-start">
                <h2>Média de faltas ({firstLetterUpper(monthName)})</h2>
                <span>Entre alunos do {StudentData?.turma.curso.nome}</span>
              </div>
              <h1>{AvarageMonthPresence}</h1>
            </div>
            <div className={styles.info_card}>
              <div className="flex flex-col items-start">
                <h2>Faltas acumuladas</h2>
                <span>No ano de {currentDate.getFullYear()}</span>
              </div>
              <h1>{TotalPresence}</h1>
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
                <div className="w-full h-1 bg-slate-200">
                  <div className={`h-1 bg-blue-500`} style={{ width: `${disciplina[1].toFixed(2)}%` }}></div>
                </div>
              </div>
            ))}
        </aside>
      </div>
    </div>
  );
};

export default Aluno;
