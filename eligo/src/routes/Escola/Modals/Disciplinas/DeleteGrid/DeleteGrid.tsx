import React from "react";
import styles from "./DeleteGrid.module.css";
import Modal from "@mui/material/Modal";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import DeleteIcon from "@mui/icons-material/Delete";

import { AxiosError } from "axios";
import { Fade } from "@mui/material";

type Props = {
  situation: boolean;
  onClose: () => Promise<void>;
  handleDelete: () => Promise<void>;
};

const DeleteGrid: React.FC<Props> = ({ onClose, situation, handleDelete }) => {
  return (
    <Modal open={situation} onClose={onClose} closeAfterTransition>
      <Fade in={situation}>
        <div className={styles.delete_container}>
          <header>
            <h1 className="font-semibold text-xl">Remover da Grade</h1>
            <div className="w-full flex flex-col items-center gap-[2px]">
              <h3 className="text-[12px] ">Deseja remover esta disciplina desta série?</h3>
              <p className="text-[12px] font-medium text-icon-black">Esta ação não poderá ser revertida</p>
            </div>
          </header>
          <main>
            <div className="flex items-start h-full py-1">
              <GppMaybeIcon className={styles.warn_icon} />
            </div>
            <div className="flex flex-col gap-1 h-full">
              <h1 className="text-lg font-bold text-[#D94F3B]">Cuidado</h1>
              <p className="text-[12px] leading-4 text-icon-black">
                Todos os professores que lecionarem a disciplina para este curso associado serão desvinculados.
              </p>
            </div>
          </main>
          <footer>
            <button className="bg-black-text" onClick={onClose}>
              Cancelar
            </button>
            <button className="bg-[#EB4B4B] flex items-center justify-center gap-[2px]" onClick={handleDelete}>
              Excluir <DeleteIcon />
            </button>
          </footer>
        </div>
      </Fade>
    </Modal>
  );
};

export default DeleteGrid;
