import axios, { AxiosError, AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";
import { useParams } from "react-router-dom";
import NotFound from "../Errors/NotFound";
import { IDisciplina, ToCreateDiscipline } from "../../@types/Disciplinas";
import { ICurso, ITurma } from "../../@types/Turmas";
import { IEscola } from "../../@types/Escolas";
import { FindClassesBySchool } from "../../services/Turmas";
import { FindSchoolById } from "../../services/Escolas";
import { CreateDiscipline, FindDisciplinesBySchool, FindDisciplinesCountBySchool } from "../../services/Disciplinas";
import { FindStudentsCountBySchool } from "../../services/Alunos";
import { CreateDisciplineGrid } from "../../services/CursoDisciplina";
import { HandleError } from "../../utils/defaultErrorHandler";
import { useToast } from "../../components/Toast/Toast";
interface IAula {
  idAula: number;
  anotacao: string | null;
  turma: {
    idTurma: number;
    nome: string;
  };
  disciplina: {
    idDisciplina: number;
    nome: string;
  };
  professor: {
    idUsuario: number;
    nome: string;
  };
  createdAt: string;
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

interface IModalProps {
  situation: boolean;
  open: () => void;
  close: () => void;
}
type ProviderProps = {
  children: React.ReactNode;
};

interface IRouteContext {
  SchoolData?: IEscola;
  ProfessorsData: IProfessor[];
  DisciplinesData: IDisciplina[];
  GridData: IGrid[];
  professorsCount: number;
  disciplinesCount: number;
  ProfessorModal: IModalProps;
  DisciplineModal: IModalProps;
  loadDisciplineData: (initial?: boolean) => Promise<void>;
  loadGridData: () => Promise<void>;
  loadProfessorData: (initial?: boolean) => Promise<void>;
  RouteAPI: AxiosInstance;
  DisciplineDrawer: IModalProps;
  ProfessorDrawer: IModalProps;
  Classes: ITurma[];
  ToDayClassRooms: IAula[];
  todayDate: Date;
  StudentLength: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  handleCreateDiscipline: (nome: string, cursos: number[]) => Promise<void>;
}

const RouteContext = createContext<IRouteContext | null>(null);

const EscolaProvider: React.FC<ProviderProps> = ({ children }) => {
  const { idEscola } = useParams();
  const { notify } = useToast();
  const authHeader = useAuthHeader();

  const RouteAPI = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: authHeader(),
    },
  });

  const [professorsCount, setProfessorsCount] = useState(0);
  const [ProfessorsData, setProfessorsData] = useState<IProfessor[]>([]);

  const [disciplinesCount, setDisciplinesCount] = useState(0);
  const [DisciplinesData, setDisciplinesData] = useState<IDisciplina[]>([]);

  const [isUserAuthorized, setUserAuthorized] = useState(true);
  const [SchoolData, setSchoolData] = useState<IEscola>();

  const [StudentLength, setStudentLength] = useState(0);

  const [GridData, setGridData] = useState<IGrid[]>([]);
  const [Classes, setClasses] = useState<ITurma[]>([]);

  const [ToDayClassRooms, setTodayClassRooms] = useState<IAula[]>([]);
  const [todayDate, setTodayDate] = useState<Date>(new Date());

  const [isLoading, setLoading] = useState(false);
  const [isProfessorModalOpen, setProfessorModalOpen] = useState(false);
  const [isDisciplineModalOpen, setDisciplineModalOpen] = useState(false);
  const [isDisciplineDrawerOpen, setDisciplineDrawerOpen] = useState(false);
  const [isProfessorDrawerOpen, setProfessorDrawerOpen] = useState(false);

  const ProfessorModal = useMemo(() => {
    return {
      situation: isProfessorModalOpen,
      close() {
        loadInitialData().then(() => setProfessorModalOpen(false));
      },
      open() {
        loadSchoolClasses().then(() =>
          loadDisciplineData(false).then(() => loadProfessorData(false).then(() => setProfessorModalOpen(true))),
        );
      },
    };
  }, [isProfessorModalOpen]);

  const DisciplineModal = useMemo(() => {
    return {
      situation: isDisciplineModalOpen,
      close() {
        loadInitialData().then(() => setDisciplineModalOpen(false));
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
      close: () => loadInitialData().then(() => setDisciplineDrawerOpen(false)),
      open: () => setDisciplineDrawerOpen(true),
    };
  }, [isDisciplineDrawerOpen]);

  const handleCreateDiscipline = async (nome: string, cursos: number[]) => {
    setLoading(true);

    try {
      const disciplina = await CreateDiscipline(RouteAPI, { idEscola: Number(idEscola), nome });
      await CreateDisciplineGrid(RouteAPI, Number(idEscola), disciplina.idDisciplina, cursos);
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar criar disciplina");
    } finally {
      setLoading(false);
    }
  };

  const loadSchoolClasses = async () => {
    try {
      const response = await FindClassesBySchool(RouteAPI, Number(idEscola));
      setClasses(response);
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar turmas da escola");
    }
  };

  const loadSchoolData = async () => {
    try {
      const response = await FindSchoolById(RouteAPI, Number(idEscola));
      setSchoolData(response);
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar dados da escola");
    }
  };

  const loadProfessorData = async (initial = true) => {
    if (initial) {
      try {
        const response = await RouteAPI.get(`/professor?idEscola=${idEscola}&onlyLength=true`);
        setProfessorsCount(response.data.length);
        return;
      } catch (error: any) {
        HandleError(error, notify, "Erro ao consultar dados iniciais");
      }
    }
    try {
      const response = await RouteAPI.get(`/professor?idEscola=${idEscola}`);
      setProfessorsData(response.data.professores);
      return;
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar professores");
    }
  };

  const loadDisciplineData = async (initial = true) => {
    if (initial) {
      try {
        const response = await FindDisciplinesCountBySchool(RouteAPI, Number(idEscola));
        setDisciplinesCount(response);
        return;
      } catch (error: any) {
        HandleError(error, notify, "Erro ao consultar dados iniciais");
      }
    }
    try {
      const response = await FindDisciplinesBySchool(RouteAPI, Number(idEscola));
      setDisciplinesData(response);
      return;
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar disciplinas");
    }
  };

  const loadTodayClassRooms = async () => {
    try {
      const response = await RouteAPI.get(
        `/aula?idEscola=${idEscola}&createdAt=${todayDate.toLocaleString("en-US", { dateStyle: "short" })}`,
      );
      setTodayClassRooms(response.data.aulas);
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar aulas do dia");
    }
  };

  const loadStudentsLength = async () => {
    try {
      const response = await FindStudentsCountBySchool(RouteAPI, Number(idEscola));
      setStudentLength(response);
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar alunos");
    }
  };

  const loadInitialData = async () => {
    await loadSchoolData();
    await loadStudentsLength();
    await loadProfessorData();
    await loadDisciplineData();
    await loadTodayClassRooms();
  };

  const loadGridData = async () => {
    try {
      const response = await RouteAPI.get(`/grade?idEscola=${idEscola}`);
      console.log(response);
      setGridData(response.data.grade);
    } catch (error: any) {
      HandleError(error, notify, "Erro ao consultar grades");
    }
  };

  useEffect(() => {
    loadInitialData();
    setTodayDate(new Date());
  }, []);

  useEffect(() => {
    document.title = `Eligo  ${`| ${SchoolData?.nome || ""}`}`;
  }, [SchoolData]);

  return (
    <RouteContext.Provider
      value={{
        disciplinesCount,
        DisciplinesData,
        handleCreateDiscipline,
        ProfessorDrawer,
        StudentLength,
        DisciplineDrawer,
        loadDisciplineData,
        loadProfessorData,
        professorsCount,
        todayDate,
        ProfessorsData,
        SchoolData,
        ProfessorModal,
        DisciplineModal,
        loadGridData,
        Classes,
        ToDayClassRooms,
        GridData,
        RouteAPI,
        isLoading,
        setLoading,
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
