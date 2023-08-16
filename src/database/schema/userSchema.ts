import { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
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
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
    default: "default image URL", // 기본 프로필 사진
  },
});

export { UserSchema };
