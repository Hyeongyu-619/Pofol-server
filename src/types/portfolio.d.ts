import { Types } from "mongoose";

export interface PortfolioInfo {
  position: string;
  name: string;
  company: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentData extends CommentInfo {
  _id: Types.ObjectId;
}
