import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navigation/Navbar/NavBar";
import Escolas from "./pages/Escolas/Escolas";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Escolas />
	</React.StrictMode>,
);
