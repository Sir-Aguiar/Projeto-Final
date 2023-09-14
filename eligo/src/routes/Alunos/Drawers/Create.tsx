import React from "react";
import styles from "./Create.module.css";
import { Divider, Drawer, TextField } from "@mui/material";

const Create: React.FC = () => {
	return (
		<Drawer anchor="right" open={false} onClose={() => {}}>
			<div className={styles.insert_container}></div>
		</Drawer>
	);
};

export default Create;
