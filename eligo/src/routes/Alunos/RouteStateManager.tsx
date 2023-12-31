import axios, { AxiosError, AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { FindAllSchools } from "../../services/Escolas";
import jwtDecode from "jwt-decode";
import { FindClassesBySchool } from "../../services/Turmas";
import { IAluno, ToCreateStudent } from "../../@types/Alunos";
import { IEscola } from "../../@types/Escolas";
import { ITurma } from "../../@types/Turmas";
import {
  CreateStudent,
  DeleteStudent,
  FindStudentsByClass,
  FindStudentsBySchool,
  UpdateStudent,
} from "../../services/Alunos";
import { useToast } from "../../components/Toast/Toast";
import { HandleError } from "../../utils/defaultErrorHandler";

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
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  selectedSchool: string;
  selectedClass: string;
  setSelectedSchool: React.Dispatch<React.SetStateAction<string>>;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
  TokenData: IUserTokenData;
  alunosCount: number;
  handleCreate: (RequestBody: ToCreateStudent) => Promise<void>;
  handleDelete: () => Promise<void>;
  showStudentsFromClass: () => Promise<void>;
  showStudentsFromSchool: (clean?: boolean) => Promise<void>;
  handleUpdate: (nome: string) => Promise<void>;
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
      HandleError(error, notify, "Erro ao consultar escolas");
    }
  };

  const showClasses = async (idEscola?: number) => {
    if (idEscola) {
      try {
        const response = await FindClassesBySchool(RouteAPI, Number(idEscola));
        setTurmas(response);
      } catch (error: any) {
        HandleError(error, notify, "Erro ao consultar turmas");
      }
    } else if (selectedSchool) {
      try {
        const response = await FindClassesBySchool(RouteAPI, Number(selectedSchool));
        setTurmas(response);
      } catch (error: any) {
        HandleError(error, notify, "Erro ao consultar turmas");
      }
    }
  };

  const handleCreate = async (RequestBody: ToCreateStudent) => {
    setLoading(true);

    try {
      const response = await CreateStudent(RouteAPI, [RequestBody]);
      setRows([]);
      clearFilters();
      notify({
        title: "Aluno criado com sucesso",
      });
    } catch (error: any) {
      HandleError(error, notify, "Erro ao criar aluno");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedSchool("");
    setSelectedClass("");
    setTurmas([]);
  };

  const showStudentsFromSchool = async (clean = false) => {
    const skip = clean ? 0 : Alunos.length;

    try {
      const { count, rows } = await FindStudentsBySchool(RouteAPI, Number(selectedSchool), undefined, skip);

      setAlunosCount(count);

      if (skip !== 0) {
        setAlunos((value) => {
          return [...value, ...rows];
        });

        return;
      }

      setAlunos(rows);
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar alunos");
    } finally {
      setLoading(false);
    }
  };

  const showStudentsFromClass = async () => {
    try {
      const alunos = await FindStudentsByClass(RouteAPI, Number(selectedClass));
      console.log(alunos);
      setAlunos(alunos);
      setAlunosCount(alunos.length);
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar alunos");
    }
  };

  const handleUpdate = async (nome: string) => {
    try {
      setLoading(true);
      await UpdateStudent(RouteAPI, selectedRows[0], { nome });

      setRows([]);
      clearFilters();
      notify({
        title: "Aluno atualizado com sucesso",
      });
    } catch (error: any) {
      HandleError(error, notify, "Erro ao atualizar aluno");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      for (const idAluno of selectedRows) {
        await DeleteStudent(RouteAPI, idAluno);
      }

      setRows([]);

      clearFilters();

      ModalDelete.close();
      notify({
        title: "Aluno deletado com sucesso",
      });
    } catch (error: any) {
      HandleError(error, notify, "Erro ao excluir aluno");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRows([]);

    if (selectedSchool && selectedClass) {
      setSelectedClass("");
    }

    if (selectedSchool) {
      showClasses(Number(selectedSchool)).then(() => {
        showStudentsFromSchool(true);
      });
    }
  }, [selectedSchool]);

  useEffect(() => {
    setRows([]);

    if (!selectedClass && selectedSchool) {
      showStudentsFromSchool(true);
      return;
    }

    if (selectedClass) {
      showStudentsFromClass();
      return;
    }
  }, [selectedClass]);

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
        isLoading,
        setLoading,
        selectedClass,
        selectedSchool,
        setSelectedClass,
        setSelectedSchool,
        alunosCount,
        handleCreate,
        handleDelete,
        showStudentsFromSchool,
        showStudentsFromClass,
        handleUpdate,
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
