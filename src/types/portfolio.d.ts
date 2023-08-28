import { Types } from "mongoose";

export interface MentoringRequest {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  career: number;
  authenticationImageUrl: string;
  status: "requested" | "accepted" | "completed";
}

export interface PortfolioInfo {
  _id?: Types.ObjectId;
  ownerId: string;
  mentoringRequests: MentoringRequest[];
  position: string;
  name: string;
  company: string;
  nickName: string;
  coachingCount: number;
  career: number;
  title: string;
  description: string;
  comments?: CommentInfo[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PortfolioData extends PortfolioInfo {
  _id: Types.ObjectId;
}

export interface CommentInfo {
  author: string;
  content: string;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentData extends CommentInfo {
  _id: Types.ObjectId;
}
