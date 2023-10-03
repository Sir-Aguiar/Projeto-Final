import React, { useState } from "react";
import styles from "./Create.module.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { CircularProgress, Divider, Drawer, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEscolasContext } from "../RouteStateManager";
import { ToCreateSchool } from "../../../@types/Escolas";

const ClassToAdd: React.FC = () => {
  const [serie, setSerie] = useState("1");
  return (
    <div className="class-to-add w-full flex gap-2">
      <TextField label="Nome da turma" variant="outlined" name="nome-turma" fullWidth inputProps={{ maxLength: 15 }} />
      <FormControl style={{ width: "75%" }}>
        <InputLabel>Série</InputLabel>
        <Select value={serie} name="serie-turma" label="Série" onChange={(e: any) => setSerie(e.target.value)}>
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
  );
};

const Create: React.FC = () => {
  const { DrawerCreate, isLoading, setLoading, handleCreate, notify } = useEscolasContext();

  const [classesToAdd, setClassesToAdd] = useState<number[]>([]);
  const addClass = () => setClassesToAdd((values) => [...values, 1]);

  const onClose = () => {
    DrawerCreate.close();
    setClassesToAdd([]);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const RequestBody: ToCreateSchool = {
      nome: e.currentTarget.querySelector<HTMLInputElement>("#nome")!.value,
      turmas: [],
    };

    const ClassesContainer = document.querySelector<HTMLDivElement>(".school-classes")!;
    const Classes = ClassesContainer.querySelectorAll<HTMLDivElement>(".class-to-add")!;

    if (Classes.length > 0) {
      Classes.forEach((addingClass) => {
        const ClassName = addingClass.querySelector<HTMLInputElement>('input[name="nome-turma"]');
        const ClassYear = addingClass.querySelector<HTMLSelectElement>('input[name="serie-turma"]');
        if (!ClassName || !ClassYear) {
          return;
        }

        if (!ClassName.value || !ClassYear.value) {
          return;
        }

        RequestBody.turmas.push({ nome: ClassName.value, idCurso: Number(ClassYear.value) });
      });
    }

    await handleCreate(RequestBody);
    setClassesToAdd([]);
  };

  return (
    <Drawer anchor="right" open={DrawerCreate.situation} onClose={onClose}>
      <div className={styles.insert_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg">Cadastrar Escola</h1>
        </header>
        <Divider />
        <main className="w-full h-full flex flex-col gap-2  overflow-y-auto">
          <form className="py-2" id="create-school" onSubmit={onSubmit}>
            <TextField
              fullWidth
              id="nome"
              label="Nome da escola"
              variant="outlined"
              helperText="Estes dados poderão ser alterados"
              inputProps={{
                maxLength: 150,
              }}
              required
            />
          </form>
          <Divider />
          <button onClick={addClass} className={styles.class_adder}>
            <AddBoxIcon /> Adicionar turma
          </button>
          <div className="w-full py-2 flex flex-col gap-2 school-classes">
            {classesToAdd.map((num, index) => (
              <ClassToAdd key={index} />
            ))}
          </div>
        </main>
        <Divider />
        <footer className={styles.senders}>
          <button onClick={onClose} className={styles.cancel}>
            Cancelar
          </button>
          <button className={`${styles.submiter} bg-blue-600`} type="submit" form="create-school">
            {isLoading ? <CircularProgress size={30} color="inherit" /> : "Cadastrar"}
          </button>
        </footer>
      </div>
    </Drawer>
  );
};

export default Create;
