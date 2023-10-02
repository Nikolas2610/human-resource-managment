import { useSelector } from "react-redux";
import { useGetCompanyFullDetailsQuery } from "../companiesEndpoints";
import { selectCompany } from "@/features/auth/authSlice";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import React from "react";

import {
    Facebook,
    Instagram,
    LinkedIn,
    Twitter,
    YouTube,
} from "@mui/icons-material";
import usePageTitle from "@/hooks/usePageTitle";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { Link } from "react-router-dom";
import SocialMediaIcon from "../components/SociaMediaIcon";

export default function CompanyDetails() {
    const companyId = useSelector(selectCompany);
    const {
        data: company = null,
        isLoading,
        isError,
    } = useGetCompanyFullDetailsQuery(companyId);
    usePageTitle("Company Details");

    if (isLoading) {
        return "Loading...";
    }

    if (isError || !company) {
        return "Error";
    }

    return (
        <Card style={{ margin: "16px", padding: "16px" }}>
            <CardContent>
                <Grid container spacing={3} alignItems={"center"}>
                    {company.logo && (
                        <Grid item xs={12} lg={3}>
                            <img
                                src={company.logo}
                                alt="Company Logo"
                                style={{ width: "200px" }}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} lg={9}>
                        <Typography variant="h2" fontWeight={700} mb={3}>
                            {company.name}
                        </Typography>
                        <Row title="Company Email">
                            {company.email_company ? (
                                <Link to={`mailto:${company.email_company}`}>
                                    {company.email_company}
                                </Link>
                            ) : (
                                "N/A"
                            )}
                        </Row>
                        <Row title="HR Email">
                            {company.hr_mail ? (
                                <Link to={`mailto:${company.hr_mail}`}>
                                    {company.hr_mail}
                                </Link>
                            ) : (
                                "N/A"
                            )}
                        </Row>
                        <Row title="Contact Email">
                            {company.contact_email ? (
                                <Link to={`mailto:${company.contact_email}`}>
                                    {company.contact_email}
                                </Link>
                            ) : (
                                "N/A"
                            )}
                        </Row>
                        <Row title="Phone">
                            {company.phone_number ? (
                                <Link to={`tel:${company.phone_number}`}>
                                    {company.phone_number}
                                </Link>
                            ) : (
                                "N/A"
                            )}
                        </Row>
                        <Row title="Address">{company.address || "N/A"}</Row>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        alignItems={"center"}
                        display={"flex"}
                        sx={{
                            justifyContent: {
                                lg: "end",
                            },
                        }}
                    >
                        <SocialMediaIcon
                            link={company.facebook}
                            IconComponent={Facebook}
                        />
                        <SocialMediaIcon
                            link={company.instagram}
                            IconComponent={Instagram}
                        />
                        <SocialMediaIcon
                            link={company.linkedin}
                            IconComponent={LinkedIn}
                        />
                        <SocialMediaIcon
                            link={company.twitter}
                            IconComponent={Twitter}
                        />
                        <SocialMediaIcon
                            link={company.youtube}
                            IconComponent={YouTube}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

const Row = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    return (
        <Grid container spacing={2} alignItems={"center"} py={0.5}>
            <Grid item xs={6} lg={3}>
                <FlexBetween>
                    <Typography variant="h4" fontWeight={500}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={500}>
                        :
                    </Typography>
                </FlexBetween>
            </Grid>
            <Grid item xs={6} lg={9}>
                <Typography variant="h5">{children}</Typography>
            </Grid>
        </Grid>
    );
};
