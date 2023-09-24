import axios, { AxiosError, AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";
import { useParams } from "react-router-dom";
import NotFound from "../Errors/NotFound";
import { SnackbarProps } from "@mui/material";

interface IEscola {
  idGestor: number;
  idEscola: number;
  nome: string;
}

interface ITurma {
  idTurma: number;
  idEscola: number;
  idCurso: number;
  nome: string;
}
interface IAluno {
  idAluno: number;
  nome: string;
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
  setSelectedSchool: React.Dispatch<React.SetStateAction<string>>;
  selectedSchool: string;
  Turmas: ITurma[];
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
  selectedClass: string;
  Disciplinas: IDisciplina[];
  setSelectedDiscipline: React.Dispatch<React.SetStateAction<string>>;
  selectedDiscipline: string;
  started: boolean;
  startClass: () => void;
  toggleStudentPresence: (idAluno: number) => void;
  studentPresence: number[];
  endClass: () => void;
  setClassObservations: React.Dispatch<React.SetStateAction<string>>;
  classObservations: string;
  classStartTime?: Date;
  HistoryModal: IModalProps;
  RouteAPI: AxiosInstance;
  setSnackBarState: React.Dispatch<React.SetStateAction<boolean>>;
  SnackBarState: boolean;
}

const RouteContext = createContext<IRouteContext | null>(null);

const AulaProvider: React.FC<ProviderProps> = ({ children }) => {
  const authHeader = useAuthHeader();
  const [Escolas, setEscolas] = useState<IEscola[]>([]);
  const [Alunos, setAlunos] = useState<IAluno[]>([]);
  const [Turmas, setTurmas] = useState<ITurma[]>([]);
  const [Disciplinas, setDisciplinas] = useState<IDisciplina[]>([]);
  const [isHistoryModalOpen, setHistoryModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [started, setStarted] = useState(false);
  const [studentPresence, setStudentPresence] = useState<number[]>([]);
  const [classObservations, setClassObservations] = useState("");
  const [classStartTime, setClassStartTime] = useState<Date>();
  const [SnackBarState, setSnackBarState] = useState(false);

  const TokenData = useMemo(() => {
    const TOKEN = authHeader();
    const TOKEN_DATA = jwtDecode(TOKEN) as IUserTokenData;
    return TOKEN_DATA;
  }, [authHeader()]);

  const toggleStudentPresence = (idAluno: number) => {
    console.log(idAluno);
    setStudentPresence((values) => {
      console.log(values);
      let newValues: number[];

      if (values.includes(idAluno)) {
        newValues = values.filter((value) => value !== idAluno);
      } else {
        newValues = [...values, idAluno];
      }

      return newValues;
    });
  };

  const startClass = () => {
    setStarted(true);
    setClassStartTime(new Date());
  };

  const endClass = async () => {
    try {
      await RouteAPI.post(`/aula`, {
        idDisciplina: selectedDiscipline,
        idTurma: selectedClass,
        idProfessor: TokenData.idUsuario,
        observacoes: classObservations,
        presentes: studentPresence,
      });
      setStarted(false);
      setClassObservations("");
      setAlunos([]);
      setStudentPresence([]);
      setSelectedDiscipline("");
      setSelectedClass("");
      setSelectedSchool("");
    } catch (error: any) {
      console.log(error);
    }
  };

  const HistoryModal = useMemo(() => {
    return {
      situation: isHistoryModalOpen,
      close() {
        setSelectedDiscipline("");
        setSelectedClass("");
        setSelectedSchool("");
        setHistoryModal(false);
      },
      open() {
        setHistoryModal(true);
      },
    };
  }, [isHistoryModalOpen]);

  const RouteAPI = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: authHeader(),
    },
  });

  const loadSchools = async () => {
    try {
      const response = await RouteAPI.get("/escola");
      setEscolas(response.data.escolas);
    } catch (error: any) {
      console.log(error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await RouteAPI.get(`/aluno?idTurma=${selectedClass}`);
      console.log(response.data.alunos);
      setAlunos(response.data.alunos);
    } catch (error: any) {
      console.log(error);
    }
  };

  // Carrega dados de turmas da escola
  useEffect(() => {
    setSelectedClass("");
    setSelectedDiscipline("");
    if (selectedSchool) {
      RouteAPI.get(`/turma?idEscola=${selectedSchool}`)
        .then((response) => {
          console.log(response.data);
          setTurmas(response.data.turmas);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedClass) {
      setSelectedDiscipline("");
      RouteAPI.get(`/disciplina?idTurma=${selectedClass}`).then((response) => {
        console.log();
        setDisciplinas(response.data.disciplinas);
        loadStudents();
      });
    }
  }, [selectedClass]);

  useEffect(() => {
    loadSchools();
    document.title = "Eligo | Aula";
  }, []);

  return (
    <RouteContext.Provider
      value={{
        Escolas,
        selectedSchool,
        endClass,
        RouteAPI,
        setSelectedSchool,
        selectedClass,
        setSelectedClass,
        classObservations,
        setClassObservations,
        Turmas,
        Disciplinas,
        selectedDiscipline,
        studentPresence,
        setSnackBarState,
        SnackBarState,
        Alunos,
        HistoryModal,
        started,
        startClass,
        setSelectedDiscipline,
        toggleStudentPresence,
        classStartTime,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

const useAulaContext = () => {
  const context = useContext(RouteContext);

  if (!context) throw new Error("EscolasContext deve ser chamado dentro de AulaProvider");

  return context;
};

export { AulaProvider, useAulaContext };
