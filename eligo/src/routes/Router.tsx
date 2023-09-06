import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { RequireAuth, useIsAuthenticated } from "react-auth-kit";
import Login from "./Login/Login";
import LandingPage from "./LandingPage/LandingPage";
import Register from "./Register/Register";
import Navbar from "../components/Navigation/Navbar/NavBar";
import Escolas from "./Escolas/Escolas";

const PrivateRoutes = () => {
	return (
		<RequireAuth loginPath={"/login"}>
			<>
				<Navbar />
				<Outlet />
			</>
		</RequireAuth>
	);
};

const Router = () => {
	const isUserLogged = useIsAuthenticated();

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PrivateRoutes />}>
					<Route path="/escolas" element={<Escolas />} />
				</Route>

				<Route path="/login" element={<Login />} />
				<Route path="/registro" element={<Register />} />
				<Route path="/" element={isUserLogged() ? <LandingPage></LandingPage> : <LandingPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export { Router };
