import axios, { AxiosError, AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";
import { useToast } from "../../components/Toast/Toast";
import { FindAllSchools } from "../../services/Escolas";
import { FindStudentsByClass } from "../../services/Alunos";
import { FindClassesBySchool } from "../../services/Turmas";
import { IEscola } from "../../@types/Escolas";
import { IAluno } from "../../@types/Alunos";
import { ITurma } from "../../@types/Turmas";
import { FindDisciplinesByClass } from "../../services/Disciplinas";
import { CreateLesson } from "../../services/Aulas";

interface IDisciplina {
	idDisciplina: number;
	nome: string;
}

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
	setSelectedSchool: React.Dispatch<React.SetStateAction<string>>;
	selectedSchool: string;
	Turmas: ITurma[];
	setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
	selectedClass: string;
	Disciplinas: IDisciplina[];
	setSelectedDiscipline: React.Dispatch<React.SetStateAction<string>>;
	selectedDiscipline: string;
	started: boolean;
	startClass: () => void;
	toggleStudentPresence: (idAluno: number) => void;
	studentPresence: number[];
	endClass: () => void;
	setClassObservations: React.Dispatch<React.SetStateAction<string>>;
	classObservations: string;
	classStartTime?: Date;
	HistoryModal: IModalProps;
	RouteAPI: AxiosInstance;
	isLoading: boolean;
}

const RouteContext = createContext<IRouteContext | null>(null);

const AulaProvider: React.FC<ProviderProps> = ({ children }) => {
	const { notify } = useToast();
	const authHeader = useAuthHeader();

	const RouteAPI = axios.create({
		baseURL: import.meta.env.VITE_SERVER_URL,
		headers: {
			Authorization: authHeader(),
		},
	});

	const [Escolas, setEscolas] = useState<IEscola[]>([]);
	const [Alunos, setAlunos] = useState<IAluno[]>([]);
	const [Turmas, setTurmas] = useState<ITurma[]>([]);
	const [Disciplinas, setDisciplinas] = useState<IDisciplina[]>([]);

	const [isHistoryModalOpen, setHistoryModal] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [selectedSchool, setSelectedSchool] = useState("");
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedDiscipline, setSelectedDiscipline] = useState("");
	const [studentPresence, setStudentPresence] = useState<number[]>([]);

	const [started, setStarted] = useState(false);
	const [classObservations, setClassObservations] = useState("");
	const [classStartTime, setClassStartTime] = useState<Date>();

	const TokenData = useMemo(() => {
		const TOKEN = authHeader();
		const TOKEN_DATA = jwtDecode(TOKEN) as IUserTokenData;
		return TOKEN_DATA;
	}, [authHeader()]);

	const toggleStudentPresence = (idAluno: number) => {
		console.log(idAluno);
		setStudentPresence((values) => {
			console.log(values);
			let newValues: number[];

			if (values.includes(idAluno)) {
				newValues = values.filter((value) => value !== idAluno);
			} else {
				newValues = [...values, idAluno];
			}

			return newValues;
		});
	};

	const startClass = () => {
		setStarted(true);
		setClassStartTime(new Date());
	};

	const endClass = async () => {
		try {
			setLoading(true);

			await CreateLesson(RouteAPI, {
				idDisciplina: Number(selectedDiscipline),
				idTurma: Number(selectedClass),
				idProfessor: TokenData.idUsuario,
				observacoes: classObservations,
				presentes: studentPresence,
			});

			setClassObservations("");
			setAlunos([]);
			setStudentPresence([]);
			setSelectedDiscipline("");
			setSelectedClass("");
			setSelectedSchool("");
			setStarted(false);

			notify({
				title: "Aula criada com sucesso",
			});
		} catch (error: any) {
			if (error instanceof AxiosError) {
				const response = error?.response;
				// ERR_NETWORK -> mostre mais grave

				if (response) {
					notify({
						message: response.data.error.message,
						title: "Erro ao criar aula",
						severity: "error",
					});
					return;
				}
				notify({
					title: error.message,
					severity: "error",
				});
			}

			// Caso error 500 ->  mostre mais grave
		} finally {
			setLoading(false);
		}
	};

	const HistoryModal = useMemo(() => {
		return {
			situation: isHistoryModalOpen,
			close() {
				setSelectedDiscipline("");
				setDisciplinas([]);
				setSelectedClass("");
				setTurmas([]);
				setSelectedSchool("");
				setHistoryModal(false);
			},
			open() {
				setHistoryModal(true);
			},
		};
	}, [isHistoryModalOpen]);

	const loadSchools = async () => {
		try {
			const response = await FindAllSchools(RouteAPI);
			setEscolas(response);
		} catch (error: any) {
			if (error instanceof AxiosError) {
				// ERR_NETWORK -> mostre mais grave

				if (error.status! >= 400 && error.status! < 500) {
					notify({
						message: error.response!.data.error.message,
						title: "Erro ao consultar escolas",
						severity: "warn",
					});
					return;
				}
			}

			// Caso error 500 ->  mostre mais grave
		}
	};

	const loadClasses = async () => {
		try {
			const response = await FindClassesBySchool(RouteAPI, Number(selectedSchool));
			setTurmas(response);
		} catch (error) {
			if (error instanceof AxiosError) {
				// ERR_NETWORK -> mostre mais grave
				if (error.response!.status >= 400 && error.response!.status < 500) {
					notify({
						title: "Erro consultar turmas da escola",
						message: error.response!.data.error.message,
						severity: "warn",
					});
					return;
				}
			}
			// ERR_NETWORK -> mostre mais grave
		}
	};

	const loadDisciplines = async () => {
		try {
			const response = await FindDisciplinesByClass(RouteAPI, Number(selectedClass));
			setDisciplinas(response);
		} catch (error) {
			if (error instanceof AxiosError) {
				// ERR_NETWORK -> mostre mais grave
				if (error.response!.status >= 400 && error.response!.status < 500) {
					notify({
						title: "Erro consultar turmas da escola",
						message: error.response!.data.error.message,
						severity: "warn",
					});
					return;
				}
			}
			// ERR_NETWORK -> mostre mais grave
		}
	};

	const loadStudents = async () => {
		try {
			const alunos = await FindStudentsByClass(RouteAPI, Number(selectedClass));
			setAlunos(alunos);
		} catch (error) {
			if (error instanceof AxiosError) {
				// ERR_NETWORK -> mostre mais grave
				if (error.response!.status >= 400 && error.response!.status < 500) {
					notify({
						title: "Erro consultar alunos da turma",
						message: error.response!.data.error.message,
						severity: "warn",
					});
					return;
				}
			}
			// ERR_NETWORK -> mostre mais grave
		}
	};

	useEffect(() => {
		if (selectedSchool) {
			setSelectedClass("");
			setSelectedDiscipline("");
			loadClasses();
		}
	}, [selectedSchool]);

	useEffect(() => {
		if (selectedClass) {
			setSelectedDiscipline("");
			loadDisciplines().then(() => loadStudents());
		}
	}, [selectedClass]);

	useEffect(() => {
		loadSchools();
		document.title = "Eligo | Aula";
	}, []);

	return (
		<RouteContext.Provider
			value={{
				Escolas,
				selectedSchool,
				endClass,
				RouteAPI,
				setSelectedSchool,
				selectedClass,
				setSelectedClass,
				classObservations,
				setClassObservations,
				Turmas,
				Disciplinas,
				selectedDiscipline,
				studentPresence,
				Alunos,
				HistoryModal,
				started,
				startClass,
				setSelectedDiscipline,
				toggleStudentPresence,
				classStartTime,
				isLoading,
			}}
		>
			{children}
		</RouteContext.Provider>
	);
};

const useAulaContext = () => {
	const context = useContext(RouteContext);

	if (!context) throw new Error("EscolasContext deve ser chamado dentro de AulaProvider");

	return context;
};

export { AulaProvider, useAulaContext };
