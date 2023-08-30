import { Schema } from "mongoose";

const MentoringRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "completed", "rejected"],
    default: "requested",
  },
  email: {
    type: String,
    required: true,
  },
  portfolioAddress: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const PortfolioSchema = new Schema(
  {
    mentoringRequests: [MentoringRequestSchema],
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    position: [
      {
        type: String,
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
    company: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      required: false,
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
        author: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        ownerId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
  },
  {
    collection: "portfolios",
    timestamps: true,
  }
);

export { PortfolioSchema };
