import React from "react";
import styles from "./NotFound.module.css";
import { useNavigate } from "react-router-dom";
import ImagineOne from "../../assets/not-found-images/404Error-amico.png";
import ImagineTwo from "../../assets/not-found-images/404Error-pana.png";
import ImagineThree from "../../assets/not-found-images/404Error-rafiki.png";
import rocket from "../../assets/not-found-images/rocket.png";
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const images = [ImagineOne, ImagineTwo, ImagineThree];
  const redirect = () => {
    navigate("/");
  };

  return (
    <div className={`route_section ${styles.main_container}`}>
      <img src={images[Math.trunc(Math.random() * 3)]} className="max-h-[300px]" />
      <div className="flex flex-col font-semibold gap-2">
        <h1 className="text-[26px] desktop:text-[32px]">Parece que se perdeu</h1>
        <h2 className="text-[18px] desktop:text-[22px]">Não temos nada por aqui</h2>
      </div>
      <div className="text-[16px] desktop:text-[18px] flex flex-col gap-[5px] items-center">
        <p>Utilize a bara de navegação para voltar à usar nossa plataforma</p>
        <p className="font-semibold">ou</p>
        <p>Clique no botão para ver um mágica</p>
        <button
          onClick={redirect}
          className="hover:scale-105 transition-all duration-300 h-[50px] w-[200px] bg-[#292B2E] rounded-[2px] my-[15px]"
        >
          <img src={rocket} alt="An rocket gradient icon" className=" max-h-[35px] mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default NotFound;
