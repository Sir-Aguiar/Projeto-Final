import React from "react";
import styles from "./Delete.module.css";
import Modal from "@mui/material/Modal";
import { Fade } from "@mui/material";

const Delete: React.FC = () => {
	return (
		<Modal open={false} onClose={() => {}} closeAfterTransition>
			<Fade in={false}>
				<div className={styles.delete_container}></div>
			</Fade>
		</Modal>
	);
};

export default Delete;
