import crypto from "node:crypto";

export function generateOTPCode(){
    return crypto.randomInt(100000,99999).toString();
}