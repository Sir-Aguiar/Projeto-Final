import * as React from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import { Button, Menu } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export default function Profile() {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <div className="w-full h-full bg-red-300">
      <Button variant="contained" onClick={handleClick}>
        Dashboard
      </Button>
      <Menu anchorEl={anchorElement} open={open} onClose={handleClose}>
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
            <span className="font-Montserrat text-[15px] w-full ">Felipe Ferreira Aguiar</span>
          </MenuItem>
          <Divider />
          <MenuItem
            sx={{
              padding: "5px",
            }}
          >
            <div className="w-full h-full  flex items-center gap-2 text-gray-500 font-Roboto font-medium">
              <AccountCircleIcon fontSize="large" />
              Visitar Perfil
            </div>
          </MenuItem>
          <Divider />
          <MenuItem
            sx={{
              borderRadius: "3px",
              "transition":"all .25s ease-in",
              ":hover": {
                background: "#eb4646",
                color: "#FEFEFE",
              },
            }}
          >
            <div className="w-full text-center text-[17px] font-medium py-1 logout-container">Desconectar</div>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
