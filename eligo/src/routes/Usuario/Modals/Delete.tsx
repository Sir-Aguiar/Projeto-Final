import React from "react";
import styles from "./Delete.module.css";
import Modal from "@mui/material/Modal";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import DeleteIcon from "@mui/icons-material/Delete";
import { AxiosError } from "axios";
import { Fade } from "@mui/material";
import { useUsuarioContext } from "../RouteStateManager";
import { useSignOut } from "react-auth-kit";
import { HandleError } from "../../../utils/defaultErrorHandler";
import { useToast } from "../../../components/Toast/Toast";

const Delete: React.FC = () => {
  const { ModalDelete, RouteAPI } = useUsuarioContext();
  const { notify } = useToast();
  const onClose = async () => {
    ModalDelete.close();
  };
  const signOut = useSignOut();

  const handleDelete = async () => {
    try {
      await RouteAPI.delete("/usuario");
      signOut();
      onClose();
    } catch (error: any) {
      HandleError(error, notify, "Erro ao excluir usuário");
    }
  };

  return (
    <Modal open={ModalDelete.situation} onClose={onClose} closeAfterTransition>
      <Fade in={ModalDelete.situation}>
        <div className={styles.delete_container}>
          <header>
            <h1 className="font-semibold text-xl">Apagar Conta</h1>
            <div className="w-full flex flex-col items-center gap-[2px]">
              <h3 className="text-[12px] ">Você tem certeza que deseja excluir sua conta?</h3>
              <p className="text-[12px] font-medium text-black-smooth">Esta ação não poderá ser revertida</p>
            </div>
          </header>
          <main>
            <div className="flex items-start h-full py-1">
              <GppMaybeIcon className={styles.warn_icon} />
            </div>
            <div className="flex flex-col gap-1 h-full">
              <h1 className="text-lg font-bold text-[#D94F3B]">Cuidado</h1>
              <p className="text-[12px] leading-4 text-black-smooth">
                Todos os alunos das respectivas, escolas, turmas e alunos serão removidos, assim como seus dados.
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

export default Delete;
