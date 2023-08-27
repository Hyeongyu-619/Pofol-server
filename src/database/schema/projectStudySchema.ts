import { Schema } from "mongoose";

const ProjectStudySchema = new Schema(
  {
    position: [
      {
        type: String,
        enum: ["백엔드", "프론트엔드", "웹퍼블리셔", "안드로이드", "IOS"],
        required: true,
      },
    ],
    nickName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    howContactTitle: {
      type: String,
      enum: ["디스코드", "오픈채팅", "기타"],
      required: true,
    },
    howContactContent: {
      type: String,
      required: true,
    },
    process: {
      type: String,
      enum: ["온라인", "오프라인", "온/오프라인"],
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },

    comments: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
          auto: true,
        },
        requestId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        author: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    collection: "projectStudy",
    timestamps: true,
  }
);

export { ProjectStudySchema };
