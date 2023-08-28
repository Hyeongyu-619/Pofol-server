import { Types } from "mongoose";

export interface ProjectStudyInfo {
  _id?: Types.ObjectId;
  position: string;
  name: string;
  company: string;
  nickName: string;
  title: string;
  description: string;
  ownerId: Types.ObjectId;
  howContactTitle: "디스코드" | "오픈채팅" | "기타";
  howContactContent: string;
  process: "온라인" | "오프라인" | "온/오프라인";
  recruits: string;
  recruitsStatus: "모집중" | "모집마감";
  classification: "스터디" | "프로젝트";
  deadline: Date;
  comments?: CommentInfo[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectStudyData extends ProjectStudyInfo {
  _id: Types.ObjectId;
}

export interface CommentInfo {
  author: string;
  content: string;
  ownerId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentData extends CommentInfo {
  _id: Types.ObjectId;
}
