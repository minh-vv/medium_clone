export class UserResponseDto {
    id: number;
    username: string;
    email: string;
    bio?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}
