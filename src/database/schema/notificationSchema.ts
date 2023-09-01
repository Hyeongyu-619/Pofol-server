import { Schema } from "mongoose";

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  mentoringRequestStatus: {
    type: String,
    required: false,
  },
  mentoringRequestId: {
    type: String,
    required: false,
  },
  projectStudyId: {
    type: String,
    required: false,
  },
  portfolioId: {
    type: String,
    required: false,
  },
  mentorRequestStatus: {
    type: String,
    required: false,
  },
  mentorRequestId: {
    type: String,
    required: false,
  },
});

export { NotificationSchema };
