import React, { createContext, useContext, useState } from "react";
import styles from "./Toast.module.css";
import { Close } from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import InfoIcon from "@mui/icons-material/Info";
import { Divider, Zoom } from "@mui/material";

type ToastSeverity = "success" | "info" | "warn" | "error";

interface IToastContext {
	notify: (options: ToastProps) => void;
}

const ToastContext = createContext<IToastContext | null>(null);

interface ToastProps {
	severity?: ToastSeverity;
	autoHide?: number;
	message?: string;
	title: string;
}

const ToastProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
	const severityColor = {
		success: "#40B85B",
		info: "#228CE5",
		warn: "#F2973D",
		error: "#E53939",
	};

	const titleIcon = {
		success: <CheckCircleIcon sx={{ height: "20px", widht: "20px", fill: severityColor.success }} />,
		info: <InfoIcon sx={{ height: "20px", widht: "20px", fill: severityColor.info }} />,
		warn: <ReportIcon sx={{ height: "20px", widht: "20px", fill: severityColor.warn }} />,
		error: <ErrorIcon sx={{ height: "20px", widht: "20px", fill: severityColor.error }} />,
	};

	const [severity, setSeverity] = useState<ToastSeverity>("success");
	const [message, setMessage] = useState("");
	const [title, setTitle] = useState("");
	const [open, setOpen] = useState(false);
	const [currentTimeout, setCurrentTimeout] = useState<any>();

	const notify = (options: ToastProps) => {
		if (currentTimeout) {
			clearTimeout(currentTimeout);
			setCurrentTimeout(undefined);
		}

		const { autoHide, title, message, severity } = options;

		setMessage(message || "");
		setTitle(title);
		setSeverity(severity || "success");
		setOpen(true);

		const timeOut = setTimeout(() => {
			setOpen(false);
		}, 3000 || autoHide);

		setCurrentTimeout(timeOut);
	};

	const close = () => {
		if (currentTimeout) {
			clearTimeout(currentTimeout);
			setCurrentTimeout(undefined);
		}
		setOpen(false);
	};

	const Toast = () => {
		return (
			<Zoom in={open} unmountOnExit mountOnEnter>
				<div className={`${styles.toast_container}`}>
					<header className="w-full h-[40px] flex items-center justify-between p-2">
						<div className="h-full flex items-center gap-2">
							{titleIcon[severity]}
							<span className={`font-semibold text-sm`} style={{ color: severityColor[severity] }}>
								{title}
							</span>
						</div>
						<Close sx={{ height: "20px", widht: "20px", cursor: "pointer" }} onClick={close} />
					</header>
					<Divider />
					{message && (
						<main className="w-full h-full flex items-center justify-center p-2 gap-2">
							<span className="text-[12px]">{message}</span>
						</main>
					)}
				</div>
			</Zoom>
		);
	};

	return (
		<ToastContext.Provider value={{ notify }}>
			<>
				<Toast />
				{children}
			</>
		</ToastContext.Provider>
	);
};

const useToast = () => {
	const context = useContext(ToastContext);

	if (!context) throw new Error("ToastContext deve ser chamado dentro de ToastProvider");

	return context;
};

export { useToast, ToastProvider };
export type { ToastProps };
