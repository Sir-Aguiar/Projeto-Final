import axios, { AxiosError, AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";
import { IEscola, ToCreateSchool, ToUpdateSchool } from "../../@types/Escolas";
import { CreateSchool, DeleteSchools, FindAllSchools, UpdateSchool } from "../../services/Escolas";
import { ITurma } from "../../@types/Turmas";
import { ToastProps, useToast } from "../../components/Toast/Toast";

type ProviderProps = {
  children: React.ReactNode;
};

interface IModalProps {
  situation: boolean;
  open: () => void;
  close: () => void;
}
interface IUserTokenData {
  email: string;
  idUsuario: number;
  iat: number;
}
interface IRouteContext {
  RouteAPI: AxiosInstance;
  DrawerCreate: IModalProps;
  DrawerUpdate: IModalProps;
  ModalDelete: IModalProps;
  Escolas: IEscola[];
  Turmas: ITurma[];
  selectedRows: number[];
  selectRow: (idEscola: number) => void;
  TokenData: IUserTokenData;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  notify: (options: ToastProps) => void;
  handleDelete: () => Promise<void>;
  handleCreate: (RequestBody: ToCreateSchool) => Promise<void>;
  handleUpdate: (RequestBody: ToUpdateSchool) => Promise<void>;
}

const RouteContext = createContext<IRouteContext | null>(null);

const EscolasProvider: React.FC<ProviderProps> = ({ children }) => {
  const authHeader = useAuthHeader();

  const [isCreateOpen, setCreateDrawer] = useState(false);
  const [isUpdateOpen, setUpdateDrawer] = useState(false);
  const [isDeleteOpen, setDeleteModal] = useState(false);

  const [Turmas, setTurmas] = useState<ITurma[]>([]);
  const [Escolas, setEscolas] = useState<IEscola[]>([]);

  const [selectedRows, setRows] = useState<number[]>([]);
  const [isLoading, setLoading] = useState(false);

  const { notify } = useToast();

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

  const showClasses = async (idEscola: number) => {
    try {
      const response = await RouteAPI.get(`/turma?idEscola=${idEscola}`);
      setTurmas(response.data.turmas);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        // ERR_NETWORK -> mostre mais grave

        if (error.status! >= 400 && error.status! < 500) {
          notify({
            message: error.response!.data.error.message,
            title: "Erro ao consultar turmas",
            severity: "warn",
          });
          return;
        }
      }

      // Caso error 500 ->  mostre mais grave
    }
  };

  const showSchools = async () => {
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

  const selectRow = (idEscola: number) => {
    setRows((values) => {
      let newValues: number[];

      if (values.includes(idEscola)) {
        newValues = values.filter((value) => value !== idEscola);
      } else {
        newValues = [...values, idEscola];
      }
      if (newValues.length === 1) {
        showClasses(newValues[0]);
      } else {
        setTurmas([]);
      }
      return newValues;
    });
  };

  const DrawerCreate: IModalProps = useMemo(() => {
    return {
      situation: isCreateOpen,
      open: () => setCreateDrawer(true),
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

  const handleDelete = async () => {
    try {
      setLoading(true);
      await DeleteSchools(RouteAPI, selectedRows);

      setRows([]);

      await showSchools();

      ModalDelete.close();

      notify({ title: "Escolas excluídas com sucesso" });
    } catch (error: any) {
      // Caso error 500 ->  mostre mais grave
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (RequestBody: ToCreateSchool) => {
    try {
      await CreateSchool(RouteAPI, RequestBody);
      await showSchools();

      DrawerCreate.close();

      notify({ title: "Escola criada com sucesso" });
    } catch (error) {
      if (error instanceof AxiosError) {
        // ERR_NETWORK -> mostre mais grave

        if (error.status! >= 400 && error.status! < 500) {
          notify({
            message: error.response!.data.error.message,
            title: "Erro ao adicionar escola",
            severity: "warn",
          });
          return;
        }
      }

      // Caso error 500 ->  mostre mais grave
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (RequestBody: ToUpdateSchool) => {
    try {
      setLoading(true);

      await UpdateSchool(RouteAPI, selectedRows[0], RequestBody);
      await showSchools();

      DrawerUpdate.close();

      notify({ title: "Escola atualizada com sucesso" });
    } catch (error) {
      if (error instanceof AxiosError) {
        // ERR_NETWORK -> mostre mais grave

        if (error.status! >= 400 && error.status! < 500) {
          notify({
            message: error.response!.data.error.message,
            title: "Erro ao atualizar escola",
            severity: "warn",
          });
          return;
        }
      }

      // Caso error 500 ->  mostre mais grave
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showSchools();
    document.title = "Eligo | Escolas";
  }, []);

  return (
    <RouteContext.Provider
      value={{
        RouteAPI,
        DrawerUpdate,
        DrawerCreate,
        ModalDelete,
        Escolas,
        Turmas,
        TokenData,
        selectedRows,
        selectRow,
        isLoading,
        setLoading,
        notify,
        handleDelete,
        handleCreate,
        handleUpdate,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

const useEscolasContext = () => {
  const context = useContext(RouteContext);

  if (!context) throw new Error("EscolasContext deve ser chamado dentro de EscolasProvider");

  return context;
};

export { EscolasProvider, useEscolasContext };
