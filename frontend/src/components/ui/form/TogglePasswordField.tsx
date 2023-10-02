import { Controller } from "react-hook-form";
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText,
    Tooltip,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

interface TogglePasswordFieldProps {
    control: any;
    name: string;
    label: string;
    placeholder: string;
    rules: any;
    errorObject: any;
    onChange?: (e: any) => void;
    disabled?: boolean;
}

export const TogglePasswordField: React.FC<TogglePasswordFieldProps> = ({
    control,
    name,
    label,
    placeholder,
    rules,
    errorObject,
    onChange,
    disabled = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl variant="outlined" fullWidth error={!!errorObject[name]}>
            <InputLabel htmlFor={`outlined-adornment-${name}`}>
                {label}
            </InputLabel>
            <Controller
                name={name}
                control={control}
                defaultValue=""
                rules={rules}
                render={({ field }) => (
                    <OutlinedInput
                        {...field}
                        id={`outlined-adornment-${name}`}
                        type={showPassword ? "text" : "password"}
                        label={label}
                        onChange={(e) => {
                            field.onChange(e); // default handler
                            onChange && onChange(e); // additional handler
                        }}
                        disabled={disabled}
                        placeholder={placeholder}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={`Toggle ${name} visibility`}
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    edge="end"
                                >
                                    {!showPassword ? (
                                        <Tooltip title="Show Password">
                                            <VisibilityOff />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Hide Password">
                                            <Visibility />
                                        </Tooltip>
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                )}
            />
            <FormHelperText error={Boolean(errorObject[name])}>
                {errorObject[name]?.message}
            </FormHelperText>
        </FormControl>
    );
};
