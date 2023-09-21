import axios, { AxiosError, AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";
import { useParams } from "react-router-dom";
import NotFound from "../Errors/NotFound";

interface IAula {
	idAula: number;
	anotacao: string | null;
	createdAt: string;
	turma: Pick<ITurma, "idEscola" | "nome">;
	disciplina: Pick<IProfessor, "disciplina">;
	profesor: {
		idUsuario: number;
		nome: string;
	};
}

interface IEscola {
	idGestor: number;
	idEscola: number;
	nome: string;
}

interface ITurma {
	idTurma: number;
	nome: string;
	idEscola: number;
	idCurso: number;
}

interface IProfessor {
	idLeciona: number;
	idProfessor: number;
	nome: string;
	turma: {
		idTurma: string;
		nome: string;
	};
	disciplina: {
		idDisciplina: number;
		nome: string;
	};
}

interface IGrid {
	idDisciplina: number;
	nome: string;
	curso: {
		idCurso: number;
		nome: string;
	};
}

interface IDisciplina {
	idDisciplina: number;
	nome: string;
}

interface IUserTokenData {
	email: string;
	idUsuario: number;
	iat: number;
}

interface IModalProps {
	situation: boolean;
	open: () => void;
	close: () => void;
}
type ProviderProps = {
	children: React.ReactNode;
};

interface IRouteContext {
	SchoolData: IEscola;
	ProfessorsData: IProfessor[];
	DisciplinesData: IDisciplina[];
	GridData: IGrid[];
	professorsCount: number;
	disciplinesCount: number;
	ProfessorModal: IModalProps;
	DisciplineModal: IModalProps;
	loadDisciplineData: (initial?: boolean) => Promise<void>;
	loadGridData: () => Promise<void>;
	loadProfessorData: (initial?: boolean) => Promise<void>;
	RouteAPI: AxiosInstance;
	DisciplineDrawer: IModalProps;
	ProfessorDrawer: IModalProps;
	Classes: ITurma[];
	ToDayClassRooms: IAula[];
	todayDate: Date;
}

const RouteContext = createContext<IRouteContext | null>(null);

const EscolaProvider: React.FC<ProviderProps> = ({ children }) => {
	const { idEscola } = useParams();
	const [isUserAuthorized, setUserAuthorized] = useState(true);
	const [SchoolData, setSchoolData] = useState<IEscola>({} as IEscola);
	const authHeader = useAuthHeader();
	const [professorsCount, setProfessorsCount] = useState(0);
	const [ProfessorsData, setProfessorsData] = useState<IProfessor[]>([]);
	const [disciplinesCount, setDisciplinesCount] = useState(0);
	const [DisciplinesData, setDisciplinesData] = useState<IDisciplina[]>([]);
	const [GridData, setGridData] = useState<IGrid[]>([]);
	const [Classes, setClasses] = useState<ITurma[]>([]);
	const [ToDayClassRooms, setTodayClassRooms] = useState<IAula[]>([]);
	const [isProfessorModalOpen, setProfessorModalOpen] = useState(false);
	const [isDisciplineModalOpen, setDisciplineModalOpen] = useState(false);
	const [isDisciplineDrawerOpen, setDisciplineDrawerOpen] = useState(false);
	const [isProfessorDrawerOpen, setProfessorDrawerOpen] = useState(false);
	const [todayDate, setTodayDate] = useState<Date>(new Date("2023/09/20"));
	const ProfessorModal = useMemo(() => {
		return {
			situation: isProfessorModalOpen,
			close() {
				loadInitialData().then(() => setProfessorModalOpen(false));
			},
			open() {
				loadSchoolClasses().then(() =>
					loadDisciplineData(false).then(() => loadProfessorData(false).then(() => setProfessorModalOpen(true))),
				);
			},
		};
	}, [isProfessorModalOpen]);

	const DisciplineModal = useMemo(() => {
		return {
			situation: isDisciplineModalOpen,
			close() {
				setDisciplineModalOpen(false);
			},
			open() {
				loadDisciplineData(false)
					.then(() => loadGridData())
					.then(() => setDisciplineModalOpen(true));
			},
		};
	}, [isDisciplineModalOpen]);

	const ProfessorDrawer = useMemo(() => {
		return {
			situation: isProfessorDrawerOpen,
			close() {
				loadInitialData().then(() => setProfessorDrawerOpen(false));
			},
			open() {
				loadGridData().then(() => setProfessorDrawerOpen(true));
			},
		};
	}, [isProfessorDrawerOpen]);

	const DisciplineDrawer = useMemo(() => {
		return {
			situation: isDisciplineDrawerOpen,
			close() {
				loadInitialData().then(() => setDisciplineDrawerOpen(false));
			},
			open() {
				loadDisciplineData(false)
					.then(() => loadGridData())
					.then(() => setDisciplineDrawerOpen(true));
			},
		};
	}, [isDisciplineDrawerOpen]);

	const TokenData = useMemo(() => {
		const TOKEN = authHeader();
		const TOKEN_DATA = jwtDecode(TOKEN) as IUserTokenData;
		return TOKEN_DATA;
	}, [authHeader()]);

	const RouteAPI = axios.create({
		baseURL: import.meta.env.VITE_SERVER_URL,
		headers: {
			Authorization: authHeader(),
		},
	});

	const loadSchoolClasses = async () => {
		try {
			const response = await RouteAPI.get(`/turma?idEscola=${idEscola}`);
			console.log(response.data.turmas);
			setClasses(response.data.turmas);
		} catch (error: any) {
			console.log(error);
		}
	};

	const loadSchoolData = async () => {
		try {
			const response = await RouteAPI.get(`/escola?idEscola=${idEscola}`);
			setSchoolData(response.data.escola);
		} catch (error: any) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					setUserAuthorized(false);
					return;
				}
				if (error.response?.status === 404) {
					setUserAuthorized(false);
					return;
				}
			}
		}
	};

	const loadProfessorData = async (initial = true) => {
		if (initial) {
			try {
				const response = await RouteAPI.get(`/professor?idEscola=${idEscola}&onlyLength=true`);
				setProfessorsCount(response.data.length);
				return;
			} catch (error: any) {
				console.log(error);
				if (error instanceof AxiosError) {
				}
			}
		}
		try {
			const response = await RouteAPI.get(`/professor?idEscola=${idEscola}`);
			setProfessorsData(response.data.professores);
			return;
		} catch (error: any) {
			console.log(error);
			if (error instanceof AxiosError) {
			}
		}
	};

	const loadDisciplineData = async (initial = true) => {
		if (initial) {
			try {
				const response = await RouteAPI.get(`/disciplina?idEscola=${idEscola}&onlyLength=true`);
				setDisciplinesCount(response.data.length);
				return;
			} catch (error: any) {
				console.log(error);
				if (error instanceof AxiosError) {
				}
			}
		}
		try {
			const response = await RouteAPI.get(`/disciplina?idEscola=${idEscola}`);
			setDisciplinesData(response.data.disciplinas);
			return;
		} catch (error: any) {
			console.log(error);
			if (error instanceof AxiosError) {
			}
		}
	};
	const loadTodayClassRooms = async () => {
		try {
			const response = await RouteAPI.get(
				`/aula?idEscola=${idEscola}&createdAt=${todayDate.toLocaleString("en-US", { dateStyle: "short" })}`,
			);
			setTodayClassRooms(response.data.aulas);
		} catch (error: any) {
			console.log(error);
		}
	};
	const loadInitialData = async () => {
		await loadSchoolData();
		await loadProfessorData();
		await loadDisciplineData();
		await loadTodayClassRooms();
	};

	const loadGridData = async () => {
		try {
			const response = await RouteAPI.get(`/grade?idEscola=${idEscola}`);
			setGridData(response.data.grade);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return alert("Você não possui acesso à esta escola");
				}
			}
		}
	};

	useEffect(() => {
		loadInitialData();
		setTodayDate(new Date("2023/09/20"));
	}, []);

	return (
		<RouteContext.Provider
			value={{
				disciplinesCount,
				DisciplinesData,
				ProfessorDrawer,
				DisciplineDrawer,
				loadDisciplineData,
				loadProfessorData,
				professorsCount,
				todayDate,
				ProfessorsData,
				SchoolData,
				ProfessorModal,
				DisciplineModal,
				loadGridData,
				Classes,
				ToDayClassRooms,
				GridData,
				RouteAPI,
			}}
		>
			{isUserAuthorized ? children : <NotFound />}
		</RouteContext.Provider>
	);
};

const useEscolaContext = () => {
	const context = useContext(RouteContext);

	if (!context) throw new Error("EscolasContext deve ser chamado dentro de EscolaProvider");

	return context;
};

export { EscolaProvider, useEscolaContext };
