import {Gender} from "../enum/enum";

// contracts....

export interface RegisterDto {

    userName: string ;
    email: string ;
    password: string ;
    gender: Gender;
    phoneNumber: string ;
}

export interface LoginDto {
    email: string ;
    password: string ;
}


export interface SendOtpDto {
    email: string ;
}

export interface VerifyOtpDto {
    email: string ;
    code: string ;
}

export interface ForgotPasswordDto {
    email: string ;
    newPassword: string ;
    code: string ;
}