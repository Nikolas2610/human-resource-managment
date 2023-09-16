import { Employee } from "@/types/employee/Employee.type";
import {
    convertToDDMMYYYY,
    capitalizeFirstLetter,
} from "@/utils/helpers/functions";

import { Stack, Grid, Typography, useTheme } from "@mui/material";
import React from "react";

export default function ProfileData({ employee }: ProfileDataProps) {
    return (
        <>
            <Grid container spacing={2} mt={0}>
                <Grid item xs={12} md={6}>
                    <RowDetails title={"Company Email"}>
                        {employee?.email}
                    </RowDetails>
                </Grid>
                <Grid item xs={12} md={6}>
                    {employee?.personal_email && (
                        <RowDetails title={"Personal Email"}>
                            {employee?.personal_email}
                        </RowDetails>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <RowDetails title={"Phone"}>{employee?.phone}</RowDetails>
                </Grid>
                <Grid item xs={12} md={6}>
                    <RowDetails title={"Address"}>
                        {employee?.address}
                    </RowDetails>
                </Grid>
                <Grid item xs={12} md={6}>
                    <RowDetails title={"Work Start Date"}>
                        {convertToDDMMYYYY(employee?.work_start_date as string)}
                    </RowDetails>
                </Grid>
                <Grid item xs={12} md={6}>
                    {employee?.type_of_job && (
                        <RowDetails title={"Type of Job"}>
                            {capitalizeFirstLetter(
                                employee?.type_of_job.replace(/-/g, " ")
                            )}
                        </RowDetails>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    {employee?.birthday && (
                        <RowDetails title={"Birthday"}>
                            {convertToDDMMYYYY(employee?.birthday as string)}
                        </RowDetails>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    {employee?.name_day && (
                        <RowDetails title={"Name Day"}>
                            {convertToDDMMYYYY(employee?.name_day as string)}
                        </RowDetails>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    {employee?.married && (
                        <RowDetails title={"Married"}>
                            {employee?.married ? "Yes" : "No"}
                        </RowDetails>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    {employee?.childs_count && (
                        <RowDetails title={"Childs"}>
                            {employee?.childs_count}
                        </RowDetails>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    {employee?.salary && (
                        <RowDetails title={"Salary"}>
                            {employee?.salary}
                        </RowDetails>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    {employee?.reports_to && (
                        <RowDetails title={"Report To"}>
                            {employee?.reports_to.first_name}{" "}
                            {employee?.reports_to.last_name}
                        </RowDetails>
                    )}
                </Grid>
            </Grid>
        </>
    );
}

interface ProfileDataProps {
    employee: Employee;
}

const RowDetails = ({ title, children }: RowDetailsProps) => {
    const theme = useTheme();
    return (
        <Stack mb={3}>
            <Typography
                variant="h5"
                fontWeight={600}
                color={theme.palette.primary.main}
            >
                {title}
            </Typography>
            <Typography variant="h4">{children}</Typography>
        </Stack>
    );
};

interface RowDetailsProps {
    title: string;
    children: React.ReactNode;
}
