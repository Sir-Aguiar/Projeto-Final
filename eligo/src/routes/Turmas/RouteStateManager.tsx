import axios, { AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";
import { IEscola } from "../../@types/Escolas";
import { FindAllSchools } from "../../services/Escolas";
import { ITurma } from "../../@types/Turmas";
import { FindAllClasses, FindClassesBySchool } from "../../services/Turmas";
import { FindStudentsByClass } from "../../services/Alunos";
import { IAluno } from "../../@types/Alunos";

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
  RouteAPI: AxiosInstance;
  DrawerCreate: IModalProps;
  DrawerUpdate: IModalProps;
  ModalDelete: IModalProps;
  ModalFilter: IModalProps;
  Turmas: ITurma[];
  Escolas: IEscola[];
  Alunos: IAluno[];
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

  const [Escolas, setEscolas] = useState<IEscola[]>([]);

  const [Turmas, setTurmas] = useState<ITurma[]>([]);
  const [Alunos, setAlunos] = useState<IAluno[]>([]);
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
        setAlunos([]);
      }
      return newValues;
    });
  };

  const showSchools = async () => {
    try {
      const response = await FindAllSchools(RouteAPI);
      setEscolas(response);
    } catch (error: any) {
      const response = error.response;
      console.log(response);
      alert(response.data.error.message);
    }
  };

  const showClasses = async () => {
    try {
      const response = await FindAllClasses(RouteAPI);
      setTurmas(response);
    } catch (error: any) {
      const response = error.response;
      console.log(response);
      alert(response.data.error.message);
    }
  };

  const showClassStudents = async (idTurma: number) => {
    try {
      const response = await FindStudentsByClass(RouteAPI, idTurma);
      setAlunos(response);
    } catch (error: any) {
      const response = error.response;
      console.log(response);
      alert(response.data.error.message);
    }
    const response = await RouteAPI.get(`/aluno?idTurma=${idTurma}`);
    setAlunos(response.data.alunos);
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
    document.title = "Eligo | Turmas";
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
        Turmas,
        Escolas,
        selectedRows,
        ModalFilter,
        Alunos,
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
