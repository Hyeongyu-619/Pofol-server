import { Document, model } from "mongoose";
import { PositionInfo, PositionData } from "../../types/positionTypes";
import { PositionSchema } from "../schema/positionSchema";

export class PositionModel {
  async create(positionInfo: PositionInfo): Promise<PositionData> {
    try {
      const createdPosition = await Position.create(positionInfo);
      return createdPosition.toObject();
    } catch (error) {
      throw new Error("직무를 생성하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findAll(): Promise<PositionInfo[]> {
    try {
      const positions = await Position.find({}).lean();
      return positions;
    } catch (error) {
      throw new Error("모든 직무를 불러오는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findAllPositions(skip: number, limit: number): Promise<PositionInfo[]> {
    try {
      const positions = await Position.find().skip(skip).limit(limit).lean();
      return positions;
    } catch (error) {
      throw new Error("모든 직무를 페이징 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async update(
    _id: string,
    update: Partial<PositionInfo>
  ): Promise<PositionData> {
    try {
      const filter = { _id };
      const option = { returnOriginal: false, new: true };
      const updatedPosition = await Position.findOneAndUpdate(
        filter,
        update,
        option
      ).lean();

      if (!updatedPosition) {
        const error = new Error("직무 정보 업데이트에 실패하였습니다.");
        error.name = "NotFound";
        throw error;
      }
      return updatedPosition;
    } catch (error) {
      throw new Error("직무를 업데이트하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async deletePosition(_id: string): Promise<PositionData | null> {
    try {
      const deletedPosition = await Position.findOneAndDelete({ _id }).lean();
      if (!deletedPosition) {
        throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
      }
      return deletedPosition;
    } catch (error) {
      throw new Error("직무를 삭제하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async countAllPositions(): Promise<number> {
    try {
      return await Position.countDocuments().exec();
    } catch (error) {
      throw new Error("모든 직무의 수를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }
}

const Position = model<PositionInfo & Document>("Position", PositionSchema);
export default Position;
