import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useIsAuthenticated } from "react-auth-kit";
import Login from "./Login/Login";
import LandingPage from "./LandingPage/LandingPage";
import Register from "./Register/Register";

const Router = () => {
  const isUserLogged = useIsAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/" element={isUserLogged() ? <LandingPage></LandingPage> : <LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export { Router };
