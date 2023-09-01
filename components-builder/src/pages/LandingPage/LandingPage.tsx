import React from "react";
import styles from "./LandingPage.module.css";
import LandingCard from "../../components/LandingCard/LandingCard";
import cloud from "../../assets/cloud.png";
import support from "../../assets/support.png";
import student from "../../assets/student.png";
import NoLoginNavbar from "../../components/Navigation/NoLoginNavbar/NoLoginNavBar";
const LandingPage: React.FC = () => {
	return (
		<>
			<NoLoginNavbar />
			<div className={styles.content_container}>
				<div className={styles.introduction}>
					<div className="bg-red-400 h-full w-full min-h-[296px] max-w-[448px] tablet:max-w-[400px] mobile:max-w-[328px]"></div>
					<div className={styles.message_container}>
						<h1 className={styles.introduction_title}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at neque aliquam, sodales turpis id,
							porttitor eros.
						</h1>
						<div className={styles.invite}>
							<p className={styles.cta_invite}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
							<div className={styles.CTAs}>
								<button className={styles.secundary}></button>
								<button className={styles.primary}></button>
							</div>
						</div>
					</div>
				</div>

				<div className={styles.promotions}>
					<LandingCard image={cloud} text="Lorem ipsum dolor sit et." />
					<LandingCard image={student} text="Lorem ipsum dolor sit et." />
					<LandingCard image={support} text="Lorem ipsum dolor sit et." />
				</div>
			</div>
		</>
	);
};

export default LandingPage;
