import React, { useEffect, useState } from "react";
import styles from "./Update.module.css";
import { Divider, Drawer, TextField } from "@mui/material";
import { useTurmasContext } from "../RouteStateManager";
import { AxiosError } from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const Update: React.FC = () => {
  const { selectedRows, DrawerUpdate, TurmasState, RouteAPI } = useTurmasContext();

  const [TurmaIdCurso, setTurmaIdCurso] = useState("");
  const [TurmaNome, setTurmaNome] = useState("");

  useEffect(() => {
    if (DrawerUpdate.situation) {
      if (selectedRows.length !== 1) {
        DrawerUpdate.close();
        return;
      }
      const RespectiveClass = TurmasState.find((turma) => turma.idTurma === selectedRows[0])!;
      setTurmaIdCurso(RespectiveClass.idCurso.toString());
      setTurmaNome(RespectiveClass.nome);
    }
  }, [DrawerUpdate.situation]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await RouteAPI.put(`/turma/${selectedRows[0]}`, {
        toUpdate: { nome: TurmaNome, idCurso: TurmaIdCurso },
      });
    } catch (error: any) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.error.message);
      }
    } finally {
      DrawerUpdate.close();
    }
  };

  return (
    <Drawer anchor="right" open={DrawerUpdate.situation} onClose={() => DrawerUpdate.close()}>
      <div className={styles.update_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg">Atualizar Turma</h1>
        </header>
        <Divider />
        <main className="w-full h-full flex flex-col gap-2 overflow-y-auto">
          <form id="update-class" onSubmit={onSubmit} className="py-2">
            <div className="w-full flex gap-2">
              <TextField
                label="Nome da turma"
                variant="outlined"
                fullWidth
                inputProps={{ maxLength: 15 }}
                value={TurmaNome}
                onChange={(e: any) => setTurmaNome(e.target.value)}
                required
              />
              <FormControl style={{ width: "75%" }}>
                <InputLabel>Série</InputLabel>
                <Select
                  value={TurmaIdCurso}
                  label="Série"
                  onChange={(e: any) => {
                    setTurmaIdCurso(e.target.value);
                  }}
                >
                  <MenuItem value="1">1ª Série</MenuItem>
                  <MenuItem value="2">2ª Série</MenuItem>
                  <MenuItem value="3">3ª Série</MenuItem>
                  <MenuItem value="4">4ª Série</MenuItem>
                  <MenuItem value="5">5ª Série</MenuItem>
                  <MenuItem value="6">6ª Série</MenuItem>
                  <MenuItem value="7">7ª Série</MenuItem>
                  <MenuItem value="8">8ª Série</MenuItem>
                  <MenuItem value="9">9ª Série</MenuItem>
                  <MenuItem value="10">1º Ano</MenuItem>
                  <MenuItem value="11">2º Ano</MenuItem>
                  <MenuItem value="12">3º Ano</MenuItem>
                </Select>
              </FormControl>
            </div>
          </form>
          <Divider />
        </main>
        <Divider />
        <footer className={styles.senders}>
          <button onClick={() => DrawerUpdate.close()} className={styles.cancel}>
            Cancelar
          </button>
          <input type="submit" value="Atualizar" form="update-class" className={styles.submiter} />
        </footer>
      </div>
    </Drawer>
  );
};

export default Update;
