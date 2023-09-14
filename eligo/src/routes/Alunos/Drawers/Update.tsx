import React from "react";
import styles from "./Update.module.css";
import { Divider, Drawer, TextField } from "@mui/material";

const Update: React.FC = () => {
	return (
		<Drawer anchor="right" open={false} onClose={() => {}}>
			<div className={styles.update_container}></div>
		</Drawer>
	);
};

export default Update;
