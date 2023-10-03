import axios, { AxiosError, AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { FindAllSchools } from "../../services/Escolas";
import jwtDecode from "jwt-decode";
import { FindClassesBySchool } from "../../services/Turmas";
import { IAluno } from "../../@types/Alunos";
import { IEscola } from "../../@types/Escolas";
import { ITurma } from "../../@types/Turmas";
import { FindStudentsByClass, FindStudentsBySchool } from "../../services/Alunos";
import { useToast } from "../../components/Toast/Toast";

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
  alunosCount: number;
}

const RouteContext = createContext<IRouteContext | null>(null);

const AlunosProvider: React.FC<ProviderProps> = ({ children }) => {
  const { notify } = useToast();

  const authHeader = useAuthHeader();

  const RouteAPI = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: authHeader(),
    },
  });

  const [isLoading, setLoading] = useState(false);

  const [isCreateOpen, setCreateDrawer] = useState(false);
  const [isUpdateOpen, setUpdateDrawer] = useState(false);
  const [isDeleteOpen, setDeleteModal] = useState(false);

  const [selectedRows, setRows] = useState<number[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [Alunos, setAlunos] = useState<IAluno[]>([]);
  const [alunosCount, setAlunosCount] = useState(0);
  const [Turmas, setTurmas] = useState<ITurma[]>([]);
  const [Escolas, setEscolas] = useState<IEscola[]>([]);

  const TokenData = useMemo(() => {
    const TOKEN = authHeader();
    const TOKEN_DATA = jwtDecode(TOKEN) as IUserTokenData;
    return TOKEN_DATA;
  }, [authHeader()]);

  const DrawerCreate: IModalProps = useMemo(() => {
    return {
      situation: isCreateOpen,
      open: () => showSchools().then(() => setCreateDrawer(true)),
      close: () => setCreateDrawer(false),
    };
  }, [isCreateOpen]);

  const DrawerUpdate: IModalProps = useMemo(() => {
    return {
      situation: isUpdateOpen,
      open: () => showClasses().then(() => setUpdateDrawer(true)),
      close: () => setUpdateDrawer(false),
    };
  }, [isUpdateOpen]);

  const ModalDelete: IModalProps = useMemo(() => {
    return {
      situation: isDeleteOpen,
      open: () => setDeleteModal(true),
      close: () => setDeleteModal(false),
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
      return newValues;
    });
  };

  const showSchools = async () => {
    try {
      const response = await FindAllSchools(RouteAPI);
      setEscolas(response);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        // ERR_NETWORK -> mostre mais grave
        if (error.response!.status >= 400 && error.response!.status < 500) {
          notify({
            title: "Erro consultar escolas",
            message: error.response!.data.error.message,
            severity: "warn",
          });
          return;
        }
      }
      // ERR_NETWORK -> mostre mais grave
    }
  };

  const showClasses = async (idEscola?: number) => {
    if (idEscola) {
      try {
        const response = await FindClassesBySchool(RouteAPI, Number(idEscola));
        setTurmas(response);
      } catch (error: any) {
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
    } else if (selectedSchool) {
      try {
        const response = await FindClassesBySchool(RouteAPI, Number(selectedSchool));
        setTurmas(response);
      } catch (error: any) {
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
    }
  };

  useEffect(() => {
    setRows([]);
    if (selectedSchool && !selectedClass) {
      setAlunos([]);
      showClasses(Number(selectedSchool));
      showStudent();
    }
  }, [selectedSchool, selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      showStudent();
    }
  }, [selectedClass]);

  const showStudent = async () => {
    setLoading(true);
    if (selectedClass) {
      try {
        const alunos = await FindStudentsByClass(RouteAPI, Number(selectedClass));
        setAlunos(alunos);
        setAlunosCount(alunos.length);
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
    } else if (selectedSchool) {
      try {
        const skip = Alunos.length;
        const { count, rows } = await FindStudentsBySchool(RouteAPI, Number(selectedSchool), undefined, skip);
        setAlunos((value) => [...value, ...rows]);
        setAlunosCount(count);
      } catch (error) {
        if (error instanceof AxiosError) {
          // ERR_NETWORK -> mostre mais grave
          if (error.response!.status >= 400 && error.response!.status < 500) {
            notify({
              title: "Erro consultar alunos da escola",
              message: error.response!.data.error.message,
              severity: "warn",
            });
            return;
          }
        }
        // ERR_NETWORK -> mostre mais grave
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    document.title = "Eligo | Alunos";
    showSchools();
  }, []);

  return (
    <RouteContext.Provider
      value={{
        Alunos,
        DrawerCreate,
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
        alunosCount,
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
