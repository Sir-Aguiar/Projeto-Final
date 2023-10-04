import axios, { AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import jwtDecode from "jwt-decode";
import { FindUser, UpdateProfileImage } from "../../services/Usuario";
import { useToast } from "../../components/Toast/Toast";
import { IUsuario } from "../../@types/Usuario";

interface IModalProps {
  situation: boolean;
  open: () => void;
  close: () => void;
}

type ProviderProps = {
  children: React.ReactNode;
};

interface IRouteContext {
  RouteAPI: AxiosInstance;
  ModalDelete: IModalProps;
  ModalUpload: IModalProps;
  isLoading: boolean;
  selectedFile: File | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  Usuario?: IUsuario;
}

const RouteContext = createContext<IRouteContext | null>(null);

const UsuarioProvider: React.FC<ProviderProps> = ({ children }) => {
  const { notify } = useToast();

  const authHeader = useAuthHeader();

  const RouteAPI = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: authHeader(),
    },
  });

  const [Usuario, setUsuario] = useState<IUsuario>();

  const [isLoading, setLoading] = useState(false);
  const [isDeleteOpen, setDeleteModal] = useState(false);
  const [isUploadOpen, setUploadModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File>();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || e.currentTarget.files.length !== 1) {
      setSelectedFile(undefined);
      return;
    }

    if (
      e.currentTarget.files[0].type !== "image/png" &&
      e.currentTarget.files[0].type !== "image/jpeg" &&
      e.currentTarget.files[0].type !== "image/jpg"
    ) {
      return notify({
        title: "Formato de imagem inválido",
        message: "Por favor, insira apenas imagens no formato JPG e PNG",
        severity: "warn",
        autoHide: 7000,
      });
    }

    setSelectedFile(e.currentTarget.files[0]);
    ModalUpload.open();
  };

  const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("profile_image", selectedFile!);
    try {
      const response = await UpdateProfileImage(RouteAPI, formData);
      await loadUserData();
      ModalUpload.close();
      notify({ title: "Foto de perfil atualizada" });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const ModalDelete = useMemo(() => {
    return {
      situation: isDeleteOpen,
      open: () => setDeleteModal(true),
      close: () => {
        setDeleteModal(false);
      },
    };
  }, [isDeleteOpen]);

  const ModalUpload = useMemo(() => {
    return {
      situation: isUploadOpen,
      open: () => setUploadModal(true),
      close: () => setUploadModal(false),
    };
  }, [isUploadOpen]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await FindUser(RouteAPI);
      setUsuario(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <RouteContext.Provider
      value={{
        ModalDelete,
        Usuario,
        RouteAPI,
        ModalUpload,
        handleFileSelect,
        selectedFile,
        setSelectedFile,
        isLoading,
        setLoading,
        handleFileSubmit,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

const useUsuarioContext = () => {
  const context = useContext(RouteContext);

  if (!context) throw new Error("EscolasContext deve ser chamado dentro de UsuarioProvider");

  return context;
};

export { UsuarioProvider, useUsuarioContext };
