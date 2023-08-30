import { Schema } from "mongoose";

const MentorRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    required: true,
  },
  career: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  authenticationImageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "rejected"],
    default: "requested",
  },
});

export { MentorRequestSchema };
