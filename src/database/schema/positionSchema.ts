import { Schema } from "mongoose";

const PositionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export { PositionSchema };
