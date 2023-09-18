import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navigation/Navbar/NavBar";
import Escolas from "./pages/Escolas/Escolas";
import Profile from "./components/Profile/Profile";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Profile />
	</React.StrictMode>,
);
