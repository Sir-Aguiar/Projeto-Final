import React, { useEffect, useState } from "react";
import styles from "./Update.module.css";
import { CircularProgress, Divider, Drawer, TextField } from "@mui/material";
import { useTurmasContext } from "../RouteStateManager";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const Update: React.FC = () => {
  const { selectedRows, DrawerUpdate, Turmas, handleUpdate, isLoading } = useTurmasContext();

  const [TurmaIdCurso, setTurmaIdCurso] = useState("");
  const [TurmaNome, setTurmaNome] = useState("");

  useEffect(() => {
    if (DrawerUpdate.situation) {
      if (selectedRows.length !== 1) {
        DrawerUpdate.close();
        return;
      }

      const RespectiveClass = Turmas.find((turma) => turma.idTurma === selectedRows[0]);

      if (!RespectiveClass) return DrawerUpdate.close();

      setTurmaIdCurso(RespectiveClass.curso.idCurso.toString());
      setTurmaNome(RespectiveClass.nome);
    }
  }, [DrawerUpdate.situation]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleUpdate({ nome: TurmaNome, idCurso: Number(TurmaIdCurso) });
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
          <button type="submit" form="update-class" className={`${styles.submiter} bg-blue-gradient`}>
            {isLoading ? <CircularProgress size={30} color="inherit" /> : "Atualizar"}
          </button>
        </footer>
      </div>
    </Drawer>
  );
};

export default Update;
