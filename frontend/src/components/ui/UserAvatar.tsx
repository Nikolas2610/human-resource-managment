import { Avatar } from "@mui/material";

export default function UserAvatar({ image, name }: UserAvatarProps) {
    return (
        <Avatar
            sx={{
                bgcolor: "white",
            }}
        >
            {image ? image : name.charAt(0)}
        </Avatar>
    );
}

interface UserAvatarProps {
    name: string;
    image?: string | null;
}
