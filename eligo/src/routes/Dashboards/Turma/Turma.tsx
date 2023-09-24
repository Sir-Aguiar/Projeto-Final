import React, { useState } from "react";
import styles from "./Turma.module.css";
import { useClassDashboardContext } from "./RouteStateManager";
import Chart from "react-google-charts";
import { Tab, Tabs } from "@mui/material";
import ClassInfo from "./Tabs/ClassInfo";
const Turma: React.FC = () => {
  const { ClassPopulation, AvarageAbsence } = useClassDashboardContext();
  const [currentTab, setCurrentTab] = useState(0);
  const changeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(Number(newValue));
  };

  return (
    <div className={styles.content_section}>
      <div className={styles.content_grid}>
        <div className={`${styles.main_grid} ${styles.class_tabs}`}>
          <Tabs value={currentTab} onChange={changeTab} textColor="primary" indicatorColor="primary">
            <Tab value={0} label="Informações" />
            <Tab value={1} label="Aulas" />
            <Tab value={2} label="Professores" />
          </Tabs>
          {currentTab === 0 && <ClassInfo />}
          {currentTab === 1 && <div className={`${styles.tab_section} bg-red-300`}></div>}
          {currentTab === 2 && <div className={`${styles.tab_section} bg-green-300`}></div>}
        </div>
        <div className={`${styles.third_grid} bg-yellow-300`}></div>
        <div className={`${styles.third_grid} ${styles.population}`}>
          {ClassPopulation &&
            (ClassPopulation[1][1] < 1 ? (
              <p className="text-[13px] font-light text-center">Nenhum aluno cadastrado nesta turma</p>
            ) : (
              <Chart
                chartType="PieChart"
                width="100%"
                height="100%"
                data={ClassPopulation}
                options={{
                  title: "Parcela de alunos na turma",
                  is3D: true,
                  sliceVisibilityThreshold: 0.2,
                  slices: {
                    0: { color: "#5a49c8", offset: 0.2 },
                    1: { color: "#da5528" },
                  },
                  legend: { position: "bottom", textStyle: { color: "black", fontSize: 12 } },
                  chartArea: { top: 20, width: "80%", height: "80%" },
                  fontName: "Montserrat",
                  fontSize: 12,
                  pieStartAngle: 65,
                  animation: {
                    duration: 300,
                    startup: true,
                  },
                }}
              />
            ))}
        </div>
        <div className={`${styles.second_grid} ${styles.monthly_avarage}`}>
          {AvarageAbsence && (
            <Chart
              chartType="LineChart"
              width="100%"
              height="100%"
              data={AvarageAbsence}
              options={{
                title: "Taxa de ausência nas aulas (média mensal)",
                lines: {
                  0: { color: "#49c85c" },
                },
                curveType: "function",
                legend: { position: "bottom" },
                animation: {
                  duration: 300,
                  startup: true,
                },
                chartArea: {
                  width: "90%",
                  height:"65%"
                },
                fontSize: 10,
                vAxis: {
                  viewWindow: {
                    min: 0,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Turma;
