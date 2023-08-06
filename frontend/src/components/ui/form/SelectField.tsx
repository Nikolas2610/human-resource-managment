import { Controller, Control, FieldErrors } from "react-hook-form";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";

type SelectFieldProps = {
    name: string;
    control: Control<any>;
    rules: any;
    options: any[];
    getOptionLabel: (option: any) => string;
    getOptionValue: (option: any) => any;
    errorObject: FieldErrors<any>;
    isDisabled?: boolean;
    label: string;
    defaultValue?: string | number,
};

const SelectField: React.FC<SelectFieldProps> = ({
    name,
    control,
    rules,
    options,
    getOptionLabel,
    getOptionValue,
    errorObject,
    defaultValue = "",
    isDisabled = false,
    label,
}) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            defaultValue={defaultValue}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error} disabled={isDisabled}>
                    <InputLabel id={`${name}-label`}>{label}</InputLabel>
                    <Select
                        labelId={`${name}-label`}
                        id={`${name}-select`}
                        label={label}
                        onChange={onChange}
                        value={value}
                    >
                        {options.length > 0 &&
                            options.map((option) => (
                                <MenuItem
                                    key={getOptionValue(option)}
                                    value={getOptionValue(option)}
                                >
                                    {getOptionLabel(option)}
                                </MenuItem>
                            ))}
                    </Select>
                    <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
            )}
        />
    );
};

export default SelectField;
