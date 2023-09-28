import React, { useEffect } from "react";
import styles from "./ConfirmPopup.module.css";
import Modal from "@mui/material/Modal";

import { Fade } from "@mui/material";
import { Message } from "@mui/icons-material";

type Props = { open: boolean; onClose: any; message: any };

const ConfirmPopup: React.FC<Props> = ({ message, onClose, open }) => {
	useEffect(() => {
		setTimeout(() => {
			onClose();
		}, 3000);
	}, [open]);
	return <div className={`${styles.pop_container} ${open && styles.active}`}>{open && <p>{message}</p>}</div>;
};

export default ConfirmPopup;
