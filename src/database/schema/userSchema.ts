import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
    },
    career: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
      default: "user",
    },
    profileImage: {
      type: String,
      required: false,
      default: "",
    },
    techStack: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export { UserSchema };
