import React from "react";
import MenuLink from "./MenuLink";
import { employeeMenuItems } from "../../../utils/menu-items/employeeMenuItems";
import { MenuItem } from "../../../types/MenuItem.type";

const EmployeeSidebarMenu: React.FC = () => {
    return (
        <>
            {Object.entries(employeeMenuItems).map(
                ([key, { link, title, icon }]: [string, MenuItem]) => (
                    <MenuLink key={key} to={link} primary={title} Icon={icon} />
                )
            )}
        </>
    );
};

export default EmployeeSidebarMenu;
