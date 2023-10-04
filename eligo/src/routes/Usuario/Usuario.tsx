import React, { useState } from "react";
import styles from "./Usuario.module.css";
import { useUsuarioContext } from "./RouteStateManager";
import UploadImage from "./Modals/UploadImage/UploadImage";
import { CircularProgress } from "@mui/material";

const Usuario: React.FC = () => {
  const { handleFileSelect, handleFileSubmit, Usuario, isLoading } = useUsuarioContext();

  return (
    <div className={styles.content_section}>
      {isLoading ? (
        <CircularProgress size={50} color="primary" sx={{ marginX: "auto" }} />
      ) : (
        Usuario && (
          <>
            <div className={styles.profile_image_section}>
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/profile_images/${Usuario?.profile_image}`}
                className={styles.profile_image}
              />
              <button
                onClick={() => {
                  document.getElementById("file-upload")?.click();
                }}
                className={styles.update}
              >
                Alterar Imagem
              </button>
              <form id="upload-form" encType="multipart/form-data" className="hidden" onSubmit={handleFileSubmit}>
                <input id="file-upload" type="file" onChange={handleFileSelect} accept=".pgn, .jpg, .jpeg" />
              </form>
            </div>
            <UploadImage />
          </>
        )
      )}
    </div>
  );
};

export default Usuario;
