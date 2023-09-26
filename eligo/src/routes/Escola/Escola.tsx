import React, { useEffect, useState } from "react";
import styles from "./Escola.module.css";
import { useParams } from "react-router-dom";
import { useEscolaContext } from "./RouteStateManager";
import DisciplinaIcon from "../../assets/Escola/disciplina-icon.png";
import ProfessorIcon from "../../assets/Escola/professor-icon.png";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ModalProfessor from "./Modals/Professor/ProfessorModal";
import ModalDisciplina from "./Modals/Disciplinas/Disciplinas";
import AddDiscipline from "./Drawers/Disciplines/AddDiscipline";
import AddProfessor from "./Drawers/Professor/AddProfessor";
import Divider from "@mui/material/Divider";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ListAltIcon from "@mui/icons-material/ListAlt";
const ClassRoomCard: React.FC<{ aula: any }> = ({ aula }) => {
  return (
    <div className={styles.card_container}>
      <header>
        <h1>Turma: {aula.turma.nome}</h1>
      </header>
{/*       <main>
        <div className={styles.actions}>
          <OpenInNewIcon />
          Abrir
        </div>

        <div className={styles.actions}>
          <ListAltIcon />
          Lista de Chamada
        </div>
      </main> */}
      <footer>
        <h2>
          <span className="font-semibold">Professor:</span> {aula.professor.nome}
        </h2>
        <h2>
          <span className="font-semibold">Disciplina:</span> {aula.disciplina.nome}
        </h2>
      </footer>
    </div>
  );
};

const Escola: React.FC = () => {
  const {
    SchoolData,
    professorsCount,
    disciplinesCount,
    StudentLength,
    ProfessorModal,
    DisciplineModal,
    DisciplineDrawer,
    todayDate,
    ProfessorDrawer,
    ToDayClassRooms,
  } = useEscolaContext();

  return (
    <div className={styles.content_container}>
      <header className={styles.header}>
        <h1 className="text-2xl font-bold text-black-text">{SchoolData.nome}</h1>
        <div className="flex items-center w-full gap-2">
          <button className={`${styles.button}`} onClick={() => DisciplineDrawer.open()}>
            <img src={DisciplinaIcon} className="max-h-[20px]" />
            Adicionar Disciplina
          </button>
          <button className={`${styles.button} ${styles.secundary_button}`} onClick={() => ProfessorDrawer.open()}>
            <img src={ProfessorIcon} className="max-h-[18px]" />
            Adicionar Professor
          </button>
        </div>
      </header>
      <main className={styles.content_data}>
        <aside className={styles.info_cards}>
          <div className={`${styles.info_card}`}>
            <OpenInFullIcon onClick={() => ProfessorModal.open()} /> Professores: <span>{professorsCount}</span>
          </div>
          <div className={`${styles.info_card}`}>
            <OpenInFullIcon onClick={() => DisciplineModal.open()} /> Disciplinas ministradas:{" "}
            <span>{disciplinesCount}</span>
          </div>
          <div className={`${styles.info_card}`}>
            <HelpOutlineIcon /> Alunos cadastrados: <span>{StudentLength}</span>
          </div>
        </aside>
        <div className={styles.today_classes}>
          <Divider className="font-Montserrat font-semibold text-lg text-black-text">
            Aulas do dia {todayDate.toLocaleDateString("pt-BR", { dateStyle: "short" })}
          </Divider>
          <div className={styles.classes}>
            {ToDayClassRooms.map((aula, index) => (
              <ClassRoomCard aula={aula} key={index} />
            ))}
          </div>
        </div>
      </main>
      <ModalProfessor />
      <ModalDisciplina />
      <AddDiscipline />
      <AddProfessor />
    </div>
  );
};

export default Escola;
