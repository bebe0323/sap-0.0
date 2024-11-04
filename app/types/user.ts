import { Types } from "mongoose";

// type of the user in the database
export type TypeUserDb = {
  _id: Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  // TOTP
  totpEnabled: boolean;
  totpSecretKey: string | null;
}

// user type that is exposed to client side
export type TypeUserClient = {
  email: string;
  id: string;
  iat?: number;   // issued at
  exp?: number;   // expiration
  totpEnabled: boolean;
  // not exposing totpSecretKey to client side
}

export type JwtPayloadType = {
  email: string;
  userId: string;
  exp: number;
  totpEnabled: boolean;
  totpDone: boolean;
}
