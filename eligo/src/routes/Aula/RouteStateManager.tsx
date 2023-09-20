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
  setAulaSelecionada: React.Dispatch<React.SetStateAction<number | undefined>>;
  aulaSelecionada?: number;
  RouteAPI: AxiosInstance;
}

const RouteContext = createContext<IRouteContext | null>(null);

const AulaProvider: React.FC<ProviderProps> = ({ children }) => {
  const authHeader = useAuthHeader();
  const [Escolas, setEscolas] = useState<IEscola[]>([]);
  const [Alunos, setAlunos] = useState<IAluno[]>([]);
  const [SchoolData, setSchoolData] = useState<any[]>();
  const [isHistoryModalOpen, setHistoryModal] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState<number>();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [started, setStarted] = useState(false);
  const [studentPresence, setStudentPresence] = useState<number[]>([]);
  const [classObservations, setClassObservations] = useState("");
  const [classStartTime, setClassStartTime] = useState<Date>();

  const TokenData = useMemo(() => {
    const TOKEN = authHeader();
    const TOKEN_DATA = jwtDecode(TOKEN) as IUserTokenData;
    return TOKEN_DATA;
  }, [authHeader()]);

  const toggleStudentPresence = (idAluno: number) => {
    setStudentPresence((values) => {
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
    } catch (error: any) {
      console.log(error);
    }
  };

  const HistoryModal = useMemo(() => {
    return {
      situation: isHistoryModalOpen,
      close() {
        setSelectedDiscipline("")
        setSelectedClass("")
        setSelectedSchool("")
        setHistoryModal(false);
      },
      open() {
        setHistoryModal(true);
      },
    };
  }, [isHistoryModalOpen]);

  const Turmas: ITurma[] = useMemo(() => {
    if (!SchoolData || !selectedSchool) return [];
    const uniqueClasses: any[] = [];
    const filterObject = new Map();

    for (const professor of SchoolData) {
      const { idTurma, nome } = professor.turma;
      if (!filterObject.has(idTurma)) {
        filterObject.set(idTurma, { idTurma, nome });
      }
    }

    filterObject.forEach((value) => {
      uniqueClasses.push(value);
    });

    return uniqueClasses;
  }, [SchoolData]);

  const Disciplinas: IDisciplina[] = useMemo(() => {
    if (!selectedClass || !SchoolData) return [];

    const disciplinas = [];
    const disciplinasMap = new Map();
    for (const disciplina of SchoolData.filter((data) => data.turma.idTurma == selectedClass).map(
      (dado) => dado.disciplina,
    )) {
      if (!disciplinasMap.has(disciplina.idDisciplina)) {
        disciplinasMap.set(disciplina.idDisciplina, disciplina);
        disciplinas.push(disciplina);
      }
    }
    return disciplinas;
  }, [selectedClass]);

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
      setAlunos(response.data.alunos);
    } catch (error: any) {
      console.log(error);
    }
  };

  // Carrega dados de escola única
  useEffect(() => {
    setSelectedClass("");
    setSelectedDiscipline("");
    if (selectedSchool) {
      RouteAPI.get(`/professor?idEscola=${selectedSchool}`)
        .then((response) => {
          console.log(response.data.professores);
          setSchoolData(response.data.professores);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedClass) {
      setSelectedDiscipline("");
      loadStudents();
    }
  }, [selectedClass]);

  useEffect(() => {
    loadSchools();
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
        Alunos,
        HistoryModal,
        started,
        setAulaSelecionada,
        aulaSelecionada,
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
