import { Gender } from "../../authentication/enum/enum";

export interface UpdateProfileDto {
    userName?: string;
    gender?: Gender;
    isPrivate?: boolean;
}