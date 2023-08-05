import MenuLink from "./MenuLink";
import { hrMenuItems } from "@/utils/menu-items/hrMenuItems";
import { MenuItem } from "@/types/MenuItem.type";

const HrSidebarMenu: React.FC = () => (
    <>
        {Object.entries(hrMenuItems).map(
            ([key, { link, title, icon }]: [string, MenuItem]) => (
                <MenuLink key={key} to={link} primary={title} Icon={icon} />
            )
        )}
    </>
);

export default HrSidebarMenu;
