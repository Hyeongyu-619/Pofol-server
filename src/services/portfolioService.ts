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
} from "../types/portfolioTypes";
import { validation } from "../utils/validation";
import { userService } from "./userService";
import { UserModel } from "../database/model/userModel";

type MentoringRequestWithPortfolioId = MentoringRequestInfo & {
  portfolioId: Types.ObjectId;
};
class PortfolioService {
  portfolioModel: PortfolioModel;
  notificationModel: NotificationModel;
  userModel: UserModel;

  constructor(
    portfolioModelArg: PortfolioModel,
    notificationModelArg: NotificationModel,
    userModelArg: UserModel
  ) {
    this.userModel = userModelArg;
    this.portfolioModel = portfolioModelArg;
    this.notificationModel = notificationModelArg;
  }

  async addPortfolioApplication(
    portfolioInfo: PortfolioInfo
  ): Promise<PortfolioData> {
    const existingPortfolio = await this.portfolioModel.findByOwnerId(
      portfolioInfo.ownerId.toString()
    );

    if (existingPortfolio) {
      const error = new Error("멘토링 신청 게시물은 하나만 작성 가능합니다.");
      error.name = "Conflict";
      throw error;
    }

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
      filteredRequests = filteredRequests.filter(
        (request: MentoringRequestInfo) => request.status === status
      );
    }

    const updatedRequests = filteredRequests.map((request) => {
      return {
        ...request,
        portfolioId: portfolio._id,
      };
    });

    return updatedRequests;
  }

  async getMyMentoringRequests(
    userId: string,
    status?: string
  ): Promise<MentoringRequestWithPortfolioId[]> {
    const portfolios = await this.portfolioModel.findAll();
    const myMentoringRequests: MentoringRequestWithPortfolioId[] = [];

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
        if (!portfolio._id) {
          throw new Error("해당하는 포트폴리오 ID가 존재하지 않습니다.");
        }
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

  async getAllPortfolio(
    sortQuery: any = {},
    limit: number,
    skip: number
  ): Promise<{ portfolios: PortfolioInfo[]; total: number }> {
    try {
      return await this.portfolioModel.findAllPortfolio(sortQuery, limit, skip);
    } catch (error) {
      throw new Error();
    }
  }

  async getByPosition(
    position: string,
    sortQuery: any = {},
    limit: number,
    skip: number
  ): Promise<{ portfolios: PortfolioInfo[]; total: number }> {
    try {
      const { portfolios, total } = await this.portfolioModel.findByPosition(
        position,
        sortQuery,
        limit,
        skip
      );
      return { portfolios, total };
    } catch (error) {
      throw new Error();
    }
  }

  async getCommentsByPortfolioId(
    id: string,
    limit: number,
    skip: number
  ): Promise<{ comments: CommentInfo[]; total: number }> {
    try {
      const { comments, total } = await portfolioModelInstance.findCommentsById(
        id,
        limit,
        skip
      );
      return { comments, total };
    } catch (error) {
      throw error;
    }
  }

  async getPortfolioByOwnerId(query: any): Promise<PortfolioInfo[]> {
    try {
      const portfolios = await this.portfolioModel.findPortfoliosByOwnerId(
        query
      );
      return portfolios;
    } catch (error) {
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async addCommentToPortfolio(
    portfolioId: string,
    comment: CommentInfo,
    userId: Types.ObjectId,
    ownerId: Types.ObjectId
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

    await this.notificationModel.create({
      userId: ownerId,
      content: "멘토링 신청서에 새로운 리뷰가 작성되었습니다.",
      portfolioId: portfolioId,
    });

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

  async getTopMentorPortfoliosByPosition(
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
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async getTopMentorPortfolios(): Promise<PortfolioInfo[]> {
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
    const statusMap: Record<"complete" | "reject", "completed" | "rejected"> = {
      complete: "completed",
      reject: "rejected",
    };

    const status = statusMap[action];

    if (status === undefined) {
      throw new Error("유효하지 않은 작업입니다.");
    }

    const updatedPortfolio =
      await this.portfolioModel.handleMentoringRequestResponse(
        portfolioId,
        requestId,
        status,
        message,
        advice
      );

    const actionComment = action === "complete" ? "수락" : "거절";

    await this.notificationModel.create({
      userId,
      content: `멘토링 신청이 ${actionComment}되었습니다.`,
      mentoringRequestStatus: action,
      mentoringRequestId: requestId.toString(),
      portfolioId: portfolioId,
    });

    return updatedPortfolio;
  }

  async getMentoringById(
    portfolioId: string,
    requestId: Types.ObjectId
  ): Promise<MentoringRequestInfo | null> {
    const portfolio = await this.portfolioModel.findById(portfolioId);
    if (!portfolio) {
      const error = new Error("해당 포트폴리오가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }
    if (!portfolio.mentoringRequests) {
      const error = new Error("이 포트폴리오에는 멘토링 요청이 없습니다.");
      error.name = "NotFound";
      throw error;
    }
    const mentoringRequest = portfolio.mentoringRequests.find(
      (request) => request?._id?.toString() === requestId.toString()
    );
    if (!mentoringRequest) {
      const error = new Error("해당 멘토링 요청을 찾을 수 없습니다.");
      error.name = "NotFound";
      throw error;
    }

    return mentoringRequest;
  }

  async updateMentoringRequest(
    portfolioId: string,
    requestId: Types.ObjectId,
    status: "requested" | "accepted" | "completed" | "rejected" | "canceled",
    userId: Types.ObjectId,
    mentorId: Types.ObjectId
  ): Promise<PortfolioData> {
    const updatedPortfolio =
      await this.portfolioModel.updateMentoringRequestStatus(
        portfolioId,
        requestId,
        status
      );
    console.log(status);

    if (status === "accepted") {
      const mentor = await this.userModel.findById(mentorId.toString());
      const portfolio = await this.portfolioModel.findById(portfolioId);
      if (mentor && mentor.coachingCount !== undefined)
        if (!portfolio) {
          throw new Error("포트폴리오를 찾을 수 없습니다.");
        }
      portfolio.coachingCount += 1;
      await this.portfolioModel.update(portfolioId, {
        coachingCount: portfolio.coachingCount,
      });
    }

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
const userModelInstance = new UserModel();
export const portfolioService = new PortfolioService(
  portfolioModelInstance,
  notificationModelInstance,
  userModelInstance
);
