import React, { useState, useEffect } from "react";
import styles from "./Escolas.module.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Box, Divider, Drawer, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ClassToAdd: React.FC = () => {
  return (
    <div className="class-to-add w-full flex gap-2" id="">
      <TextField label="Nome da turma" variant="outlined" className="nome-turma" fullWidth />
      <FormControl style={{ width: "75%" }}>
        <InputLabel>Série</InputLabel>
        <Select className="class-year" label="Série">
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

const Create: React.FC = () => {
  const [classesToAdd, setClassesToAdd] = useState<number[]>([]);
  return (
    <Drawer anchor="right" open={insertDrawer} onClose={() => toggleInsert(false)}>
      <Box
        p={2}
        width="320px"
        height={"100%"}
        textAlign="center"
        role="presentation"
        className={styles.insert_container}
      >
        <h1 className="font-bold text-lg mb-2">Cadastrar Escola</h1>
        <Divider />
        <div className="flex flex-col items-center w-full py-5">
          <TextField fullWidth id="nome" label="Nome da escola" variant="outlined" />
          <span className="text-[10px] my-2 font-medium">Estes dados podem ser alterados no futuro</span>
        </div>
        <Divider />
        <button
          onClick={() => setClassesToAdd((values) => [...values, 1])}
          className="my-2 px-1 py-2 w-full flex items-center font-medium text-sm "
        >
          <AddBoxIcon style={{ width: "20px", height: "20px", marginRight: "5px" }} /> Adicionar turma
        </button>
        <form className="w-full max-h-[300px] py-2 flex flex-col gap-2  overflow-y-auto">
          {classesToAdd.map((num, index) => (
            <ClassToAdd key={index} />
          ))}
        </form>
        <div className="w-full bg-blue-300 h-12 mt-auto"></div>
      </Box>
    </Drawer>
  );
};

export default Create;
