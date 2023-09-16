import { Document } from "@/types/documents/Document.type";
import { Alert, Typography, Grid, Paper, Tooltip, Box } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

export default function EmployeeDocuments({
    documents,
}: EmployeeDocumentsProps) {
    const handleClick = (filePath: string) => {
        window.open(filePath, "_blank");
    };

    return (
        <>
            {documents.length === 0 ? (
                <Box my={4}>
                    <Alert severity="info">
                        No documents uploaded.
                    </Alert>
                </Box>
            ) : (
                <Box my={4}>
                    <Grid container spacing={4}>
                        {documents.map((document, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Tooltip title="Click to open in a new tab">
                                    <Paper
                                        sx={{
                                            position: "relative",
                                            textAlign: "center",
                                            padding: "20px",
                                            cursor: "pointer",
                                            transition: ".3s",
                                            "&:hover": {
                                                opacity: 0.8,
                                            },
                                            "&:hover .deleteIcon": {
                                                opacity: 1,
                                            },
                                        }}
                                        elevation={3}
                                        onClick={() =>
                                            handleClick(document.file_path)
                                        }
                                    >
                                        <DescriptionIcon
                                            style={{ fontSize: "100px" }}
                                        />
                                        <Typography variant="body1">
                                            {document.title}
                                        </Typography>
                                    </Paper>
                                </Tooltip>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </>
    );
}

interface EmployeeDocumentsProps {
    documents: Document[];
}
