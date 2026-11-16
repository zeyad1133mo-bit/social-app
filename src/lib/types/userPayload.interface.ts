import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../interface/interface";
export type TUserPayload = JwtPayload & Partial<IUser>;