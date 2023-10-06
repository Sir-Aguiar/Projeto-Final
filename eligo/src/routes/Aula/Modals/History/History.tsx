import { Fade, Modal, Radio } from "@mui/material";
import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styles from "./History.module.css";
import { useAulaContext } from "../../RouteStateManager";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import DeleteIcon from "@mui/icons-material/Delete";

interface IAula {
  idAula: number;
  professor: { nome: string };
  disciplina: { nome: string; idDisciplina: number };
  turma: { nome: string; idTurma: number };
  createdAt: string;
}

interface ISingleClassRoom {
  idAula: number;
  anotacao: string;
  createdAt: string;
  professor: { nome: string; idUsuario: number };
  disciplina: { nome: string; idDisciplina: number };
  turma: { nome: string; idTurma: number };
  chamada: {
    idChamada: number;
  };
  alunos: {
    idAluno: number;
    situacao: boolean;
    aluno: { nome: string };
  }[];
}

const ClassRoomFilter: React.FC = () => {
  const {
    Escolas,
    Disciplinas,
    Turmas,
    selectedClass,
    selectedDiscipline,
    selectedSchool,
    setSelectedClass,
    setSelectedDiscipline,
    setSelectedSchool,
  } = useAulaContext();
  return (
    <div className="h-[50px] mobile:h-full w-full flex mobile:flex-col items-center gap-2">
      <FormControl fullWidth>
        <InputLabel>Escola</InputLabel>
        <Select label="Escola" value={selectedSchool} onChange={(e: any) => setSelectedSchool(e.target.value)}>
          {Escolas.map((escola, index) => (
            <MenuItem key={index} value={escola.idEscola}>
              {escola.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth disabled={Turmas.length < 1}>
        <InputLabel>Turma</InputLabel>
        <Select label="Turma" value={selectedClass} onChange={(e: any) => setSelectedClass(e.target.value)}>
          {Turmas.map((turma, index) => (
            <MenuItem key={index} value={turma.idTurma}>
              {turma.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth disabled={Disciplinas.length < 1}>
        <InputLabel>Disciplina</InputLabel>
        <Select
          label="Disciplina"
          value={selectedDiscipline}
          onChange={(e: any) => setSelectedDiscipline(e.target.value)}
        >
          {Disciplinas.map((disciplina, index) => (
            <MenuItem key={index} value={disciplina.idDisciplina}>
              {disciplina.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

const ClassRoomInfo: React.FC<{ ClassRoomData?: ISingleClassRoom }> = ({ ClassRoomData }) => {
  const presentsStudents = ClassRoomData?.alunos.filter((aluno) => aluno.situacao);
  return (
    <div className={`${styles.class_info} transition-all duration-500 ${ClassRoomData ? "max-h-full " : "max-h-0"}`}>
      <div className={styles.info_section}>
        <h2>Professor:</h2>
        <p>{ClassRoomData?.professor.nome}</p>
      </div>
      <div className={styles.info_section}>
        <h2>Turma:</h2>
        <p>{ClassRoomData?.turma.nome}</p>
      </div>
      <div className={styles.info_section}>
        <h2>Disciplina:</h2>
        <p>{ClassRoomData?.disciplina.nome}</p>
      </div>
      <div className={styles.info_section}>
        <h2>Alunos Presentes:</h2>
        <ul className={styles.presents}>
          {presentsStudents && presentsStudents.length < 1 ? (
            <li>Nenhum aluno presente</li>
          ) : (
            presentsStudents?.map((aluno, index) => (
              <li key={index} className={styles.student}>
                {aluno.aluno.nome}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const History: React.FC = () => {
  const { HistoryModal, selectedClass, selectedDiscipline, selectedSchool, RouteAPI } = useAulaContext();

  const [Aulas, setAulas] = useState<IAula[]>([]);
  const [ClassRoomData, setClassRoomData] = useState<ISingleClassRoom>();
  const [selectedClassroom, setSelectClassroom] = useState("");

  useEffect(() => {
    if (selectedClassroom) {
      try {
        RouteAPI.get(`/aula?idAula=${selectedClassroom}`).then((response) => {
          console.log(response.data.aula);
          setClassRoomData({ ...response.data.aula, alunos: response.data.chamada });
        });
      } catch (error: any) {
        console.log(error);
      }
    }
  }, [selectedClassroom]);

  useEffect(() => {
    if (selectedSchool) {
      try {
        RouteAPI.get(`/aula?idEscola=${selectedSchool}`).then((response) => {
          console.log(response.data);
          setAulas(response.data.aulas);
        });
      } catch (error: any) {
        console.log(error);
      }
    }
  }, [selectedSchool]);

  const onClose = () => {
    HistoryModal.close();
    setSelectClassroom("");
    setClassRoomData(undefined);
    setAulas([]);
  };

  const filterClasses = () => {
    let filtredData = Aulas;
    if (selectedClass) {
      filtredData = filtredData.filter((aula) => aula.turma.idTurma === Number(selectedClass));
    }
    if (selectedDiscipline) {
      filtredData = filtredData.filter((aula) => aula.disciplina.idDisciplina === Number(selectedDiscipline));
    }
    return filtredData;
  };

  return (
    <Modal className="overflow-y-scroll" open={HistoryModal.situation} onClose={onClose} closeAfterTransition>
      <Fade in={HistoryModal.situation}>
        <div className={styles.modal_content}>
          <header className={styles.header}></header>
          <main className={styles.main}>
            <div className={styles.register_content}>
              <ClassRoomFilter />
              <div className={styles.table_container}>
                <table className={styles.content_table}>
                  <thead className={styles.table_header}>
                    <tr>
                      <th></th>
                      <th className="min-w-[200px]">Professor</th>
                      <th className="min-w-[150px]">Disciplina</th>
                      <th className="min-w-[100px]">Turma</th>
                      <th className="min-w-[200px]">Data</th>
                    </tr>
                  </thead>
                  <tbody className={styles.table_body}>
                    {selectedSchool ? (
                      filterClasses().length < 1 ? (
                        <tr>
                          <td colSpan={5} className="text-center whitespace-nowrap">
                            Nenhuma aula registrada
                          </td>
                        </tr>
                      ) : (
                        filterClasses().map((aula, index) => (
                          <tr key={index}>
                            <td>
                              <Radio
                                checked={Number(selectedClassroom) === aula.idAula}
                                onChange={() => setSelectClassroom(String(aula.idAula))}
                              />
                            </td>
                            <td>{aula.professor.nome}</td>
                            <td>{aula.disciplina.nome}</td>
                            <td>{aula.turma.nome}</td>
                            <td>{new Date(aula.createdAt).toLocaleDateString("pt-BR", { dateStyle: "short" })}</td>
                          </tr>
                        ))
                      )
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          Selecione uma escola
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* <div className={styles.actions}>
                <button className={styles.downloader} disabled={!ClassRoomData}>
                  Baixar PDF <DownloadForOfflineIcon fontSize="small" />
                </button>
              </div> */}
            </div>
            <ClassRoomInfo ClassRoomData={ClassRoomData} />
          </main>
        </div>
      </Fade>
    </Modal>
  );
};

export default History;
