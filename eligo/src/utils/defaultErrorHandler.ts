import { AxiosError } from "axios";
import { ToastProps } from "../components/Toast/Toast";
type NotifyFunction = (options: ToastProps) => void;
type IncomingError = Error | AxiosError;
export const HandleError = (error: IncomingError, notify: NotifyFunction, title: string) => {
  if (error instanceof AxiosError) {
    const response = error.response;

    if (response) {
      return notify({
        title,
        message: response.data.error.message,
        severity: "error",
      });
    }

    return notify({
      title: error.message,
      message: "Parece que estamos com um problema em nosso servidor. Aguarde alguns instantes",
      severity: "error",
    });
  }

  if (error instanceof Error) {
    return notify({
      title: "Tivemos um erro inesperado",
      message: error.message,
      severity: "error",
    });
  }
};
