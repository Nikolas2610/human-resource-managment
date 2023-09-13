import React, { useEffect, useState } from "react";
import {
    FormControl,
    FormHelperText,
    Button,
    Box,
    Typography,
    Stack,
    useTheme,
    Tooltip,
    IconButton,
} from "@mui/material";
import { Controller } from "react-hook-form";
import FlexBetween from "../wrappers/FlexBetween";
import DeleteIcon from "@mui/icons-material/Delete";

interface ImageUploadFieldProps {
    control: any;
    setValue: any;
    errors: any;
    name: string;
    defaultValue: string | null;
    label: string;
    setError: any;
    clearErrors: any;
    setFile: (value: File | null) => void;
    title: string;
    box?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
    control,
    setValue,
    errors,
    name,
    defaultValue,
    label,
    setError,
    clearErrors,
    setFile,
    title,
    box = false,
}) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const theme = useTheme();

    useEffect(() => {
        if (defaultValue) {
            setSelectedImage(defaultValue);
        }
    }, [defaultValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size <= 1024 * 1024) {
                // Check if file size is less than or equal to 1MB
                if (
                    file.type.startsWith("image/") ||
                    file.type === "image/svg+xml"
                ) {
                    // Check if the file is an image or SVG
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setSelectedImage(reader.result as string);
                    };
                    console.log(file);

                    reader.readAsDataURL(file);
                    setValue(name, file); // Update form value
                    setFile(file);
                    clearErrors(name); // Clear any previous errors for the field
                } else {
                    // Handle non-image file error
                    setSelectedImage(null);
                    setError(name, {
                        type: "manual",
                        message:
                            "Please upload only image files (png, jpeg, jpg, svg).",
                    });
                }
            } else {
                // Handle file size error
                setSelectedImage(null);
                setError(name, {
                    type: "manual",
                    message: "File size should be no larger than 1MB.",
                });
            }
        }
    };

    const handleImageDelete = () => {
        setSelectedImage(null);
        setValue(name, null); // Update form value
        setFile(null);
    };

    const formStyles = {
        p: 2,
        boxShadow: 8,
        borderRadius: 4,
        bgcolor: theme.palette.background.paper,
    };

    return (
        <FormControl
            variant="outlined"
            fullWidth
            error={Boolean(errors.logo)}
            sx={box ? formStyles : {}}
        >
            <Stack gap={2} spacing={4}>
                <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    rules={{ required: "This field is required" }}
                    render={({
                        field: { onChange },
                        fieldState: { error },
                    }) => (
                        <>
                            <FlexBetween gap={2} py={2}>
                                <Box
                                    display={"flex"}
                                    gap={2}
                                    alignItems={"center"}
                                >
                                    <Typography variant="h3">
                                        {title}:{" "}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        component="label"
                                    >
                                        {label}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => {
                                                handleImageChange(e);
                                                onChange(e); // Calling the original onChange method from Controller
                                            }}
                                        />
                                    </Button>
                                </Box>
                                <FormHelperText
                                    sx={{
                                        fontSize: 16,
                                        color: theme.palette.error.main,
                                    }}
                                >
                                    {error?.message}
                                </FormHelperText>
                            </FlexBetween>
                        </>
                    )}
                />
            </Stack>
            {selectedImage && (
                <FlexBetween display={"flex"} alignItems={"center"} mt={2}>
                    <img src={selectedImage} alt="Selected" width="300" />
                    <Tooltip title="Remove image">
                        <IconButton
                            color="error"
                            onClick={handleImageDelete}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </FlexBetween>
            )}
        </FormControl>
    );
};

export default ImageUploadField;
