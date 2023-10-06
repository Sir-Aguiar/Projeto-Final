import React from "react";
import styles from "./Homepage.module.css";

import ClassroomBro from "../../assets/Homepage/Classroom-bro.png";
import LearningCuate from "../../assets/Homepage/Learning-cuate.png";
import ModernWoman from "../../assets/Homepage/Modern woman.gif";
import { Link } from "react-router-dom";
import { AdminPanelSettings, ArrowForward, ArrowForwardIos, ArrowRight, ArrowRightTwoTone } from "@mui/icons-material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import { Divider } from "@mui/material";
import { Tutorial, TutorialStep, TutorialTitle } from "../../components/Tutorial/Tutorial";
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
        <div className={`${styles.invite_section} mobile:max-h-[200px]`}>
          <div className={styles.head}>
            <h1>Monitore cada informação </h1>
            <p>
              Maximize o desepenho, minimizando o esforço. Com nossos relatórios de turmas e alunos sob seu controle
            </p>
          </div>
          <img src={LearningCuate} className="max-h-[150px]" />
        </div>
      </header>
      <main className={styles.home_body}>
        <section className={styles.tutorial_section}>
          <Tutorial area={2}>
            <TutorialTitle>Como iniciar aula</TutorialTitle>
            <TutorialStep title="Permissões">
              <p>Como gestor, poderá iniciar aulas de qualquer disciplina na grade da turma.</p>
              <p>Como professor, somente das disciplinas que lhe foi concedido acesso.</p>
            </TutorialStep>
            <TutorialStep title="Vá até a página de aulas">
              <p>Informe a turma e disciplina. </p>
              <p>Clique em "Iniciar Aula".</p>
            </TutorialStep>
          </Tutorial>
          <Tutorial area={3}>
            <TutorialTitle>Passos Iniciais</TutorialTitle>
            <TutorialStep title="Cadastre uma escola" stage={1}>
              <p>Na página “escolas”, clique em “Adicionar”.</p>
              <p>Ao cadastrar uma escola, será considerado seu gestor.</p>
            </TutorialStep>
            <TutorialStep title="Insira turmas" stage={2}>
              <p>Na página “turmas”, clique em “Adicionar”.</p>
              <p>
                Selecione a escola na qual deseja inserir as turmas. Esta ação é válida apenas as escolas em que é
                gestor.
              </p>
            </TutorialStep>
            <TutorialStep title="Matricule alunos" stage={3}>
              <p>Na página “alunos”, clique em “Adicionar”.</p>
              <p>Selecione a turma na qual matriculará o aluno. Novamente, esta ação é acessível apenas ao gestor.</p>
            </TutorialStep>
          </Tutorial>
          <Tutorial area={2}>
            <TutorialTitle>Como inserir disciplinas</TutorialTitle>
            <TutorialStep title="Vá até a página da escola">
              <p>
                Na página “escolas”, clique no ícone na frente do nome. Esta página é acessível apenas ao gestor da
                escola.
              </p>
            </TutorialStep>
            <TutorialStep title="Clique em “Adicionar Disciplina”">
              <p>Insira o nome e o curso (série) ao qual esta disciplina será associada (grade).</p>
              <p>
                Estas informações podem ser alteradas posteriormente ao clicar no ícone em “Disciplinas ministradas”.
              </p>
            </TutorialStep>
          </Tutorial>
        </section>
        <section className={styles.tutorial_section}>
          <Tutorial area={2}>
            <TutorialTitle>Como vincular professores</TutorialTitle>
            <TutorialStep title="Vá até a página da escola">
              <p>Na página “escolas”, clique no ícone na frente do nome. </p>
            </TutorialStep>
            <TutorialStep title="Clique em “Adicionar Professor”">
              <p>Insira o email cadastrado pelo usuário que deseja associar.</p>
              <p>
                Informe uma turma a qual este usuário será associado (só poderá ser associado com as as disciplinas na
                grade da turma).
              </p>
              <p>Clique em “Cadastrar” e este usuário já possui acesso à turma informada.</p>
            </TutorialStep>
          </Tutorial>
          <Tutorial area={3}>
            <TutorialTitle>Painéis Analíticos</TutorialTitle>
            <TutorialStep title="Turma" stage={1}>
              <p>Ao acessar à página da turma terá acesso a:</p>
              <p>Um gráfico comparando a quantidade de alunos na turma, e alunos matriculados no mesmo curso.</p>
              <p>Os dados da turma em questão, como alunos, suas faltas, etc...</p>
              <p>Um gráfico exibindo a média de faltas em cada aula por mês no decorrer do ano.</p>
            </TutorialStep>
            <TutorialStep title="Aluno" stage={2}>
              <p>Ao acesso à página do aluno terá acesso a:</p>
              <p>Quantidade de faltas do aluno no decorrer do ano.</p>
              <p>Comparação da média de faltas do curso, com as faltas deste aluno.</p>
              <p>E a distribuição das faltas por disciplina.</p>
            </TutorialStep>
          </Tutorial>
          <Tutorial area={2}>
            <TutorialTitle>Configuração do Usuário</TutorialTitle>
            <TutorialStep title="Alterar dados">
              <p>
                Clicando em “Vizualizar Perfil” no ícone mais à direita do menu de navegação será direcionado à página
                de usuário. Onde poderá alterar seus dados cadastrados.
              </p>
            </TutorialStep>
            <TutorialStep title="Foto de Perfil">
              <p>
                Na página de usuário, poderá alterar sua foto de perfil carregando uma imagem de sua própria máquina.
              </p>
            </TutorialStep>
          </Tutorial>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
