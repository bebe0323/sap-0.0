"use server";

import { totp, authenticator } from "otplib";
import { getJwtPayload, setAuthCookie } from "./auth";
import { connectMongoDb } from "./mongodb";
import mongoose from "mongoose";
import { UserModel } from "../models/User";
import { TypeUserDb } from "../types/user";

export async function totpUpdate(faChecked: boolean) {
  try {
    const jwtPayload = await getJwtPayload();

    if (!jwtPayload) {
      throw new Error("user doesn't have an userId");
    }

    // waiting until mongodb connection is established
    await connectMongoDb();
    // converting userId from string to mongoose BbjectId
    const userId = new mongoose.Types.ObjectId(jwtPayload.userId);

    // filter for user in the db
    const filter = { _id: userId };
    // update in the database
    let newTotpSecretKey = null;
    if (faChecked) { // adding totp in to the account
      // generate totp secret key for the user
      newTotpSecretKey = authenticator.generateSecret();
    }
    // fields to update in the database
    const update = { totpEnabled: faChecked, totpSecretKey: newTotpSecretKey };
    // updating the user in the database, { new: true } option will return the new updated user
    const res = await UserModel.findOneAndUpdate(filter, update, { new: true });
    setAuthCookie(res, true);

    return {
      success: true,
      message: "successfully updated",
      totpSecretKey: newTotpSecretKey,
    }

  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
        totpSecretKey: null,
      }
    } else {
      return {
        success: false,
        message: "An unexpected error occurred",
        totpSecretKey: null,
      }
    }
  }
}

export async function totpCheck(token: string | undefined) {
  try {
    const secondsSinceEpoch = Math.floor(Date.now() / 1000);
    console.log(secondsSinceEpoch);
    //
    if (!token) throw "empty token";
    const jwtPayload = await getJwtPayload();
    if (!jwtPayload) return false;
    await connectMongoDb();
    const userDb = await UserModel.findOne({ email: jwtPayload.email }).exec() as TypeUserDb | null;
    if (!userDb) {
      return false;
    }
    // console.log('user typed: ' + token);
    // console.log('db secretkey' + userDb.totpSecretKey);
    // const isValid = totp.check(token, userDb.totpSecretKey!);
    const serverToken = authenticator.generate(userDb.totpSecretKey!);
    // console.log('servertoken: ' + serverToken);
    return serverToken === token;
    // return isValid;
  } catch (err) {
    return false;
  }
}
