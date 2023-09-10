import axios, { AxiosInstance } from "axios";
import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";

type ProviderProps = {
  children: React.ReactNode;
};

interface IRouteContext {}

const RouteContext = createContext<IRouteContext | null>(null);

const TurmasProvider: React.FC<ProviderProps> = ({ children }) => {
  const authHeader = useAuthHeader();

  // Axios instance
  const RouteAPI = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: authHeader(),
    },
  });

  return <RouteContext.Provider value={null}>{children}</RouteContext.Provider>;
};

const useTurmasContext = () => {
  const context = useContext(RouteContext);

  if (!context) throw new Error("EscolasContext deve ser chamado dentro de TurmasProvider");

  return context;
};

export { TurmasProvider, useTurmasContext };
