import React from "react";
import styles from "./LandingPage.module.css";
import LandingCard from "../../components/LandingCard/LandingCard";
import cloud from "../../assets/LandingPage/cloud.png";
import support from "../../assets/LandingPage/support.png";
import student from "../../assets/LandingPage/student.png";
import NoLoginNavbar from "../../components/Navigation/NoLoginNavbar/NoLoginNavBar";
import Paragraph from "../../components/Paragraph/Paragraph";
import analytics from "../../assets/LandingPage/analytics-icon.svg";
import peace from "../../assets/LandingPage/peace.svg";
import launch from "../../assets/LandingPage/launch.jpeg";
import management from "../../assets/LandingPage/management.jpeg";
import DefaultLogo from "../../assets/Eligo/PNG/default.png";
import { Link } from "react-router-dom";
const LandingPage: React.FC = () => {
  return (
    <>
      <NoLoginNavbar />
      <div className={styles.content_container}>
        <div className={styles.apresentation_banner}>
          <img className={styles.banner} src={DefaultLogo}></img>
          <div className={styles.apresentation_message}>
            <h1 className={styles.apresentation_title}>Gestão de Séries/Turmas Escolares</h1>

            <div className={styles.invite}>
              <p className={styles.cta_invite}>Modernize-se, conecte sua instituição.</p>
              <div className={styles.CTAs}>
                <Link to="/login" className={styles.secundary}>
                  Já possuo uma conta
                </Link>
                <Link to="/registro" className={styles.primary}>
                  Cadastre-se
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.promotions}>
          <LandingCard image={cloud} text="Conecte dezenas de professores" />
          <LandingCard image={student} text="Gerencie dados de seus alunos" />
          <LandingCard image={support} text="Suporte à sua disposição" />
        </div>

        <div className={styles.features}>
          <Paragraph
            direction="left"
            image={analytics}
            title="Painel Analítico"
            paragraph="Relatórios detalhados de suas escolas, turmas e professores. Tudo pensado para tornar seu trabalho mais simples e preciso."
          />
          <Paragraph
            direction="right"
            image={management}
            title="Não se sobrecarregue mais"
            paragraph="Traga seus professores e alunos à nossa plataforma. Cuidaremos da gestão de sua instituição da melhor maneira, aprimore seu ambiente de trabalho."
          />
          <Paragraph
            direction="left"
            image={launch}
            title="Alcance suas metas"
            paragraph="Juntos seremos capazes de produzir um ambiente saudável e eficaz. Planeje suas aulas e distribua suas turmas da melhor maneira possível"
          />
          <Paragraph
            direction="right"
            image={peace}
            title="No seu conforto"
            paragraph="Monitore de onde estiver. Conte conosco, estaremos sempre melhorando nossas tecnologias e funcionalidades para lhe oferecer um serviço da melhor qualidade"
          />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
