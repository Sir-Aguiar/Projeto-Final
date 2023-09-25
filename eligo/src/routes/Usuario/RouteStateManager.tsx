import axios, { AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";

interface IUserTokenData {
	email: string;
	idUsuario: number;
	iat: number;
}

type ProviderProps = {
	children: React.ReactNode;
};

interface IRouteContext {
	fullName: String;
	email: String;
	setFullName: React.Dispatch<React.SetStateAction<string>>;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	RouteAPI: AxiosInstance;
}

const RouteContext = createContext<IRouteContext | null>(null);

const UsuarioProvider: React.FC<ProviderProps> = ({ children }) => {
	const authHeader = useAuthHeader();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");

	const RouteAPI = axios.create({
		baseURL: import.meta.env.VITE_SERVER_URL,
		headers: {
			Authorization: authHeader(),
		},
	});

	const loadUserData = async () => {
		try {
			const response = await RouteAPI.get(`/usuario`);
			setFullName(response.data.usuario.nome);
			setEmail(response.data.usuario.email);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		loadUserData();
	}, []);

	return (
		<RouteContext.Provider value={{ email, fullName, setEmail, setFullName, RouteAPI }}>
			{children}
		</RouteContext.Provider>
	);
};

const useUsuarioContext = () => {
	const context = useContext(RouteContext);

	if (!context) throw new Error("EscolasContext deve ser chamado dentro de UsuarioProvider");

	return context;
};

export { UsuarioProvider, useUsuarioContext };
