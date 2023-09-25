import React from "react";
import styles from "./Homepage.module.css";

import ClassroomBro from "../../assets/Homepage/Classroom-bro.png";
import LearningCuate from "../../assets/Homepage/Learning-cuate.png";
import ModernWoman from "../../assets/Homepage/Modern woman.gif";
import { Link } from "react-router-dom";
import { AdminPanelSettings, ArrowForward, ArrowForwardIos, ArrowRightTwoTone } from "@mui/icons-material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import UpcomingIcon from "@mui/icons-material/Upcoming";
const Homepage: React.FC = () => {
  return (
    <div className={styles.content_section}>
      <header className={styles.home_header}>
        <div className={styles.invite_section}>
          <div className={styles.head}>
            <h1>Acesse suas turmas</h1>
            <p>Consulte seus alunos, aulas e muito mais...</p>
          </div>
          <img
            src={ClassroomBro}
            className="max-h-[120px] desktop:w-[150px] mobile:max-h-[200px] tablet:max-h-[115px]"
          />
          <button className={styles.invite_button}>
            <Link className={styles.clipped_wave} to="/turmas">
              Ir para Turmas
              <AutoStoriesIcon />
            </Link>
          </button>
        </div>
        <div className={styles.main_panel}>
          <main className={styles.panel_content}>
            <div className="w-full h-full flex flex-col justify-between">
              <header className={`${styles.panel_head}`}>
                <h1>Seja Bem-Vindo!</h1>
                <p>Comece já a ministrar suas aulas, de maneira rápida e prática</p>
              </header>

              <Link to="/aula" className={styles.class_link}>
                <ArrowForwardIos sx={{ height: "13px", width: "13px", zIndex: "2" }} />{" "}
                <span className="z-[2]">Iniciar Aula</span>
              </Link>
            </div>
            <img src={ModernWoman} className="tablet:max-h-[150px] max-h-[200px] mobile:max-h-[150px]" />
          </main>
          <footer className={styles.lesson_warn}>
            <AdminPanelSettings fontSize="large" />
            <div className="w-full flex flex-col justify-center">
              <h1 className="font-semibold desktop:text-sm text-[12px]">Tenha precaução</h1>
              <p className="text-[11px]">Seja cuidadoso ao conectar-se com outros usuários</p>
            </div>
          </footer>
        </div>
        <div className={styles.invite_section}>
          <div className={styles.head}>
            <h1>Monitore cada informação </h1>
            <p>
              Maximize o desepenho, minimizando o esforço. Com nossos relatórios de turmas e alunos sob seu controle
            </p>
          </div>
          <img src={LearningCuate} className="max-h-[150px]" />
        </div>
      </header>
    </div>
  );
};

export default Homepage;
