import axios, { AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { FindAllSchools } from "../../services/Escolas";
import jwtDecode from "jwt-decode";
import { FindClassesBySchool } from "../../services/Turmas";
import { IAluno } from "../../@types/Alunos";
import { IEscola } from "../../@types/Escolas";
import { ITurma } from "../../@types/Turmas";
import { FindStudentsBySchool } from "../../services/Alunos";

interface IUserTokenData {
	email: string;
	idUsuario: number;
	iat: number;
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
	Alunos: IAluno[];
	Escolas: IEscola[];
	Turmas: ITurma[];
	RouteAPI: AxiosInstance;
	DrawerCreate: IModalProps;
	DrawerUpdate: IModalProps;
	ModalDelete: IModalProps;
	selectedRows: number[];
	selectRow: (idTurma: number) => void;
	showSchools: () => Promise<void>;
	showClasses: (idEscola?: number) => Promise<void>;
	showStudent: (idEscola?: number) => Promise<void>;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	isLoading: boolean;
	selectedSchool: string;
	selectedClass: string;
	setSelectedSchool: React.Dispatch<React.SetStateAction<string>>;
	setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
	TokenData: IUserTokenData;
	isSnackbarOpen: boolean;
	SnackMessage: string;
	setSnackMessage: React.Dispatch<React.SetStateAction<string>>;
	setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RouteContext = createContext<IRouteContext | null>(null);

const AlunosProvider: React.FC<ProviderProps> = ({ children }) => {
	const authHeader = useAuthHeader();
	const [isSnackbarOpen, setSnackbarOpen] = useState(false);
	const [SnackMessage, setSnackMessage] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [isCreateOpen, setCreateDrawer] = useState(false);
	const [isUpdateOpen, setUpdateDrawer] = useState(false);
	const [isDeleteOpen, setDeleteModal] = useState(false);
	const [selectedRows, setRows] = useState<number[]>([]);

	const [selectedSchool, setSelectedSchool] = useState("");
	const [selectedClass, setSelectedClass] = useState("");

	const [Alunos, setAlunos] = useState<IAluno[]>([]);
	const [Turmas, setTurmas] = useState<ITurma[]>([]);
	const [Escolas, setEscolas] = useState<IEscola[]>([]);

	const TokenData = useMemo(() => {
		const TOKEN = authHeader();
		const TOKEN_DATA = jwtDecode(TOKEN) as IUserTokenData;
		return TOKEN_DATA;
	}, [authHeader()]);

	// Axios instance
	const RouteAPI = axios.create({
		baseURL: import.meta.env.VITE_SERVER_URL,
		headers: {
			Authorization: authHeader(),
		},
	});

	const DrawerCreate: IModalProps = useMemo(() => {
		return {
			situation: isCreateOpen,
			open: () => {
				showSchools().then(() => setCreateDrawer(true));
			},
			close: () => {
				showStudent().then(() => setCreateDrawer(false));
			},
		};
	}, [isCreateOpen]);

	const DrawerUpdate: IModalProps = useMemo(() => {
		return {
			situation: isUpdateOpen,
			open: () => {
				showClasses().then(() => setUpdateDrawer(true));
			},
			close: () => {
				setUpdateDrawer(false);
			},
		};
	}, [isUpdateOpen]);

	const ModalDelete: IModalProps = useMemo(() => {
		return {
			situation: isDeleteOpen,
			open: () => setDeleteModal(true),
			close: () => {
				showStudent().then(() => {
					setDeleteModal(false);
					setRows([]);
				});
			},
		};
	}, [isDeleteOpen]);

	const selectRow = (idAluno: number) => {
		const toSelectStudent = Alunos.find((aluno) => aluno.idAluno === idAluno);
		if (toSelectStudent?.escola.idGestor === TokenData.idUsuario) {
			setRows((values) => {
				let newValues: number[];

				if (values.includes(idAluno)) {
					newValues = values.filter((value) => value !== idAluno);
				} else {
					newValues = [...values, idAluno];
				}
				/* 			if (newValues.length === 1) {
          showClassStudents(newValues[0]);
        } else {
          setAlunoTurma([]);
        } */
				return newValues;
			});
		}
	};

	const showSchools = async () => {
		try {
			const response = await FindAllSchools(RouteAPI);
			setEscolas(response);
		} catch (error: any) {
			console.log(error);
			const response = error.response;
			alert(response.data.error.message);
		}
	};

	const showClasses = async (idEscola?: number) => {
		if (idEscola) {
			console.log(idEscola);
			try {
				const response = await FindClassesBySchool(RouteAPI, Number(idEscola));
				console.log(response);
				setTurmas(response);
			} catch (error: any) {
				const response = error.response;
				alert(response.data.error.message);
				console.log(response.data.error.message);
			}
		} else if (selectedSchool) {
			try {
				const response = await FindClassesBySchool(RouteAPI, Number(selectedSchool));
				setTurmas(response);
			} catch (error: any) {
				const response = error.response;
				alert(response.data.error.message);
				console.log(response.data.error.message);
			}
		}
	};

	const showStudent = async () => {
		setLoading(true);

		if (selectedSchool) {
			try {
				const response = await FindStudentsBySchool(RouteAPI, Number(selectedSchool));
				setAlunos(response);
			} catch (error: any) {
				const response = error.response;
				console.log(response.data.error.message);
				alert(response.data.error.message);
			}
		}

		setLoading(false);
	};

	useEffect(() => {
		document.title = "Eligo | Alunos";
		showSchools();
	}, []);

	useEffect(() => {
		showStudent();
		showClasses();
	}, [selectedSchool]);

	return (
		<RouteContext.Provider
			value={{
				Alunos,
				DrawerCreate,
				isSnackbarOpen,
				setSnackbarOpen,
				setSnackMessage,
				SnackMessage,
				TokenData,
				DrawerUpdate,
				ModalDelete,
				RouteAPI,
				selectedRows,
				Escolas,
				Turmas,
				selectRow,
				showClasses,
				showSchools,
				showStudent,
				isLoading,
				setLoading,
				selectedClass,
				selectedSchool,
				setSelectedClass,
				setSelectedSchool,
			}}
		>
			{children}
		</RouteContext.Provider>
	);
};

const useAlunosContext = () => {
	const context = useContext(RouteContext);

	if (!context) throw new Error("AlunosContext deve ser chamado dentro de AlunosProvider");

	return context;
};

export { AlunosProvider, useAlunosContext };
