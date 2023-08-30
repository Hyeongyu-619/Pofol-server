import { Schema } from "mongoose";

const MentorRequestSchema = new Schema({
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
  authenticationImageUrl: {
    type: String,
    required: true,
  },
});

export { MentorRequestSchema };
