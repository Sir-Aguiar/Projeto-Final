import axios, { AxiosError, AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";
import { IEscola } from "../../@types/Escolas";
import { FindAllSchools } from "../../services/Escolas";
import { ITurma, ToCreateClass, ToUpdateClass } from "../../@types/Turmas";
import { FindStudentsByClass } from "../../services/Alunos";
import { IAluno } from "../../@types/Alunos";
import { ITableController } from "../../components/TableController/TableController";
import { CreateClasses, DeleteClasses, FindAllClasses, UpdateClass } from "../../services/Turmas";
import { useToast } from "../../components/Toast/Toast";

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
  applyFilters: () => ITurma[];
  CreateButton: ITableController;
  UpdateButton: ITableController;
  RemoveButton: ITableController;
  FilterButton: ITableController;
  handleCreate: (idEscola: number, RequestBody: ToCreateClass[]) => Promise<void>;
  handleUpdate: (RequestBody: ToUpdateClass) => Promise<void>;
  handleDelete: () => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const RouteContext = createContext<IRouteContext | null>(null);

const TurmasProvider: React.FC<ProviderProps> = ({ children }) => {
  const { notify } = useToast();

  const authHeader = useAuthHeader();

  // Axios instance
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
  const [isFilterOpen, setFilterModal] = useState(false);
  const [Escolas, setEscolas] = useState<IEscola[]>([]);

  const [Turmas, setTurmas] = useState<ITurma[]>([]);
  const [Alunos, setAlunos] = useState<IAluno[]>([]);

  const [selectedRows, setRows] = useState<number[]>([]);
  const [classNameFilter, setClassNameFilter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  const TokenData = useMemo(() => {
    const TOKEN = authHeader();
    const TOKEN_DATA = jwtDecode(TOKEN) as IUserTokenData;
    return TOKEN_DATA;
  }, [authHeader()]);

  const CreateButton = {
    disabled: false,
    onClick: () => DrawerCreate.open(),
    title: "Cadastrar Turma",
  };

  const UpdateButton = {
    disabled:
      selectedRows.length !== 1 ||
      Turmas.find((turma) => turma.idTurma === selectedRows[0])?.escola.idGestor !== TokenData.idUsuario,
    onClick: () => DrawerUpdate.open(),
    title: "Atualizar Turma",
  };

  const RemoveButton = {
    disabled:
      selectedRows.length < 1 ||
      selectedRows.filter((idTurma) => {
        const turmaSelecionada = Turmas.find((turma) => turma.idTurma === idTurma);
        return turmaSelecionada?.escola.idGestor !== TokenData.idUsuario;
      }).length > 0,
    onClick: () => ModalDelete.open(),
    title: "Exclui Turma",
  };

  const FilterButton = {
    disabled: false,
    onClick: () => ModalFilter.open(),
    title: "Filtrar Turma",
  };

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
      close: () => setCreateDrawer(false),
    };
  }, [isCreateOpen]);

  const DrawerUpdate: IModalProps = useMemo(() => {
    return {
      situation: isUpdateOpen,
      open: () => setUpdateDrawer(true),
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

  const ModalFilter: IModalProps = useMemo(() => {
    return {
      situation: isFilterOpen,
      open: () => {
        showSchools().then(() => setFilterModal(true));
      },
      close: () => setFilterModal(false),
    };
  }, [isFilterOpen]);

  const handleCreate = async (idEscola: number, RequestBody: ToCreateClass[]) => {
    try {
      await CreateClasses(RouteAPI, idEscola, RequestBody);
      await showClasses();
      setRows([]);
      notify({ title: "Turmas criadas com sucesso" });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        // ERR_NETWORK -> mostre mais grave
        if (error.response!.status >= 400 && error.response!.status < 500) {
          notify({
            message: error.response!.data.error.message,
            title: "Erro ao criar turmas",
            severity: "warn",
          });
          return;
        }
      }

      // Caso error 500 ->  mostre mais grave
    } finally {
      setLoading(false);
      DrawerCreate.close();
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await DeleteClasses(RouteAPI, selectedRows);
      setRows([]);
      await showClasses();
      notify({ title: "Turmas excluídas com sucesso" });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        // ERR_NETWORK -> mostre mais grave
        if (error.response!.status >= 400 && error.response!.status < 500) {
          notify({
            title: "Erro ao excluir turma",
            message: error.response!.data.error.message,
            severity: "warn",
          });
          return;
        }
      }

      // Caso error 500 ->  mostre mais grave
    } finally {
      setLoading(false);
      ModalDelete.close();
    }
  };

  const handleUpdate = async (RequestBody: ToUpdateClass) => {
    try {
      setLoading(true);
      await UpdateClass(RouteAPI, selectedRows[0], RequestBody);
      setRows([]);
      await showClasses();
      notify({ title: "Turma atualizada com sucesso" });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        // ERR_NETWORK -> mostre mais grave
        if (error.response!.status >= 400 && error.response!.status < 500) {
          notify({
            title: "Erro ao atualizar turma",
            message: error.response!.data.error.message,
            severity: "warn",
          });
          return;
        }
      }

      // Caso error 500 ->  mostre mais grave
    } finally {
      setLoading(false);
      DrawerUpdate.close();
    }
  };

  useEffect(() => {
    showClasses();
    document.title = "Eligo | Turmas";
  }, []);

  const applyFilters = () => {
    let filtredData = Turmas;

    if (selectedCourse) {
      filtredData = filtredData.filter((turma) => turma.curso.idCurso === Number(selectedCourse));
    }
    if (selectedSchool) {
      filtredData = filtredData.filter((turma) => turma.escola.idEscola === Number(selectedSchool));
    }
    if (classNameFilter) {
      filtredData = filtredData.filter((turma) => turma.nome.indexOf(classNameFilter) !== -1);
    }

    return filtredData;
  };

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
        isLoading,
        setLoading,
        selectedRows,
        ModalFilter,
        Alunos,
        applyFilters,
        CreateButton,
        FilterButton,
        RemoveButton,
        UpdateButton,
        handleCreate,
        handleDelete,
        handleUpdate,
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
