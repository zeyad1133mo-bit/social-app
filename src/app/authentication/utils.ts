// import bcrypt from "bcrypt";
import argon2 from "argon2";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from "../../lib/config/env.js";
import { toMs } from "../../pkg/utils/time.js";
import { IUser } from "../../lib/interface/interface.js";
import { TUserPayload } from "../../lib/types/userPayload.interface.js";
import { Response } from "express";

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function comparePassword(password: string, hashedPassword:string) {
  return argon2.verify(hashedPassword, password);
}

export function generateAccessToken(payload: TUserPayload) {
  return jwt.sign(
    payload, env.jwt.accessSecret,
    { expiresIn: toMs(1, 'hours') }
  );
}

export function generateRefreshToken(payload: TUserPayload) {
  return jwt.sign(
    payload, env.jwt.refreshSecret,
    { expiresIn: toMs(7,'days') }
  );
}


export function setCookies(res:Response, accessToken: string, refreshToken: string) {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    maxAge: toMs(1, 'hours')
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    maxAge: toMs(7, 'days'),
    path: '/api/auth/refresh-token'
  });
}