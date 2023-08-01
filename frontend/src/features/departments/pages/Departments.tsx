import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Typography,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGetDepartmentsQuery } from "../../api/apiService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useEffect } from "react";
import { setLoading } from "../../dashboard/dashboardSlice";

function Departments() {
    const theme = useTheme();
    const companyId =
        useSelector((state: RootState) => state.auth.user?.company_id) || 0;
    const { data: departments, error, isLoading } = useGetDepartmentsQuery(companyId);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(isLoading);

        // dispatch(setLoading(isLoading));
    }, [isLoading]);

    console.log(departments);

    return (
        <>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {isLoading ? "Loading..." : ""}
            <Box
                p={3}
                borderRadius={4}
                boxShadow={4}
                bgcolor={theme.palette.background.paper}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography variant="h4">Departments</Typography>
                <Button
                    variant={"contained"}
                    size="large"
                    startIcon={<AddIcon />}
                >
                    Add a new Department
                </Button>
            </Box>
            {departments && JSON.stringify(departments)}
            {/* {departments && departments.map(item => (
                <div>{item.id}</div>
            ))} */}
        </>
    );
}

export default Departments;
