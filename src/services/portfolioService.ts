import { Types } from "mongoose";
import { PortfolioModel } from "../database/model/portfolioModel";
import {
  PortfolioInfo,
  PortfolioData,
  CommentData,
  CommentInfo,
  MentoringRequestData,
  MentoringRequestInfo,
} from "../types/portfolio";
import { validation } from "../utils/validation";
import { userService } from "./userService";

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
      const error = new Error("해당 멘토가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }
    return portfolio;
  }

  async getMentoringRequestsByOwnerAndUser(
    ownerId: string,
    userId: string,
    status?: string
  ): Promise<MentoringRequestInfo[]> {
    const portfolio = await this.portfolioModel.findByOwnerId(ownerId);

    if (!portfolio) {
      const error = new Error("해당 ownerId의 포트폴리오가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    let filteredRequests: MentoringRequestInfo[] = portfolio.mentoringRequests;

    if (status) {
      filteredRequests = portfolio.mentoringRequests.filter(
        (request: MentoringRequestInfo) => {
          return request.status === status;
        }
      );
    }

    return filteredRequests;
  }
  async getMyMentoringRequests(
    userId: string,
    status?: string
  ): Promise<any[]> {
    const portfolios = await this.portfolioModel.findAll();
    const myMentoringRequests: any[] = [];

    portfolios.forEach((portfolio) => {
      let userRequests = portfolio.mentoringRequests.filter(
        (request: MentoringRequestInfo) =>
          request.userId.toString() === userId.toString()
      );

      if (status) {
        userRequests = userRequests.filter(
          (request: MentoringRequestInfo) => request.status === status
        );
      }

      const userRequestsWithPortfolioId = userRequests.map((request) => {
        return {
          ...request,
          portfolioId: portfolio._id,
        };
      });

      myMentoringRequests.push(...userRequestsWithPortfolioId);
    });

    return myMentoringRequests;
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

  async findAll(sortQuery: any = {}): Promise<PortfolioInfo[]> {
    try {
      const portfolios = await this.portfolioModel.findAll(sortQuery);
      return portfolios;
    } catch (error) {
      throw new Error();
    }
  }

  async findByPosition(
    position: string,
    sortQuery: any = {}
  ): Promise<PortfolioInfo[]> {
    try {
      const portfolios = await this.portfolioModel.findByPosition(
        position,
        sortQuery
      );
      return portfolios;
    } catch (error) {
      throw new Error();
    }
  }

  async findByQuery(query: any): Promise<PortfolioInfo[]> {
    try {
      const portfolios = await this.portfolioModel.findByQuery(query);
      return portfolios;
    } catch (error) {
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async addCommentToPortfolio(
    portfolioId: string,
    comment: CommentInfo
  ): Promise<PortfolioData> {
    const portfolio = await this.portfolioModel.findById(portfolioId);
    if (!portfolio) {
      const error = new Error("해당 멘토가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }
    if (!portfolio.comments) {
      portfolio.comments = [];
    }
    portfolio.comments.push(comment);
    return this.portfolioModel.update(portfolioId, portfolio);
  }

  async deleteCommentFromPortfolio(
    portfolioId: string,
    commentId: Types.ObjectId
  ): Promise<PortfolioData> {
    const portfolio = await this.portfolioModel.findById(portfolioId);
    if (!portfolio || !portfolio.comments) {
      const error = new Error("해당하는 멘토나 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    portfolio.comments = (portfolio.comments as CommentData[]).filter(
      (comment) => comment._id.toString() !== commentId.toString()
    );

    return this.portfolioModel.update(portfolioId, portfolio);
  }

  async updateCommentInPortfolio(
    portfolioId: string,
    commentId: Types.ObjectId,
    updatedComment: CommentInfo
  ): Promise<PortfolioData> {
    const portfolio = await this.portfolioModel.findById(portfolioId);
    if (!portfolio || !portfolio.comments) {
      const error = new Error("해당하는 멘토나 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    const commentIndex = (portfolio.comments as CommentData[]).findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );

    if (commentIndex === -1) {
      const error = new Error("해당 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    portfolio.comments[commentIndex] = updatedComment;
    return this.portfolioModel.update(portfolioId, portfolio);
  }

  async findTopMentorPortfoliosByPosition(
    userId: string
  ): Promise<PortfolioInfo[]> {
    try {
      const userPosition = await userService.getUserPositionById(userId);
      const portfolios =
        await this.portfolioModel.findPortfoliosByCoachingCountAndPosition(
          userPosition,
          5
        );
      return portfolios;
    } catch (error) {
      console.error(error);
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async findTopMentorPortfolios(): Promise<PortfolioInfo[]> {
    try {
      const portfolios =
        await this.portfolioModel.findPortfoliosByCoachingCount(4);
      return portfolios;
    } catch (error) {
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }
  async addMentoringRequestToPortfolio(
    portfolioId: string,
    mentoringRequest: any
  ): Promise<PortfolioData> {
    const portfolio = await this.portfolioModel.findById(portfolioId);
    if (!portfolio) {
      const error = new Error("해당 포트폴리오가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }
    if (!portfolio.mentoringRequests) {
      portfolio.mentoringRequests = [];
    }
    portfolio.mentoringRequests.push(mentoringRequest);
    return this.portfolioModel.update(portfolioId, portfolio);
  }

  // async updateMentoringRequestStatus(
  //   portfolioId: string,
  //   requestId: Types.ObjectId,
  //   status: "accepted" | "completed" // 추가로 필요한 status를 여기에 추가하세요
  // ): Promise<PortfolioData> {
  //   const portfolio = await this.portfolioModel.findById(portfolioId);
  //   if (!portfolio || !portfolio.mentoringRequests) {
  //     const error = new Error("해당 포트폴리오나 멘토링 요청이 존재하지 않습니다.");
  //     error.name = "NotFound";
  //     throw error;
  //   }

  //   const requestIndex = (portfolio.mentoringRequests as any[]).findIndex(
  //     (request) => request._id === requestId
  //   );

  //   if (requestIndex === -1) {
  //     const error = new Error("해당 멘토링 요청이 존재하지 않습니다.");
  //     error.name = "NotFound";
  //     throw error;
  //   }

  //   portfolio.mentoringRequests[requestIndex].status = status;
  //   return this.portfolioModel.update(portfolioId, portfolio);
  // }
}

const portfolioModelInstance = new PortfolioModel();
export const portfolioService = new PortfolioService(portfolioModelInstance);
