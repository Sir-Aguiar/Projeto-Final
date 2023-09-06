import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthProvider } from "react-auth-kit";
import { Router } from "./routes/Router";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<AuthProvider authType="localstorage" authName="_auth">
			<Router />
		</AuthProvider>
	</React.StrictMode>,
);
