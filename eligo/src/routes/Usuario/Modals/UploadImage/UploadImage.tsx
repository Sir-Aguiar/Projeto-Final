import React, { useEffect, useState } from "react";
import styles from "./UploadImage.module.css";
import { CircularProgress, Grow, Modal } from "@mui/material";
import { useUsuarioContext } from "../../RouteStateManager";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const UploadImage: React.FC = () => {
  const { ModalUpload, selectedFile, setSelectedFile, isLoading } = useUsuarioContext();
  const [filePreview, setFilePreview] = useState<string>();

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setFilePreview(objectUrl);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (!ModalUpload.situation) {
      URL.revokeObjectURL(filePreview || "");
      setSelectedFile(undefined);
      setFilePreview(undefined);
      return;
    }
  }, [ModalUpload.situation]);

  return (
    <Modal
      open={ModalUpload.situation}
      onClose={() => ModalUpload.close()}
      closeAfterTransition
      sx={{ display: "flex", paddingY: "65px", justifyContent: "center" }}
    >
      <Grow
        in={ModalUpload.situation}
        style={{ transformOrigin: "0 0 0 0" }}
        {...(ModalUpload.situation ? { timeout: 350 } : {})}
      >
        <div className={styles.modal_content}>
          <h1 className="text-center text-sm font-semibold">
            Deseja fazer o upload de <span className="text-blue-600">{formatBytes(selectedFile?.size || 0)}?</span>
          </h1>
          <main className="w-full h-full flex items-center justify-center">
            {selectedFile && (
              <img src={filePreview} className="w-[150px] h-[150px] rounded-full border-[1px] border-black-smooth" />
            )}
          </main>
          <footer className="w-full h-[50px] min-h-[50px] py-2 flex items-center justify-between gap-2 font-semibold text-sm">
            <button
              className="w-full h-full border-[1px] border-black-smooth rounded-sm"
              onClick={() => ModalUpload.close()}
            >
              Cancelar
            </button>
            <button className="w-full h-full bg-blue-600 text-background rounded-sm" type="submit" form="upload-form">
              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Enviar"}
            </button>
          </footer>
        </div>
      </Grow>
    </Modal>
  );
};

export default UploadImage;
