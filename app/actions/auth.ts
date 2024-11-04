"use server";

import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from 'jose';

import { UserModel } from '../models/User';
import { connectMongoDb } from './mongodb';
import { JwtPayloadType, TypeUserDb } from '../types/user';

const saltRounds = 10;
const SECRET = new TextEncoder().encode(process.env.JSON_KEY!);

export async function signup(formData: FormData) {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (!email || !password) {
      throw new Error("Email or password is empty");
    }
    
    await connectMongoDb();
    console.log('signup');
    console.log(email, password);

    // checking is there an user with same email in the database
    const userDB = await UserModel.findOne({ email: email }).exec();
    if (userDB) {
      throw new Error("User with a given email exist");
    }

    // ecrypting password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    // storing in the database
    const newUser = new UserModel({
      email: email,
      password: hash,
      role: 0
    });
    await newUser.save();
    console.log('SIGNUP: ' + email);
    return { success: true };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message
      }
    } else {
      return {
        success: false,
        message: "An unexpected error occurred"
      }
    }
  }
}

export async function signin(formData: FormData) {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    
    if (!email || !password) {
      throw new Error("email or password is empty");
    }
    
    await connectMongoDb();
    const userDb = await UserModel.findOne({ email: email }).exec() as TypeUserDb | null;
    if (!userDb) {
      throw new Error("User does not exist");
    }


    // checking password
    const isUser = bcrypt.compareSync(password, userDb.password);

    if (!isUser) {
      throw new Error("Wrong password");
    }

    const newToken = await new SignJWT({
      email,
      role: userDb.role,
      userId: userDb._id,
      totpEnabled: userDb.totpEnabled,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(SECRET);
    

    (await cookies()).set("auth", newToken, {
      httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 // 1 hour
    });
    console.log("SIGN-IN: " + email);
    return { success: true };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message
      }
    } else {
      return {
        success: false,
        message: "An unexpected error occurred"
      }
    }
  }
}



export async function signout() {
  (await cookies()).delete("auth");
}

export async function getJwtPayload() {
  const cookieStore = cookies();
  const authCookie = (await cookieStore).get("auth")?.value;
  if (!authCookie) return null;

  try {
    const { payload } = await jwtVerify(authCookie, SECRET) as { payload: JwtPayloadType};
    // admins role is greater than 0
    return payload;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
}
