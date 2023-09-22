import axios, { AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";

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

interface ITurma {
  idTurma: number;
  escola: {
    idGestor: number;
    idEscola: number;
    nome: string;
  };
  curso: {
    idCurso: number;
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
  ModalFilter: IModalProps;
  TurmasState: ITurma[];
  EscolasState: IEscola[];
  AlunosTurmaState: IAluno[];
  selectedRows: number[];
  selectRow: (idTurma: number) => void;
  TokenData: IUserTokenData;
  setSelectedCourse: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSchool: React.Dispatch<React.SetStateAction<string>>;
  setClassNameFilter: React.Dispatch<React.SetStateAction<string>>;
  selectedCourse: string;
  selectedSchool: string;
  classNameFilter: string;
  setSnackBarState: React.Dispatch<React.SetStateAction<boolean>>;
  SnackBarState: boolean;
  setSnackBarMessage: React.Dispatch<React.SetStateAction<string>>;
  SnackBarMessage: string;
}

const RouteContext = createContext<IRouteContext | null>(null);

const TurmasProvider: React.FC<ProviderProps> = ({ children }) => {
  const authHeader = useAuthHeader();
  const [isCreateOpen, setCreateDrawer] = useState(false);
  const [isUpdateOpen, setUpdateDrawer] = useState(false);
  const [isDeleteOpen, setDeleteModal] = useState(false);
  const [isFilterOpen, setFilterModal] = useState(false);
  const [TurmasState, setTurmas] = useState<ITurma[]>([]);
  const [AlunosTurmaState, setAlunoTurma] = useState<IAluno[]>([]);
  const [EscolasState, setEscolas] = useState<IEscola[]>([]);
  const [selectedRows, setRows] = useState<number[]>([]);
  const [classNameFilter, setClassNameFilter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [SnackBarState, setSnackBarState] = useState(false);
  const [SnackBarMessage, setSnackBarMessage] = useState("");
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
    console.log(response.data.turmas);
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

  const ModalFilter: IModalProps = useMemo(() => {
    return {
      situation: isFilterOpen,
      open: () => {
        showSchools().then(() => setFilterModal(true));
      },
      close: () => {
        showClasses().then(() => {
          setFilterModal(false);
          setRows([]);
        });
      },
    };
  }, [isFilterOpen]);

  useEffect(() => {
    showClasses();
    console.log(TokenData);
  }, []);

  return (
    <RouteContext.Provider
      value={{
        setSelectedSchool,
        setSelectedCourse,
        setClassNameFilter,
        selectRow,
        RouteAPI,
        selectedCourse,
        selectedSchool,
        DrawerUpdate,
        TokenData,
        classNameFilter,
        DrawerCreate,
        ModalDelete,
        TurmasState,
        EscolasState,
        selectedRows,
        ModalFilter,
        AlunosTurmaState,
        setSnackBarState,
        SnackBarState,
        setSnackBarMessage,
        SnackBarMessage,
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
