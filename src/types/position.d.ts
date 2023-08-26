import { Types } from "mongoose";

export interface PositionInfo {
  name: string;
  _id?: Types.ObjectId;
}

export interface PositionData extends PositionInfo {
  _id: Types.ObjectId;
}
