import React from "react";
import styles from "./Filter.module.css";
import Modal from "@mui/material/Modal";
import { useTurmasContext } from "../RouteStateManager";
import { TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grow from "@mui/material/Grow";

const Filter: React.FC = () => {
  const {
    ModalFilter,
    Escolas,
    selectedCourse,
    selectedSchool,
    setSelectedCourse,
    classNameFilter,
    setSelectedSchool,
    setClassNameFilter,
  } = useTurmasContext();

  return (
    <Modal
      className="overflow-y-auto"
      open={ModalFilter.situation}
      onClose={() => ModalFilter.close()}
      closeAfterTransition
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grow
        in={ModalFilter.situation}
        style={{ transformOrigin: "0 0 0 0" }}
        {...(ModalFilter.situation ? { timeout: 350 } : {})}
      >
        <div className={styles.filter_container}>
          <header className="w-full h-[50px]  relative">
            <Divider
              className="text-lg font-semibold"
              absolute
              flexItem
              sx={{
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              Filtros
            </Divider>
          </header>
          <main>
            <TextField
              label="Nome da turma"
              variant="outlined"
              fullWidth
              value={classNameFilter}
              inputProps={{ maxLength: 15 }}
              onChange={(e) => {
                setClassNameFilter(e.target.value);
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Escola</InputLabel>
              <Select value={selectedSchool} label="Escola" onChange={(e: any) => setSelectedSchool(e.target.value)}>
                <MenuItem value="">Selecione...</MenuItem>
                {Escolas.map((escola, index) => (
                  <MenuItem key={index} value={escola.idEscola}>
                    {escola.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Série</InputLabel>
              <Select
                value={selectedCourse}
                name="serie-turma"
                label="Série"
                onChange={(e: any) => setSelectedCourse(e.target.value)}
              >
                <MenuItem value="">Selecione...</MenuItem>
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
          </main>
          <footer className="w-full h-[50px]  flex items-center justify-end">
            <Button
              variant="text"
              size="large"
              onClick={() => {
                setSelectedCourse("");
                setSelectedSchool("");
                setClassNameFilter("");
              }}
            >
              Limpar
            </Button>
          </footer>
        </div>
      </Grow>
    </Modal>
  );
};

export default Filter;
