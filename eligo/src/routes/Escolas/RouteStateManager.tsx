import axios, { AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";

interface IEscola {
	idEscola: number;
	idGestor: number;
	nome: string;
}

interface ITurma {
	idTurma: number;
	idCurso: string;
	idEscola: number;
	nome: string;
}

type ProviderProps = {
	children: React.ReactNode;
};

interface IModalProps {
	situation: boolean;
	open: () => void;
	close: () => void;
}

interface IRouteContext {
	RouteAPI: AxiosInstance;
	DrawerCreate: IModalProps;
	DrawerUpdate: IModalProps;
	ModalDelete: IModalProps;
	Escolas: IEscola[];
	Turmas: ITurma[];
	selectedRows: number[];
	selectRow: (idEscola: number) => void;
}

const RouteContext = createContext<IRouteContext | null>(null);

const EscolasProvider: React.FC<ProviderProps> = ({ children }) => {
	const authHeader = useAuthHeader();
	const [isCreateOpen, setCreateDrawer] = useState(false);
	const [isUpdateOpen, setUpdateDrawer] = useState(false);
	const [isDeleteOpen, setDeleteModal] = useState(false);
	const [Turmas, setTurmas] = useState<ITurma[]>([]);
	const [Escolas, setEscolas] = useState<IEscola[]>([]);
	const [selectedRows, setRows] = useState<number[]>([]);

	// Axios instance
	const RouteAPI = axios.create({
		baseURL: import.meta.env.VITE_SERVER_URL,
		headers: {
			Authorization: authHeader(),
		},
	});

	const showClasses = async (idEscola: number) => {
		const response = await RouteAPI.get(`/turma?idEscola=${idEscola}`);
		setTurmas(response.data.turmas);
	};

	const showSchools = async () => {
		try {
			const response = await RouteAPI.get("/escola");
			setEscolas(response.data.escolas);
		} catch (error: any) {
			alert(error.response.data.error.message);
		}
	};

	const selectRow = (idEscola: number) => {
		setRows((values) => {
			let newValues: number[];

			if (values.includes(idEscola)) {
				newValues = values.filter((value) => value !== idEscola);
			} else {
				newValues = [...values, idEscola];
			}
			if (newValues.length === 1) {
				showClasses(newValues[0]);
			} else {
				setTurmas([]);
			}
			return newValues;
		});
	};

	const DrawerCreate: IModalProps = useMemo(() => {
		return {
			situation: isCreateOpen,
			open: () => setCreateDrawer(true),
			close: () => {
				showSchools().then(() => {
					setCreateDrawer(false);
				});
			},
		};
	}, [isCreateOpen]);

	const DrawerUpdate: IModalProps = useMemo(() => {
		return {
			situation: isUpdateOpen,
			open: () => setUpdateDrawer(true),
			close: () => {
				showSchools().then(() => {
					setUpdateDrawer(false);
				});
			},
		};
	}, [isUpdateOpen]);

	const ModalDelete: IModalProps = useMemo(() => {
		return {
			situation: isDeleteOpen,
			open: () => setDeleteModal(true),
			close: () => {
				showSchools().then(() => {
					setDeleteModal(false);
					setRows([]);
				});
			},
		};
	}, [isDeleteOpen]);

	useEffect(() => {
		showSchools();
	}, []);

	return (
		<RouteContext.Provider
			value={{
				RouteAPI,
				DrawerUpdate,
				DrawerCreate,
				ModalDelete,
				Escolas,
				Turmas,
				selectedRows,
				selectRow,
			}}
		>
			{children}
		</RouteContext.Provider>
	);
};

const useEscolasContext = () => {
	const context = useContext(RouteContext);

	if (!context) throw new Error("EscolasContext deve ser chamado dentro de EscolasProvider");

	return context;
};

export { EscolasProvider, useEscolasContext };
