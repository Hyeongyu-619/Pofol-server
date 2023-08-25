import { Schema } from "mongoose";

const MentoringRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "completed"],
    default: "requested",
  },
});

const PortfolioSchema = new Schema(
  {
    mentoringRequests: [MentoringRequestSchema],
    position: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    career: {
      type: Number,
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
    coachingCount: {
      type: Number,
      required: false,
      default: 0,
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
        // createdAt: {
        //   type: Date,
        //   default: Date.now,
        // },
        // updatedAt: {
        //   type: Date,
        //   default: Date.now,
        // },
      },
    ],
  },
  {
    collection: "portfolios",
    timestamps: true,
  }
);

export { PortfolioSchema };
