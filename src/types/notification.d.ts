import { Types } from "mongoose";

export interface NotificationInfo {
  userId?: Types.ObjectId;
  _id?: Types.ObjectId;
  mentoringRequestStatus?: string;
  mentoringRequestId?: string;
  projectStudyId?: string;
  portfolioId?: string;
  mentorRequestStatus?: string;
  mentorRequestId?: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationData extends NotificationInfo {
  _id: Types.ObjectId;
}
