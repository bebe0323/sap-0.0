import { Types } from "mongoose";

// type of the user in the database
export type TypeUserDb = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: number;
  createdAt: Date;
}

// user type that is exposed to client side
export type UserClient = {
  name: string;
  email: string;
  role: number;  // 0 - worker, 1 - admin, 2-ultra admin
  id: string;
  iat?: number;   // issued at
  exp?: number;   // expiration
}

export type JwtPayloadType = {
  email: string;
  role: number;
  user_id: string;
  exp: number;
}
