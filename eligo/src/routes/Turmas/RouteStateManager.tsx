import axios, { AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";

interface IModalProps {
	situation: boolean;
	open: () => void;
	close: () => void;
}

interface ITurma {
	idTurma: number;
	idCurso: number;
	idEscola: number;
	escola: {
		idGestor: number;
		nome: string;
	};
	curso: {
		nome: string;
	};
	nome: string;
}

interface IEscola {
	idEscola: number;
	idGestor: number;
	nome: string;
}

interface IAluno {
	idAluno: number;
	idTurma: number;
	idEscola: number;
	nome: string;
}

type ProviderProps = {
	children: React.ReactNode;
};

interface IRouteContext {
	RouteAPI: AxiosInstance;
	DrawerCreate: IModalProps;
	DrawerUpdate: IModalProps;
	ModalDelete: IModalProps;
	TurmasState: ITurma[];
	EscolasState: IEscola[];
	AlunosTurmaState: IAluno[];
	selectedRows: number[];
	selectRow: (idTurma: number) => void;
}

const RouteContext = createContext<IRouteContext | null>(null);

const TurmasProvider: React.FC<ProviderProps> = ({ children }) => {
	const authHeader = useAuthHeader();
	const [isCreateOpen, setCreateDrawer] = useState(false);
	const [isUpdateOpen, setUpdateDrawer] = useState(false);
	const [isDeleteOpen, setDeleteModal] = useState(false);
	const [TurmasState, setTurmas] = useState<ITurma[]>([]);
	const [AlunosTurmaState, setAlunoTurma] = useState<IAluno[]>([]);
	const [EscolasState, setEscolas] = useState<IEscola[]>([]);
	const [selectedRows, setRows] = useState<number[]>([]);

	// Axios instance
	const RouteAPI = axios.create({
		baseURL: import.meta.env.VITE_SERVER_URL,
		headers: {
			Authorization: authHeader(),
		},
	});

	const selectRow = (idTurma: number) => {
		setRows((values) => {
			let newValues: number[];

			if (values.includes(idTurma)) {
				newValues = values.filter((value) => value !== idTurma);
			} else {
				newValues = [...values, idTurma];
			}
			if (newValues.length === 1) {
				showClassStudents(newValues[0]);
			} else {
				setAlunoTurma([]);
			}
			return newValues;
		});
	};

	const showSchools = async () => {
		try {
			const response = await RouteAPI.get("/escola");
			setEscolas(response.data.escolas);
		} catch (error: any) {
			alert(error.response.data.error.message);
		}
	};

	const showClasses = async () => {
		const response = await RouteAPI.get(`/turma`);
		setTurmas(response.data.turmas);
	};

	const showClassStudents = async (idTurma: number) => {
		const response = await RouteAPI.get(`/aluno?idTurma=${idTurma}`);
		setAlunoTurma(response.data.alunos);
	};

	const DrawerCreate: IModalProps = useMemo(() => {
		return {
			situation: isCreateOpen,
			open: () => {
				showSchools().then(() => setCreateDrawer(true));
			},
			close: () => {
				showClasses().then(() => {
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
				showClasses().then(() => {
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
				showClasses().then(() => {
					setDeleteModal(false);
					setRows([]);
				});
			},
		};
	}, [isDeleteOpen]);

	useEffect(() => {
		showClasses();
	}, []);

	return (
		<RouteContext.Provider
			value={{
				RouteAPI,
				DrawerUpdate,
				DrawerCreate,
				ModalDelete,
				TurmasState,
				EscolasState,
				selectedRows,
				selectRow,
				AlunosTurmaState,
			}}
		>
			{children}
		</RouteContext.Provider>
	);
};

const useTurmasContext = () => {
	const context = useContext(RouteContext);

	if (!context) throw new Error("EscolasContext deve ser chamado dentro de TurmasProvider");

	return context;
};

export { TurmasProvider, useTurmasContext };
