import React from "react";
import styles from "./Homepage.module.css";

import ClassroomBro from "../../assets/Homepage/Classroom-bro.png";
import LearningCuate from "../../assets/Homepage/Learning-cuate.png";
import ModernWoman from "../../assets/Homepage/Modern woman-bro.png";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";

const Homepage: React.FC = () => {
	return (
		<div className={styles.content_section}>
			<header className={styles.home_header}>
				<div className={styles.invite_section}>
					<div className={styles.head}>
						<h1>Lorem ipsum dolor sit </h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse donec.</p>
					</div>
					<img src={ClassroomBro} className="max-h-[110px]" />
					<button className={styles.invite_button}>
						<Link className={styles.clipped_wave} to="/turmas">
							Lorem Ipsum Dolor
						</Link>
					</button>
				</div>
				<div className={styles.main_panel}>
					<main className={styles.pane_content}>
						<div className="w-full h-full flex flex-col justify-between">
							<header className={`${styles.panel_head}`}>
								<h1>Lorem ipsum dolor sit </h1>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse donec.</p>
							</header>
							<button className="w-[150px] bg-blue-400 h-[35px] rounded-sm"></button>
						</div>
						<img src={ModernWoman} className="max-h-[140px]" />
					</main>
					<footer className={styles.lesson_warn}></footer>
				</div>
				<div className={styles.invite_section}>
					<div className={styles.head}>
						<h1>Lorem ipsum dolor sit </h1>
						<p>Lorem ipsum dolor sit amet, consectetur.</p>
					</div>
					<img src={LearningCuate} className="max-h-[90px]" />
					<input type="text" placeholder="Nome do Aluno" className={styles.student_input} />
					<button className={styles.invite_button}>
						<Link className={`bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-200`} to="/alunos">
							Lorem Ipsum Dolor
						</Link>
					</button>
				</div>
			</header>
		</div>
	);
};

export default Homepage;
