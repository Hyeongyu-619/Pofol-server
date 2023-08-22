import { PortfolioModel } from "../database/model/portfolioModel";
import { PortfolioInfo, PortfolioData } from "../types/portfolio";
import { validation } from "../utils/validation";

class PortfolioService {
  portfolioModel: PortfolioModel;

  constructor(portfolioModelArg: PortfolioModel) {
    this.portfolioModel = portfolioModelArg;
  }

  async addPortfolioApplication(
    portfolioInfo: PortfolioInfo
  ): Promise<PortfolioData> {
    validation.addPortfolioApplication(portfolioInfo);
    const createdNewPortfolio = await this.portfolioModel.create(portfolioInfo);
    return createdNewPortfolio;
  }

  async getPortfolioById(_id: string): Promise<PortfolioData> {
    const portfolio = await this.portfolioModel.findById(_id);
    if (!portfolio) {
      const error = new Error("해당 포트폴리오가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }
    return portfolio;
  }

  async updatePortfolio(
    _id: string,
    update: Partial<PortfolioInfo>
  ): Promise<PortfolioData> {
    const updatedPortfolio = await this.portfolioModel.update(_id, update);
    return updatedPortfolio;
  }

  async deletePortfolio(_id: string): Promise<PortfolioData | null> {
    const deletedPortfolio = await this.portfolioModel.deletePortfolio(_id);
    return deletedPortfolio;
  }

  async findAll(): Promise<PortfolioInfo[]> {
    try {
      const portfolios = await this.portfolioModel.findAll();
      return portfolios;
    } catch (error) {
      throw new Error("포트폴리오 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }
}

const portfolioModelInstance = new PortfolioModel();
export const portfolioService = new PortfolioService(portfolioModelInstance);
