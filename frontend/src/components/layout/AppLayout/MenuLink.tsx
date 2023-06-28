import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

interface MenuLinkProps {
  to: string;
  primary: string;
  Icon: React.ElementType;
}

const MenuLink: React.FC<MenuLinkProps> = ({ to, primary, Icon }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <ListItemButton>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={primary} sx={{ color: "white" }} />
    </ListItemButton>
  </Link>
);

export default MenuLink;
