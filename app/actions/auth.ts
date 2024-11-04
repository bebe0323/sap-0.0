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

export async function setAuthCookie(userDb: TypeUserDb, totpDone: boolean) {
  const newToken = await new SignJWT({
    email: userDb.email,
    userId: userDb._id,
    totpEnabled: userDb.totpEnabled,
    totpDone: totpDone,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('3h')
    .sign(SECRET);
  
  cookies().set("auth", newToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 3 * 3600 // 3 hours
  });
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
    console.log("SIGN-IN: " + email);

    if (userDb.totpEnabled) { // totp enabled but not completed
      console.log('totp enabled user');
      await setAuthCookie(userDb, false);
      return { success: true, totpDone: false };
    } else { // totp not enabled user
      await setAuthCookie(userDb, true);
      return { success: true, totpDone: true };
    }
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
  cookies().delete("auth");
}

export async function getJwtPayload() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth")?.value;
  if (!authCookie) return null;

  try {
    const { payload } = await jwtVerify(authCookie, SECRET) as { payload: JwtPayloadType};
    return payload;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
}
