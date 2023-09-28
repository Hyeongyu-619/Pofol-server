import { Types } from "mongoose";

export interface UserInfo {
  name: string;
  email: string;
  nickName: string;
  position: string;
  role: string;
  profileImageUrl?: string;
  techStack?: string;
  career?: number;
  company?: string;
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  coachingCount?: number;
}

export interface UserData extends UserInfo {
  _id: Types.ObjectId;
}
