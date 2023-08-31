import { Types } from "mongoose";

export interface MentoringRequestInfo {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  status: "requested" | "accepted" | "completed" | "rejected";
  email: string;
  portfolioAddress: string;
  title: string;
  content: string;
  message: string;
  advice: string;
}

export interface MentoringRequestData extends MentoringRequestInfo {
  _id: Types.ObjectId;
}

export interface PortfolioInfo {
  _id?: Types.ObjectId;
  ownerId: Types.ObjectId;
  mentoringRequests: MentoringRequestInfo[];
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
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentData extends CommentInfo {
  _id: Types.ObjectId;
}
