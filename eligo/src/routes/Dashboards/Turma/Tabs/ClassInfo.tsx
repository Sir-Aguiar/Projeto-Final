import React from "react";
import styles from "./ClassInfo.module.css";
import { Divider } from "@mui/material";
import { useClassDashboardContext } from "../RouteStateManager";

const ClassInfo: React.FC = () => {
  const { ClassInfo } = useClassDashboardContext();
  return (
    <section className={`${styles.class_info}`}>
      <header>
        <h1>
          <span className="font-semibold text-blue-600">Escola:</span> {ClassInfo?.turma.escola.nome}
        </h1>
        <h1>
          <span className="font-semibold text-blue-600">Curso:</span> {ClassInfo?.turma.nome}
        </h1>
        <h1>
          <span className="font-semibold text-blue-600">Nome:</span> {ClassInfo?.turma.curso.nome}
        </h1>
      </header>
      <Divider className="font-medium text-black-text">Alunos</Divider>
      <main className={styles.student_sec}>
        <div className={`${styles.student_row} font-semibold`}>
          <span>Nome</span>
          <span>Faltas</span>
        </div>
        <Divider />
        {ClassInfo?.alunos.map((aluno) => (
          <div className={styles.student_row} key={aluno.idAluno}>
            <span>{aluno.nome}</span>
            <span>{aluno.faltas}</span>
          </div>
        ))}
      </main>
    </section>
  );
};

export default ClassInfo;
