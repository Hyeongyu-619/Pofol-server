import { Types } from "mongoose";

export interface MentorRequestInfo {
  name: string;
  _id?: Types.ObjectId;
}

export interface MentorRequestData extends MentorRequestInfo {
  _id: Types.ObjectId;
}
