import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-auth-kit";
import { Router } from "./routes/Router";
import { ToastProvider } from "./components/Toast/Toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider authType="localstorage" authName="_auth">
      <ToastProvider>
        <Router />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>,
);
