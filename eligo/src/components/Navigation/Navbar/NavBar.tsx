import React from "react";
import styles from "./NavBar.module.css";
import LogoBlack from "../../../assets/logo-black.svg";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Menu } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuthUser, useSignOut } from "react-auth-kit";
const Navbar: React.FC = () => {
  const [profileAnchorElement, setProfileAnchorElement] = React.useState<null | HTMLElement>(null);
  const signOut = useSignOut();
  const authUser = useAuthUser();
  const open = Boolean(profileAnchorElement);

  const openProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProfileAnchorElement(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setProfileAnchorElement(null);
  };

  const toggleNavbar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const menu = document.querySelector(`.${styles.mobile_menu}`);
    menu?.classList.toggle(styles.active);
    const navbar = document.querySelector(`.${styles.nav_options}`);
    navbar?.classList.toggle(styles.active);
  };

  return (
    <nav className={styles.navigation_container}>
      <img src={LogoBlack} className="max-h-[30px] hover:drop-shadow-logo cursor-pointer" />
      <div className={styles.nav_options}>
        <div className={styles.search_bar}>
          <input type="text" placeholder="Nome do aluno" />
          <PersonSearchIcon />
        </div>
        <div className={styles.navigations}>
          <Link to="/turmas">Turmas</Link>
          <Link to="/escolas">Escolas</Link>
          <Link to="/alunos">Alunos</Link>
        </div>
        <button className={styles.profile} onClick={openProfileMenu}>
          <AccountCircleIcon />
        </button>
        <Menu
          anchorEl={profileAnchorElement}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          onClose={closeProfileMenu}
        >
          <MenuList sx={{ width: "320px", padding: "10px" }}>
            <MenuItem
              sx={{
                padding: "5px 0",
                textAlign: "center",
                cursor: "default",
                ":hover": {
                  background: "inherit",
                },
                margin: "0px",
              }}
            >
              <span className="font-Montserrat text-[15px] w-full">{authUser()?.email.value}</span>
            </MenuItem>
            <Divider />
            <MenuItem
              sx={{
                padding: "5px",
              }}
            >
              <div className="w-full h-full  flex items-center gap-2 text-black-text font-Roboto font-medium">
                <AccountCircleIcon fontSize="large" />
                Visitar Perfil
              </div>
            </MenuItem>
            <Divider />
            <MenuItem
              sx={{
                borderRadius: "3px",
                transition: "all .25s ease-in",
                ":hover": {
                  background: "#eb4646",
                  color: "#FEFEFE",
                },
              }}
            >
              <div className="w-full text-center text-[17px] font-medium py-1" onClick={() => signOut()}>
                Desconectar
              </div>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className={styles.mobile_menu} onClick={toggleNavbar}>
        <div className={styles.line1}></div>
        <div className={styles.line2}></div>
        <div className={styles.line3}></div>
      </div>
    </nav>
  );
};

export default Navbar;
