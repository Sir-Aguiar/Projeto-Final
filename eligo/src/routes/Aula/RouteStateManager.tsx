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
}

const RouteContext = createContext<IRouteContext | null>(null);

const AulaProvider: React.FC<ProviderProps> = ({ children }) => {
  const authHeader = useAuthHeader();
  const [Escolas, setEscolas] = useState<IEscola[]>([]);
  const [Alunos, setAlunos] = useState<IAluno[]>([]);
  const [SchoolData, setSchoolData] = useState<any[]>();

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");

  const Turmas: ITurma[] = useMemo(() => {
    if (!SchoolData || !selectedSchool) return [];
    console.log(`Todas as turmas de ${selectedSchool} já foram carregadas`);
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
          setSchoolData(response.data.professores);
          console.log(`Carregado os dados da escola ${selectedSchool}`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedSchool]);

  useEffect(() => {
    loadStudents();
  }, [selectedClass]);

  useEffect(() => {
    loadSchools();
  }, []);

  return (
    <RouteContext.Provider
      value={{
        Escolas,
        selectedSchool,
        setSelectedSchool,
        selectedClass,
        setSelectedClass,
        Turmas,
        Disciplinas,
        selectedDiscipline,
        Alunos,
        setSelectedDiscipline,
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
