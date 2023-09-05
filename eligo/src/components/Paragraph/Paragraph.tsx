import React from "react";
import styles from "./Paragraph.module.css";

type Props = {
	direction: "right" | "left";
	image: string;
	title: string;
	paragraph: string;
};

const Paragraph: React.FC<Props> = ({ direction, image, title, paragraph }) => {
	return (
		<div
			className={`${styles.paragraph_container} ${
				direction === "right" ? "flex-wrap" : "flex-wrap-reverse flex-row-reverse"
			}`}
		>
			<img className={styles.image} src={image} />
			<div className={`${styles.text} ${direction === "right" ? "text-right" : "text-left"}`}>
				<h1 className={`${styles.title}`}>{title}</h1>
				<p className={`${styles.paragraph}`}>{paragraph}</p>
			</div>
		</div>
	);
};

export default Paragraph;
