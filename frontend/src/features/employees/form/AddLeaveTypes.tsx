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
    Tooltip,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { LeaveType } from "@/types/leave-types/LeaveType.type";
import { NewEmployeeLeaveType } from "@/types/employee/NewEmployeeLeaveType.type";
import DeleteIcon from "@mui/icons-material/Delete";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { SelectChangeEvent } from "@mui/material/Select";

interface Props {
    control: any;
    register: any;
    errors: any;
    getValues: any;
    setValue: any;
    leaveTypes: LeaveType[];
    initialData: NewEmployeeLeaveType[];
}

type HandleLeaveTypeChangeProps = {
    e: SelectChangeEvent;
    index: number;
    leaveTypes: any[]; // Replace with your leaveTypes type
    field: any; // Replace with the appropriate field type
};

export default function AddLeaveTypes({
    control,
    register,
    errors,
    getValues,
    leaveTypes,
    initialData,
    setValue,
}: Props) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "leave_types",
    });

    const currentYear = new Date().getFullYear();

    const handleLeaveTypeChange = ({
        e,
        index,
        leaveTypes,
        field,
    }: HandleLeaveTypeChangeProps) => {
        // Default React Hook Form onChange handler
        field.onChange(e);

        const selectedLeaveType = leaveTypes.find(
            (leaveType) => leaveType.id === e.target.value
        );
        setValue(
            `leave_types[${index}].allocated_leaves`,
            selectedLeaveType.leave_amount
        );
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // January is 0

        const totalMonths = 12;

        if (selectedLeaveType) {
            const totalLeaveAmount = selectedLeaveType.leave_amount;

            if (totalLeaveAmount !== null) {
                const leavesPerMonth = totalLeaveAmount / totalMonths;
                const availableLeaves = Math.floor(
                    (totalMonths - currentMonth + 1) * leavesPerMonth
                );
                
                setValue(
                    `leave_types[${index}].unavailable_leaves`,
                    totalLeaveAmount - availableLeaves
                );
            }
        }
    };

    return (
        <Box py={2}>
            <FlexBetween mb={3}>
                <Typography variant="h3">Leave Types</Typography>
                <Tooltip title="Add Leave Type">
                    <IconButton
                        onClick={() =>
                            append({
                                leave_type_id: "",
                                allocated_leaves: "",
                                used_leaves: 0,
                                year: currentYear,
                            })
                        }
                        style={{ marginTop: "8px" }}
                    >
                        <AddCircleIcon color="primary" />
                    </IconButton>
                </Tooltip>
            </FlexBetween>
            {fields.map((item, index) => {
                const selectedLeaveTypes = getValues("leave_types").map(
                    (type: any) => type.id
                );

                return (
                    <FlexBetween key={item.id}>
                        <Grid container spacing={2}>
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
                                    <InputLabel
                                        id={`leave-type-label-${index}`}
                                    >
                                        Leave Type
                                    </InputLabel>
                                    <Controller
                                        name={`leave_types[${index}].id`}
                                        rules={{ required: "Required value" }}
                                        control={control}
                                        defaultValue={
                                            initialData[index]?.leave_type_id ||
                                            ""
                                        }
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Leave Type"
                                                labelId={`leave-type-label-${index}`}
                                                onChange={(e) =>
                                                    handleLeaveTypeChange({
                                                        e,
                                                        index,
                                                        leaveTypes,
                                                        field,
                                                    })
                                                }
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
                                                            {leaveType.type}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        )}
                                    />
                                    <FormHelperText>
                                        {errors.leave_types &&
                                            errors.leave_types[index]?.id
                                                ?.message}
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
                                            helperText={
                                                fieldState.error?.message
                                            }
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
                                            errors.leave_types[index]
                                                ?.used_leaves
                                    )}
                                    helperText={
                                        errors.leave_types &&
                                        errors.leave_types[index]?.used_leaves
                                            ?.message
                                    }
                                />
                            </Grid>
                            <Grid item xs={9} md={2}>
                                <Controller
                                    name={`leave_types[${index}].unavailable_leaves`}
                                    control={control}
                                    defaultValue="" // or whatever your default value is
                                    rules={{ required: "Required value" }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            label="Unavailable Leaves"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            {...field}
                                            style={{ marginRight: "8px" }}
                                            error={Boolean(fieldState.error)}
                                            helperText={
                                                fieldState.error
                                                    ? fieldState.error.message
                                                    : null
                                            }
                                        />
                                    )}
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
                        </Grid>
                        <Tooltip title="Remove Field">
                            <IconButton onClick={() => remove(index)}>
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Tooltip>
                    </FlexBetween>
                );
            })}
        </Box>
    );
}
