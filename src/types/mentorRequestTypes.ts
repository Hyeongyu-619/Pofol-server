import { Types } from "mongoose";

export interface MentorRequestInfo {
  userId: Types.ObjectId;
  status: "requested" | "accepted" | "rejected";
  name: string;
  nickName: string;
  career: number;
  company: string;
  position: string;
  email: string;
  authenticationImageUrl: string;
  _id?: Types.ObjectId;
}

export interface MentorRequestData extends MentorRequestInfo {
  _id: Types.ObjectId;
}
