import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totpEnabled: {
    type: Boolean,
    default: false,
  },
  totpSecretKey: {
    type: String,
    default: null,
  }
});

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
