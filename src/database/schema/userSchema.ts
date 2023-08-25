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
      unique: true,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    profileImage: {
      type: String,
      required: false,
      default:
        "https://pofol-bucket.s3.ap-northeast-2.amazonaws.com/1692854421756_study.png",
    },
    techStack: {
      type: String,
      required: false,
    },
    coachingCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export { UserSchema };
