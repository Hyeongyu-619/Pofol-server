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

  async getAllPositionsWithPagination(
    skip: number,
    limit: number
  ): Promise<[PositionInfo[], number]> {
    const positions = await this.positionModel.findAllPositions(skip, limit);
    const total = await this.positionModel.countAllPositions();
    return [positions, total];
  }
}

const positionModelInstance = new PositionModel();
export const positionService = new PositionService(positionModelInstance);
