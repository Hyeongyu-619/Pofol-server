import { Document, model } from "mongoose";
import { Portfolio } from "..";
import { PortfolioInfo, PortfolioData } from "../../types/portfolio";
import { PortfolioSchema } from "../schema/portfolioSchema";

export class PortfolioModel {
  async findByTitle(title: string): Promise<PortfolioData | null> {
    const portfolio = await Portfolio.findOne({ title }).lean();
    return portfolio;
  }

  async findById(_id: string): Promise<PortfolioData> {
    const portfolio = await Portfolio.findById({ _id }).lean();
    if (!portfolio) {
      const error = new Error(
        "해당하는 id의 포트폴리오 멘토링 신청서가 존재하지 않습니다."
      );
      error.name = "NotFound!";
      throw error;
    }
    return portfolio;
  }

  async findAll(): Promise<PortfolioInfo[]> {
    const portfolios = await Portfolio.find({}).lean();
    return portfolios;
  }

  async create(portfolioInfo: PortfolioInfo): Promise<PortfolioData> {
    const createdPortfolio = await Portfolio.create(portfolioInfo);
    return createdPortfolio.toObject();
  }

  async update(
    _id: string,
    update: Partial<PortfolioInfo>
  ): Promise<PortfolioData> {
    const filter = { _id };
    const option = { returnOriginal: false, new: true };
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      filter,
      update,
      option
    ).lean();

    if (!updatedPortfolio) {
      const error = new Error(
        "포트폴리오 멘토링 신청서 정보 업데이트에 실패하였습니다."
      );
      error.name = "NotFound";
      throw error;
    }
    return updatedPortfolio;
  }

  async deletePortfolio(_id: string): Promise<PortfolioData | null> {
    const deletedPortfolio = await Portfolio.findOneAndDelete({ _id }).lean();
    if (!deletedPortfolio) {
      throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
    }
    return deletedPortfolio;
  }
}

const portfolioModel = model<PortfolioInfo & Document>(
  "Portfolio",
  PortfolioSchema
);
export default portfolioModel;
