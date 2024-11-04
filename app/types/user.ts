import { Types } from "mongoose";

// type of the user in the database
export type TypeUserDb = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: number;
  createdAt: Date;
  // TOTP
  totpEnabled: boolean;
  totpSecretKey: string | null;
}

// user type that is exposed to client side
export type TypeUserClient = {
  name: string;
  email: string;
  role: number;  // 
  id: string;
  iat?: number;   // issued at
  exp?: number;   // expiration
  totpEnabled: boolean;
  // not exposing totpSecretKey to client side
}

export type JwtPayloadType = {
  email: string;
  role: number;
  userId: string;
  exp: number;
  totpEnabled: boolean;
  totpDone: boolean;
}
