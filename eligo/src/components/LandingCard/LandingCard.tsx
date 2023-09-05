import React from "react";
import styles from "./LandingCard.module.css";
type Props = {
	image: string;
	text: string;
};
const LandingCard: React.FC<Props> = ({ image, text }) => {
	return (
		<div className={styles.card_container}>
			<img src={image} className={styles.image} />
			<h1 className={styles.text}>{text}</h1>
		</div>
	);
};

export default LandingCard;
