import { Types } from "mongoose";
import { PortfolioModel } from "../database/model/portfolioModel";
import { NotificationModel } from "../database/model/notificationModel";
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
  notificationModel: NotificationModel;

  constructor(
    portfolioModelArg: PortfolioModel,
    notificationModelArg: NotificationModel
  ) {
    this.portfolioModel = portfolioModelArg;
    this.notificationModel = notificationModelArg;
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

  async getPortfolioByIdPopulate(_id: string): Promise<PortfolioData> {
    const portfolio = await (
      await this.portfolioModel.findById(_id)
    ).populate("comments");
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
    filteredRequests.forEach((request) => {
      request.portfolioId = portfolio._id;
    });

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
          message: request.message,
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

  async findAll(
    sortQuery: any = {},
    limit: number,
    skip: number
  ): Promise<[PortfolioInfo[], number]> {
    try {
      return await this.portfolioModel.findAllPortfolio(sortQuery, limit, skip);
    } catch (error) {
      throw new Error();
    }
  }

  async findByPosition(
    position: string,
    sortQuery: any = {},
    limit: number,
    skip: number
  ): Promise<[PortfolioInfo[], number]> {
    try {
      return await this.portfolioModel.findByPosition(
        position,
        sortQuery,
        limit,
        skip
      );
    } catch (error) {
      throw new Error();
    }
  }

  async getCommentsByPortfolioId(
    id: string,
    limit: number,
    skip: number
  ): Promise<[CommentInfo[], number]> {
    try {
      const [comments, total] = await portfolioModelInstance.findCommentsById(
        id,
        limit,
        skip
      );
      return [comments, total];
    } catch (error) {
      console.error("An error occurred while fetching comments:", error);
      throw error;
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
    mentoringRequest: any,
    userId: Types.ObjectId
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
    const ownerId = portfolio.ownerId;

    await this.notificationModel.create({
      userId: ownerId,
      content: "멘토링 신청 요청이 왔습니다!",
      portfolioId,
    });

    mentoringRequest.portfolioId = portfolioId;
    portfolio.mentoringRequests.push(mentoringRequest);
    return this.portfolioModel.update(portfolioId, portfolio);
  }

  async respondToMentoringRequest(
    portfolioId: string,
    requestId: Types.ObjectId,
    action: "complete" | "reject",
    userId: Types.ObjectId,
    message?: string,
    advice?: string
  ): Promise<PortfolioData> {
    let status: "completed" | "rejected";
    if (action === "complete") {
      status = "completed";
    } else if (action === "reject") {
      status = "rejected";
    } else {
      throw new Error("Invalid action");
    }

    const updatedPortfolio =
      await this.portfolioModel.respondToMentoringRequest(
        portfolioId,
        requestId,
        status,
        message,
        advice
      );

    await this.notificationModel.create({
      userId,
      content: `Your mentoring request has been ${action}ed.`,
      mentoringRequestStatus: action,
      mentoringRequestId: requestId.toString(),
      portfolioId: portfolioId,
    });

    return updatedPortfolio;
  }

  async updateMentoringRequest(
    portfolioId: string,
    requestId: Types.ObjectId,
    status: "requested" | "accepted" | "completed" | "rejected" | "canceled",
    userId: Types.ObjectId
  ): Promise<PortfolioData> {
    const updatedPortfolio =
      await this.portfolioModel.updateMentoringRequestStatus(
        portfolioId,
        requestId,
        status
      );

    await this.notificationModel.create({
      userId,
      content: `멘토링 신청서 상태가 변경되었습니다.`,
      mentoringRequestStatus: status,
      mentoringRequestId: requestId.toString(),
      portfolioId: portfolioId,
    });

    return updatedPortfolio;
  }
}

const portfolioModelInstance = new PortfolioModel();
const notificationModelInstance = new NotificationModel();
export const portfolioService = new PortfolioService(
  portfolioModelInstance,
  notificationModelInstance
);
