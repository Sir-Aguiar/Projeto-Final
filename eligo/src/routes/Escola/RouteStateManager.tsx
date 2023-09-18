import axios, { AxiosError, AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";
import { useParams } from "react-router-dom";
import NotFound from "../Errors/NotFound";

interface IEscola {
  idGestor: number;
  idEscola: number;
  nome: string;
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

interface IProfessorState {
  length: number;
  data: IProfessor[] | null;
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
  RouteAPI: AxiosInstance;
  DisciplineDrawer: IModalProps;
  ProfessorDrawer: IModalProps;
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

  const [isProfessorModalOpen, setProfessorModalOpen] = useState(false);
  const [isDisciplineModalOpen, setDisciplineModalOpen] = useState(false);
  const [isDisciplineDrawerOpen, setDisciplineDrawerOpen] = useState(false);
  const [isProfessorDrawerOpen, setProfessorDrawerOpen] = useState(false);
  const ProfessorModal = useMemo(() => {
    return {
      situation: isProfessorModalOpen,
      close() {
        setProfessorModalOpen(false);
      },
      open() {
        loadProfessorData(false).then(() => setProfessorModalOpen(true));
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

  const loadInitialData = async () => {
    await loadSchoolData();
    await loadProfessorData();
    await loadDisciplineData();
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
  }, []);

  return (
    <RouteContext.Provider
      value={{
        disciplinesCount,
        DisciplinesData,
        ProfessorDrawer,
        DisciplineDrawer,
        loadDisciplineData,
        professorsCount,
        ProfessorsData,
        SchoolData,
        ProfessorModal,
        DisciplineModal,
        loadGridData,
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
