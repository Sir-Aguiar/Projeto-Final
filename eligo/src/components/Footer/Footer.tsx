import React from "react";
import DefaultLogo from "../../assets/Eligo/SVG/full-white-logo.svg";

const Footer: React.FC = () => {
  return (
    <footer className="min-h-[300px] h-[300px] w-full bg-black-text flex items-center justify-center">
      <img src={DefaultLogo} className="max-w-[400px] mobile:max-w-[250px]" />
    </footer>
  );
};

export default Footer;
