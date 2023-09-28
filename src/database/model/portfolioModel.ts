import mongoose, { Document, Types, model } from "mongoose";
import { Portfolio } from "..";
import {
  PortfolioInfo,
  PortfolioData,
  CommentInfo,
  MentoringRequestData,
} from "../../types/portfolioTypes";
import { PortfolioSchema } from "../schema/portfolioSchema";

export class PortfolioModel {
  async findByTitle(title: string): Promise<PortfolioData | null> {
    try {
      const portfolio: PortfolioData | null = await Portfolio.findOne({
        title,
      }).lean();
      return portfolio;
    } catch (error) {
      throw new Error("제목을 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findById(_id: string): Promise<PortfolioData> {
    try {
      const portfolio: PortfolioData | null = await Portfolio.findById({
        _id,
      }).lean();
      if (!portfolio) {
        const error = new Error(
          "해당하는 id의 포트폴리오 멘토링 신청서가 존재하지 않습니다."
        );
        error.name = "NotFound!";
        throw error;
      }

      return portfolio;
    } catch (error) {
      throw new Error("포트폴리오를 찾는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findByOwnerId(ownerId: string): Promise<PortfolioData | null> {
    try {
      const portfolio: PortfolioData | null = await Portfolio.findOne({
        ownerId,
      }).lean();
      return portfolio;
    } catch (error) {
      throw new Error("포트폴리오를 찾는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findMentoringRequestsById(
    _id: string
  ): Promise<MentoringRequestData[]> {
    try {
      const portfolio = await Portfolio.findById(_id)
        .select("mentoringRequests")
        .lean();

      if (!portfolio) {
        const error = new Error(
          "해당하는 id의 포트폴리오가 존재하지 않습니다."
        );
        error.name = "NotFound!";
        throw error;
      }

      return portfolio.mentoringRequests as MentoringRequestData[];
    } catch (error) {
      throw new Error("멘토링 요청을 불러오는 데 실패했습니다.", {
        cause: error,
      });
    }
  }

  async findByPosition(
    position: string,
    sortQuery: any = {},
    limit: number,
    skip: number
  ): Promise<{ portfolios: PortfolioInfo[]; total: number }> {
    try {
      const portfolios = await Portfolio.find({ position })
        .sort({ ...sortQuery, createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean<PortfolioInfo[]>();
      const total = await Portfolio.find({ position }).countDocuments();
      return { portfolios, total };
    } catch (error) {
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findAll(sortQuery: any = {}): Promise<PortfolioInfo[]> {
    try {
      const portfolios = await Portfolio.find()
        .sort({ ...sortQuery, createdAt: -1 })
        .lean<PortfolioInfo[]>();
      return portfolios;
    } catch (error) {
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findCommentsById(
    id: string,
    limit: number,
    skip: number
  ): Promise<{ comments: CommentInfo[]; total: number }> {
    try {
      const totalAggregation = await Portfolio.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: "$comments" },
        { $count: "total" },
      ]);

      const total = totalAggregation[0]?.total ?? 0;

      const commentsAggregation = await Portfolio.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: "$comments" },
        { $sort: { "comments.createdAt": -1 } },
        { $skip: skip },
        { $limit: limit },
        { $group: { _id: "$_id", comments: { $push: "$comments" } } },
      ]);

      const comments = commentsAggregation[0]?.comments ?? [];

      return { comments, total };
    } catch (error) {
      throw new Error("댓글을 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findAllPortfolio(
    sortQuery: any = {},
    limit: number,
    skip: number
  ): Promise<{ portfolios: PortfolioInfo[]; total: number }> {
    try {
      const portfolios = await Portfolio.find()
        .sort({ ...sortQuery, createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean<PortfolioInfo[]>();
      const total = await Portfolio.countDocuments();
      return { portfolios, total };
    } catch (error) {
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findPortfoliosByOwnerId(query: any): Promise<PortfolioInfo[]> {
    try {
      const portfolios = await Portfolio.find(query)
        .sort({ createdAt: -1 })
        .lean<PortfolioInfo[]>();
      return portfolios;
    } catch (error) {
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findPortfoliosByCoachingCountAndPosition(
    position: string,
    limit: number
  ): Promise<PortfolioInfo[]> {
    try {
      return Portfolio.find({ position: position })
        .sort({ coachingCount: -1, createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      throw new Error("포트폴리오를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findPortfoliosByCoachingCount(limit: number): Promise<PortfolioInfo[]> {
    try {
      return Portfolio.find()
        .sort({ coachingCount: -1, createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      throw new Error("포트폴리오를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async create(portfolioInfo: PortfolioInfo): Promise<PortfolioData> {
    try {
      const createdPortfolio = await Portfolio.create(portfolioInfo);
      return createdPortfolio.toObject();
    } catch (error) {
      throw new Error("포트폴리오를 생성하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async update(
    _id: string,
    update: Partial<PortfolioInfo>
  ): Promise<PortfolioData> {
    try {
      const filter = { _id };
      const option = { new: true };
      const updatedPortfolio: PortfolioData | null =
        await Portfolio.findOneAndUpdate(filter, update, option).lean();

      if (!updatedPortfolio) {
        const error = new Error(
          "포트폴리오 멘토링 신청서 정보 업데이트에 실패하였습니다."
        );
        error.name = "NotFound";
        throw error;
      }
      return updatedPortfolio;
    } catch (error) {
      throw new Error("포트폴리오를 업데이트 하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async deletePortfolio(_id: string): Promise<PortfolioData | null> {
    try {
      const deletedPortfolio: PortfolioData | null =
        await Portfolio.findOneAndDelete({ _id }).lean();
      if (!deletedPortfolio) {
        throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
      }
      return deletedPortfolio;
    } catch (error) {
      throw new Error("포트폴리오를 삭제하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }
  async handleMentoringRequestResponse(
    portfolioId: string,
    requestId: Types.ObjectId,
    status: "completed" | "rejected",
    message?: string,
    advice?: string
  ): Promise<PortfolioData> {
    try {
      const portfolio = await Portfolio.findById(portfolioId);
      if (!portfolio || !portfolio.mentoringRequests) {
        const error = new Error(
          "해당 포트폴리오나 멘토링 요청이 존재하지 않습니다."
        );
        error.name = "NotFound";
        throw error;
      }

      const requestIndex = portfolio.mentoringRequests.findIndex(
        (request: any) => request._id === requestId
      );

      if (requestIndex === -1) {
        const error = new Error("해당 멘토링 요청이 존재하지 않습니다.");
        error.name = "NotFound";
        throw error;
      }
      if (message !== undefined) {
        portfolio.mentoringRequests[requestIndex].message = message;
      }

      if (advice !== undefined) {
        portfolio.mentoringRequests[requestIndex].advice = advice;
      }
      portfolio.mentoringRequests[requestIndex].status = status;

      await portfolio.save();
      return portfolio.toObject();
    } catch (error) {
      throw new Error("멘토링 요청을 처리 하는 중에 오류가 발생했습니다. ", {
        cause: error,
      });
    }
  }
  async updateMentoringRequestStatus(
    portfolioId: string,
    requestId: Types.ObjectId,
    newStatus: "requested" | "accepted" | "completed" | "rejected" | "canceled"
  ): Promise<PortfolioData> {
    try {
      const portfolio = await Portfolio.findById(portfolioId);

      if (!portfolio) {
        const error = new Error(
          "해당하는 id의 포트폴리오가 존재하지 않습니다."
        );
        error.name = "NotFound";
        throw error;
      }

      if (newStatus === "completed") {
        if (portfolio.coachingCount) {
          portfolio.coachingCount += 1;
        }
      }

      const request = portfolio.mentoringRequests.id(requestId);
      if (!request) {
        const error = new Error(
          "해당하는 id의 멘토링 요청이 존재하지 않습니다."
        );
        error.name = "NotFound";
        throw error;
      }
      if (!request.portfolioId) {
        request.portfolioId = new Types.ObjectId(portfolioId);
      }

      request.status = newStatus;

      await portfolio.save();
      return portfolio.toObject();
    } catch (error) {
      throw new Error("멘토링 요청을 업데이트 하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }
}
const portfolioModel = model<PortfolioInfo & Document>(
  "Portfolio",
  PortfolioSchema
);
export default portfolioModel;
