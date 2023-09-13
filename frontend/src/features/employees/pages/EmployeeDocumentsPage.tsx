import { selectCompany } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import {
    useDeleteDocumentMutation,
    useGetEmployeeDocumentsQuery,
    useStoreDocumentMutation,
} from "../employeesEndpoints";
import { useNavigate, useParams } from "react-router-dom";
import RouteList from "@/routes/RouteList";
import {
    Alert,
    Box,
    Button,
    Grid,
    Paper,
    Tooltip,
    Typography,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import usePageTitle from "@/hooks/usePageTitle";
import { capitalizeFirstLetter } from "@/utils/helpers/functions";
import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import AddIcon from "@mui/icons-material/Add";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { useForm } from "react-hook-form";
import { NewDocument } from "@/types/documents/NewDocument.type";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import useDeleteEntity from "@/hooks/useDeleteEntity";
import { Document } from "@/types/documents/Document.type";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EmployeeDocumentsPage() {
    const companyId = useSelector(selectCompany);
    const { employeeId } = useParams();
    const navigate = useNavigate();
    usePageTitle("Employee Documents");
    const { register, handleSubmit, setValue, reset } = useForm<NewDocument>();
    const [fileMessage, setFileMessage] = useState<string | null>(null);
    const [fileSeverity, setFileSeverity] = useState<
        "success" | "error" | null
    >(null);

    if (!employeeId) {
        navigate(RouteList.employees);
        return null;
    }

    const {
        data: documents = [],
        isLoading,
        isError,
    } = useGetEmployeeDocumentsQuery({
        companyId,
        employeeId,
    });

    const [
        storeDocument,
        {
            isLoading: isCreateLoading,
            isError: isCreateError,
            error: createError,
            isSuccess: isCreateSuccess,
        },
    ] = useStoreDocumentMutation();

    const [
        deleteDocument,
        {
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            isSuccess: isDeleteSuccess,
        },
    ] = useDeleteDocumentMutation();

    const handleDelete = useDeleteEntity(isDeleteLoading);

    const handleDeleteDocument = (document: Document) => {
        handleDelete(document.id, document.title, companyId, deleteDocument, {
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
        });
        // deleteDocument({ companyId, documentId });
    };

    useHandleMutation({
        isLoading: isCreateLoading,
        isError: isCreateError,
        error: createError,
        isSuccess: isCreateSuccess,
        actionType: "store",
        entityType: "Document",
        redirectTo: "",
    });

    useEffect(() => {
        if (isCreateSuccess) {
            setFileMessage(null);
            setFileSeverity(null);
            reset();
        }
    }, [isCreateSuccess]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    const onDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        validateFile(droppedFile);
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        validateFile(selectedFile);
    };

    const validateFile = (file: File | null) => {
        if (!file) return;

        const fileType = file.name.split(".").pop()?.toLowerCase();
        const validTypes = ["doc", "docx", "pdf", "jpeg", "jpg", "png"];

        if (fileType && validTypes.includes(fileType) && file.size <= 1048576) {
            setValue("title", file.name); // Uncomment if you're using `useForm`
            setValue("file_path", file); // Uncomment if you're using `useForm`

            setFileMessage(`File "${file.name}" is valid.`);
            setFileSeverity("success");
        } else {
            setFileMessage(
                `File "${file.name}" is invalid. Only doc, docx, pdf, jpeg, jpg, and png files with size up to 1MB are allowed.`
            );
            setFileSeverity("error");
        }
    };

    const handleClick = (filePath: string) => {
        window.open(filePath, "_blank");
    };

    const onSubmit = (data: NewDocument) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("file_path", data.file_path as File);
        formData.append("employee_id", employeeId);

        storeDocument({ companyId, formData });
    };

    return (
        <Box>
            <HeaderPageBackFeature
                headerTitle={"Documents"}
                buttonTitle="Back to Employees"
                to={RouteList.employees}
            />

            <Typography variant="h2" fontWeight={500} my={5}>
                Upload Document
            </Typography>

            <Box
                sx={{
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                }}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                component={"form"}
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    accept=".doc,.docx,.pdf,.jpeg,.jpg,.png"
                    onChange={onChange}
                />
                <input type="hidden" {...register("title")} />
                <input type="hidden" {...register("file_path")} />
                <Box
                    style={{
                        border: "2px dashed grey",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        const fileInput = document.getElementById("fileInput");
                        if (fileInput) {
                            fileInput.click();
                        }
                    }}
                >
                    <Typography variant="body2">
                        Drag and drop a file here or click to upload
                    </Typography>
                </Box>
                {fileSeverity && (
                    <Box mt={2} display={"flex"} gap={1}>
                        <DescriptionIcon color={fileSeverity} />
                        <Typography color={fileSeverity}>
                            {fileMessage}
                        </Typography>
                    </Box>
                )}
                {fileSeverity === "success" && (
                    <FlexCenter mt={2}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            type="submit"
                        >
                            Upload
                        </Button>
                    </FlexCenter>
                )}
            </Box>

            {documents.length === 0 ? (
                <Alert severity="info" sx={{ marginTop: 4 }}>
                    No documents uploaded.
                </Alert>
            ) : (
                <>
                    <Typography variant="h2" fontWeight={500} my={5}>
                        {capitalizeFirstLetter(documents[0].employee_name)}{" "}
                        Documents
                    </Typography>

                    <Grid container spacing={4}>
                        {documents.map((document, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
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
                                    <Box
                                        className="deleteIcon"
                                        sx={{
                                            position: "absolute",
                                            top: 5,
                                            right: 5,
                                            opacity: 0,
                                            transition: ".3s",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the Paper's click event
                                            handleDeleteDocument(document);
                                        }}
                                    >
                                        <Tooltip title="Delete Document">
                                            <DeleteIcon
                                                color="error"
                                                style={{
                                                    fontSize: "2em",
                                                }}
                                            />
                                        </Tooltip>
                                    </Box>

                                    <DescriptionIcon
                                        style={{ fontSize: "100px" }}
                                    />
                                    <Typography variant="body1">
                                        {document.title}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    );
}
