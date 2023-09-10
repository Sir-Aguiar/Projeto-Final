import React, { useState } from "react";
import styles from "./Create.module.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Divider, Drawer, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AxiosError, AxiosInstance } from "axios";

type CreateProps = {
  open: boolean;
  onClose: () => void;
  API: AxiosInstance;
};

const ClassToAdd: React.FC = () => {
  const [serie, setSerie] = useState("EF1");
  return (
    <div className="class-to-add w-full flex gap-2">
      <TextField label="Nome da turma" variant="outlined" name="nome-turma" fullWidth inputProps={{ maxLength: 15 }} />
      <FormControl style={{ width: "75%" }}>
        <InputLabel>Série</InputLabel>
        <Select value={serie} name="serie-turma" label="Série" onChange={(e: any) => setSerie(e.target.value)}>
          <MenuItem value="EF1">1ª Série</MenuItem>
          <MenuItem value="EF2">2ª Série</MenuItem>
          <MenuItem value="EF3">3ª Série</MenuItem>
          <MenuItem value="EF4">4ª Série</MenuItem>
          <MenuItem value="EF5">5ª Série</MenuItem>
          <MenuItem value="EF6">6ª Série</MenuItem>
          <MenuItem value="EF7">7ª Série</MenuItem>
          <MenuItem value="EF8">8ª Série</MenuItem>
          <MenuItem value="EF9">9ª Série</MenuItem>
          <MenuItem value="EM1">1º Ano</MenuItem>
          <MenuItem value="EM2">2º Ano</MenuItem>
          <MenuItem value="EM3">3º Ano</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

const Create: React.FC<CreateProps> = ({ onClose, open, API }) => {
  const [classesToAdd, setClassesToAdd] = useState<number[]>([]);
  const addClass = () => setClassesToAdd((values) => [...values, 1]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const RequestBody: any = {
      nome: e.currentTarget.querySelector<HTMLInputElement>("#nome")!.value,
      turmas: [],
    };

    const ClassesContainer = document.querySelector<HTMLDivElement>(".school-classes")!;
    const Classes = ClassesContainer.querySelectorAll<HTMLDivElement>(".class-to-add");

    if (Classes.length > 0) {
      Classes?.forEach((addingClass) => {
        const ClassName = addingClass.querySelector<HTMLInputElement>('input[name="nome-turma"]');
        const ClassYear = addingClass.querySelector<HTMLSelectElement>('input[name="serie-turma"]');

        if (!ClassName?.value || !ClassYear?.value) {
          return;
        }
        RequestBody.turmas.push({ nome: ClassName?.value, idSerie: ClassYear?.value });
      });
    }

    try {
      await API.post("/escola", RequestBody);
      onClose();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.log(error);
        console.log(error.response?.data.error.message);
        alert(error.response?.data.error.message);
      }
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
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
                maxLength: 75,
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
          <input type="submit" value="Cadastrar" form="create-school" className={styles.submiter} />
        </footer>
      </div>
    </Drawer>
  );
};

export default Create;
