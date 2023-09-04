import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import Escolas from "./pages/Escolas/Escolas";
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Escolas />
	</React.StrictMode>,
);
