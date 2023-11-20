import mongoose, { Schema } from "mongoose";

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
    profileImageUrl: {
      type: String,
      required: true,
      default:
        "https://cdn.discordapp.com/attachments/1115922422894440469/1145666135879073882/profileImage.png",
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
    career: {
      type: Number,
      required: false,
      default: 0,
    },
    company: {
      type: String,
      requried: false,
    },
    password: {
      type: String,
      required: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

const UserModel = mongoose.model("User", UserSchema);

export { UserModel };
