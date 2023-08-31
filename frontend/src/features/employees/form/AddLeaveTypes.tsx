import { Controller, useFieldArray } from "react-hook-form";
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    FormHelperText,
    Grid,
    Box,
    Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { LeaveType } from "@/types/leave-types/LeaveType.type";
import { NewEmployeeLeaveType } from "@/types/employee/NewEmployeeLeaveType.type";

interface Props {
    control: any;
    register: any;
    errors: any;
    getValues: any;
    setValue: any;
    leaveTypes: LeaveType[];
    initialData: NewEmployeeLeaveType[];
}

export default function AddLeaveTypes({
    control,
    register,
    errors,
    getValues,
    leaveTypes,
    initialData,
    setValue
}: Props) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "leave_types",
    });

    const currentYear = new Date().getFullYear();

    return (
        <Box py={2}>
            <Typography variant="h3">Leave Types</Typography>
            {fields.map((item, index) => {
                const selectedLeaveTypes = getValues("leave_types").map(
                    (type: any) => type.id
                );

                return (
                    <Grid
                        container
                        key={item.id}
                        spacing={2}
                        // sx={{  alignItems: "center" }}
                    >
                        <Grid item xs={12} md={2}>
                            <FormControl
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                style={{ marginRight: "8px" }}
                                error={Boolean(
                                    errors.leave_types &&
                                        errors.leave_types[index]?.id
                                )}
                            >
                                <InputLabel id={`leave-type-label-${index}`}>
                                    Leave Type
                                </InputLabel>
                                <Controller
                                    name={`leave_types[${index}].id`}
                                    rules={{ required: "Required value" }}
                                    control={control}
                                    defaultValue={
                                        initialData[index]?.leave_type_id || ""
                                    }
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Leave Type"
                                            labelId={`leave-type-label-${index}`}
                                            onChange={(e) => {
                                                field.onChange(e); // default React Hook Form's onChange handler
                                                const selectedLeaveType =
                                                    leaveTypes.find(
                                                        (leaveType) =>
                                                            leaveType.id ===
                                                            e.target.value
                                                    );
                                                if (selectedLeaveType) {
                                                    setValue(
                                                        `leave_types[${index}].allocated_leaves`,
                                                        selectedLeaveType.leave_amount
                                                    );
                                                }
                                            }}
                                        >
                                            {leaveTypes.map((leaveType) =>
                                                selectedLeaveTypes.includes(
                                                    leaveType.id
                                                ) &&
                                                field.value !==
                                                    leaveType.id ? null : (
                                                    <MenuItem
                                                        value={leaveType.id}
                                                        key={leaveType.id}
                                                    >
                                                        {leaveType.type +
                                                            " | " +
                                                            leaveType.leave_amount}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    )}
                                />
                                <FormHelperText>
                                    {errors.leave_types &&
                                        errors.leave_types[index]?.id?.message}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={9} md={2}>
                            <Controller
                                name={`leave_types[${index}].allocated_leaves`}
                                control={control}
                                rules={{ required: "Required value" }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        label="Default Leaves"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        {...field}
                                        style={{ marginRight: "8px" }}
                                        error={Boolean(fieldState.error)}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={9} md={2}>
                            <TextField
                                label="Used Leaves"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                {...register(
                                    `leave_types[${index}].used_leaves`,
                                    {
                                        required: "Required value",
                                    }
                                )}
                                style={{ marginRight: "8px" }}
                                error={Boolean(
                                    errors.leave_types &&
                                        errors.leave_types[index]?.used_leaves
                                )}
                                helperText={
                                    errors.leave_types &&
                                    errors.leave_types[index]?.used_leaves
                                        ?.message
                                }
                            />
                        </Grid>
                        <Grid item xs={9} md={2}>
                            <TextField
                                label="Unavailable Leaves"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                {...register(
                                    `leave_types[${index}].unavailable_leaves`,
                                    {
                                        required: "Required value",
                                    }
                                )}
                                style={{ marginRight: "8px" }}
                                error={Boolean(
                                    errors.leave_types &&
                                        errors.leave_types[index]
                                            ?.unavailable_leaves
                                )}
                                helperText={
                                    errors.leave_types &&
                                    errors.leave_types[index]
                                        ?.unavailable_leaves?.message
                                }
                            />
                        </Grid>

                        <Grid item xs={9} md={2}>
                            <TextField
                                label="Year"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                {...register(`leave_types[${index}].year`, {
                                    required: "Required value",
                                })}
                                style={{ marginRight: "8px" }}
                                error={Boolean(
                                    errors.leave_types &&
                                        errors.leave_types[index]?.year
                                )}
                                helperText={
                                    errors.leave_types &&
                                    errors.leave_types[index]?.year?.message
                                }
                            />
                        </Grid>
                        <Grid
                            item
                            xs={3}
                            md={1}
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <IconButton onClick={() => remove(index)}>
                                <RemoveCircleIcon color="error" />
                            </IconButton>
                        </Grid>
                    </Grid>
                );
            })}

            <FlexCenter>
                <IconButton
                    onClick={() =>
                        append({
                            leave_type_id: "",
                            allocated_leaves: "",
                            used_leaves: "",
                            year: currentYear,
                        })
                    }
                    style={{ marginTop: "8px" }}
                >
                    <AddCircleIcon color="primary" />
                </IconButton>
            </FlexCenter>
        </Box>
    );
}
