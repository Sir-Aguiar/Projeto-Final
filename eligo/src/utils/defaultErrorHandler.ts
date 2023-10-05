import { AxiosError } from "axios";
import { ToastProps } from "../components/Toast/Toast";
type NotifyFunction = (options: ToastProps) => void;
type IncomingError = Error | AxiosError;
export const HandleError = (error: IncomingError, notify: NotifyFunction, title: string) => {
  if (error instanceof AxiosError) {
    
  }

  if (error instanceof error) {
  }
};
