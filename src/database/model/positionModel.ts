import { Document, model } from "mongoose";
import { PositionInfo, PositionData } from "../../types/position";
import { PositionSchema } from "../schema/positionSchema";

export class PositionModel {
  async create(positionInfo: PositionInfo): Promise<PositionData> {
    const createdPosition = await Position.create(positionInfo);
    return createdPosition.toObject();
  }

  async findAll(): Promise<PositionInfo[]> {
    const positions = await Position.find({}).lean();
    return positions;
  }

  async findAllPositions(skip: number, limit: number): Promise<PositionInfo[]> {
    try {
      const positions = await Position.find().skip(skip).limit(limit).lean();
      return positions;
    } catch (error) {
      throw new Error("Positions could not be retrieved.");
    }
  }

  async update(
    _id: string,
    update: Partial<PositionInfo>
  ): Promise<PositionData> {
    const filter = { _id };
    const option = { returnOriginal: false, new: true };
    const updatedPosition = await Position.findOneAndUpdate(
      filter,
      update,
      option
    ).lean();

    if (!updatedPosition) {
      const error = new Error("포지션 정보 업데이트에 실패하였습니다.");
      error.name = "NotFound";
      throw error;
    }
    return updatedPosition;
  }

  async deletePosition(_id: string): Promise<PositionData | null> {
    const deletedPosition = await Position.findOneAndDelete({ _id }).lean();
    if (!deletedPosition) {
      throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
    }
    return deletedPosition;
  }

  async countAllPositions(): Promise<number> {
    return await Position.countDocuments().exec();
  }
}

const Position = model<PositionInfo & Document>("Position", PositionSchema);
export default Position;
