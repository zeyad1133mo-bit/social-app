 import { IUser } from "../interface/interface";
 import { JwtPayload } from "jsonwebtoken";
 export declare module 'express-serve-static-core' {
    interface Request {
        user?: Partial<IUser> & JwtPayload;
    }
}