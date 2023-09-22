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

interface ITurma {
  idTurma: number;
  idCurso: number;
  idEscola: number;
  nome: string;
  escola: {
    idGestor: number;
    nome: string;
  };
  curso: {
    nome: string;
  };
}
interface IEscola {
  idEscola: number;
  idGestor: number;
  nome: string;
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
  EscolasState: IEscola[];
  TurmasState: ITurma[];
  AlunosQTD: number;
  RouteAPI: AxiosInstance;
  DrawerCreate: IModalProps;
  DrawerUpdate: IModalProps;
  ModalDelete: IModalProps;
  selectedRows: number[];
  selectRow: (idTurma: number) => void;
  loadMore: () => Promise<void>;
  showSchools: () => Promise<void>;
  showClasses: (idEscola?: number) => Promise<void>;
  showStudent: (idEscola?: number) => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
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
  const [TurmasState, setTurmas] = useState<ITurma[]>([]);
  const [EscolasState, setEscolas] = useState<IEscola[]>([]);
  const [isLoading, setLoading] = useState(false);
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
        setEscolas([]);
        setTurmas([]);
      },
    };
  }, [isCreateOpen]);

  const DrawerUpdate: IModalProps = useMemo(() => {
    return {
      situation: isUpdateOpen,
      open: () => {
        showClasses().then(() => setUpdateDrawer(true));
      },
      close: () => {},
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

  const showSchools = async () => {
    const response = await RouteAPI.get("/escola");
    setEscolas(response.data.escolas);
  };

  const showClasses = async (idEscola?: number) => {
    const response = await RouteAPI.get(`/turma${idEscola && `?idEscola=${idEscola}`}`);
    setTurmas(response.data.turmas);
  };

  const showStudent = async () => {
    setLoading(true);
    const response = await RouteAPI.get(`/aluno`);
    setAlunos(response.data.alunos);
    setAlunosQTD(response.data.qtd);
    setLoading(false);
  };

  const loadMore = async () => {
    const skip = Alunos.length;
    const response = await RouteAPI.get(`/aluno?skip=${skip}`);
    setAlunos((values) => [...values, ...response.data.alunos]);
    setAlunosQTD(response.data.qtd);
  };

  useEffect(() => {
    showStudent();
    showSchools();
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
        EscolasState,
        TurmasState,
        selectRow,
        showClasses,
        showSchools,
        showStudent,
        isLoading,
        setLoading,
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
