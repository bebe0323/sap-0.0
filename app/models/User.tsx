import mongoose, { Model, Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
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
