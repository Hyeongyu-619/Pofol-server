import { Schema } from "mongoose";

const PortfolioSchema = new Schema(
  {
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
