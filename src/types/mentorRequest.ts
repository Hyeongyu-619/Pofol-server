import { Types } from "mongoose";

export interface MentorRequestInfo {
  name: string;
  nickName: string;
  career: number;
  company: string;
  position: string;
  authenticationImageUrl: string;
  _id?: Types.ObjectId;
}

export interface MentorRequestData extends MentorRequestInfo {
  _id: Types.ObjectId;
}
