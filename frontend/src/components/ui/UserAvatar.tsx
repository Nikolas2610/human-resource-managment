import { Avatar } from "@mui/material";

export default function UserAvatar({ image, name }: UserAvatarProps) {
    if (image) {
        return <Avatar src={image} alt={name} />;
    }

    return <Avatar>{name.charAt(0).toUpperCase()}</Avatar>;
}

interface UserAvatarProps {
    name: string;
    image?: string | null;
}
