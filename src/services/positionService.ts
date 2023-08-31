import { Types } from "mongoose";
import { PositionModel } from "../database/model/positionModel";
import { PositionInfo, PositionData } from "../types/position";

class PositionService {
  positionModel: PositionModel;

  constructor(positionModelArg: PositionModel) {
    this.positionModel = positionModelArg;
  }

  async addPosition(positionInfo: PositionInfo): Promise<PositionData> {
    const createdNewPosition = await this.positionModel.create(positionInfo);
    return createdNewPosition;
  }

  async updatePosition(
    _id: string,
    update: Partial<PositionInfo>
  ): Promise<PositionData> {
    const updatedPosition = await this.positionModel.update(_id, update);
    return updatedPosition;
  }

  async deletePosition(_id: string): Promise<PositionData | null> {
    const deletedPosition = await this.positionModel.deletePosition(_id);
    return deletedPosition;
  }

  async findAllPositions(): Promise<PositionInfo[]> {
    try {
      const positions = await this.positionModel.findAll();
      return positions;
    } catch (error) {
      throw new Error("포지션 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async findAllPositionsWithPagination(
    skip: number,
    limit: number
  ): Promise<PositionInfo[]> {
    try {
      const positions = await this.positionModel.findAllPositions(skip, limit);
      return positions;
    } catch (error) {
      console.error("An error occurred while fetching positions:", error);
      throw error;
    }
  }
}

const positionModelInstance = new PositionModel();
export const positionService = new PositionService(positionModelInstance);
