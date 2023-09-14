import axios, { AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";

type ProviderProps = {
	children: React.ReactNode;
};

interface IModalProps {
	situation: boolean;
	open: () => void;
	close: () => void;
}

interface IAluno {
	idAluno: number;
	nome: string;
	escola: {
		idEscola: number;
		nome: string;
	};
	turma: {
		idTurma: number;
		nome: string;
		curso: {
			idCurso: number;
			nome: string;
		};
	};
}

interface IRouteContext {
	Alunos: IAluno[];
	AlunosQTD: number;
	RouteAPI: AxiosInstance;
	DrawerCreate: IModalProps;
	DrawerUpdate: IModalProps;
	ModalDelete: IModalProps;
	selectedRows: number[];
	selectRow: (idTurma: number) => void;
	loadMore: () => Promise<void>;
}

const RouteContext = createContext<IRouteContext | null>(null);

const AlunosProvider: React.FC<ProviderProps> = ({ children }) => {
	const authHeader = useAuthHeader();
	const [isCreateOpen, setCreateDrawer] = useState(false);
	const [isUpdateOpen, setUpdateDrawer] = useState(false);
	const [isDeleteOpen, setDeleteModal] = useState(false);
	const [selectedRows, setRows] = useState<number[]>([]);
	const [Alunos, setAlunos] = useState<IAluno[]>([]);
	const [AlunosQTD, setAlunosQTD] = useState(0);
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
			open: () => {},
			close: () => {},
		};
	}, [isCreateOpen]);

	const DrawerUpdate: IModalProps = useMemo(() => {
		return {
			situation: isUpdateOpen,
			open: () => {},
			close: () => {},
		};
	}, [isUpdateOpen]);

	const ModalDelete: IModalProps = useMemo(() => {
		return {
			situation: isDeleteOpen,
			open: () => {},
			close: () => {},
		};
	}, [isDeleteOpen]);

	const selectRow = (idAluno: number) => {
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
	};

	const showStudent = async () => {
		const response = await RouteAPI.get(`/aluno`);
		setAlunos(response.data.alunos);
		setAlunosQTD(response.data.qtd);
	};

	const loadMore = async () => {
		const skip = Alunos.length;
		const response = await RouteAPI.get(`/aluno?skip=${skip}`);
		setAlunos((values) => [...values, ...response.data.alunos]);
		setAlunosQTD(response.data.qtd);
	};

	useEffect(() => {
		showStudent();
	}, []);

	return (
		<RouteContext.Provider
			value={{
				loadMore,
				Alunos,
				AlunosQTD,
				DrawerCreate,
				DrawerUpdate,
				ModalDelete,
				RouteAPI,
				selectedRows,
				selectRow,
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
