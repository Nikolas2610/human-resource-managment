import { Box, useTheme } from "@mui/material"
import { Outlet } from "react-router-dom"


function AuthLayout() {
  const theme = useTheme()
  return (
    <Box bgcolor={theme.palette.primary.light} height={'100vh'}>
        <Outlet />
    </Box>
  )
}

export default AuthLayout