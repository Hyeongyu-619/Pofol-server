import { Document, Types, model } from "mongoose";
import { Portfolio } from "..";
import {
  PortfolioInfo,
  PortfolioData,
  CommentData,
  CommentInfo,
} from "../../types/portfolio";
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

  async findPortfoliosByCoachingCountAndPosition(
    position: string,
    limit: number
  ): Promise<PortfolioInfo[]> {
    return Portfolio.find({ position: position })
      .sort({ coachingCount: -1, createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async findPortfoliosByCoachingCount(limit: number): Promise<PortfolioInfo[]> {
    return Portfolio.find()
      .sort({ coachingCount: -1, createdAt: -1 })
      .limit(limit)
      .lean();
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
  async addCommentToPortfolio(
    _id: string,
    comment: CommentInfo
  ): Promise<PortfolioData> {
    const portfolio = await Portfolio.findById(_id);
    if (!portfolio) {
      const error = new Error("해당 포트폴리오가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    portfolio.comments.push({ _id: new Types.ObjectId(), ...comment });

    await portfolio.save();
    return portfolio.toObject();
  }

  async deleteCommentFromPortfolio(
    portfolioId: string,
    commentId: Types.ObjectId
  ): Promise<PortfolioData> {
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio || !portfolio.comments) {
      const error = new Error("해당 포트폴리오나 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    portfolio.comments = portfolio.comments.filter(
      (comment) => !comment._id?.equals(commentId)
    );
    await portfolio.save();
    return portfolio.toObject();
  }

  async updateCommentInPortfolio(
    portfolioId: string,
    commentId: Types.ObjectId,
    updatedComment: CommentInfo
  ): Promise<PortfolioData> {
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio || !portfolio.comments) {
      const error = new Error("해당 포트폴리오나 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    const commentIndex = portfolio.comments.findIndex((comment) =>
      comment._id.equals(commentId)
    );
    if (commentIndex === -1) {
      const error = new Error("해당 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    portfolio.comments[commentIndex] = {
      ...portfolio.comments[commentIndex],
      ...updatedComment,
    };

    await portfolio.save();
    return portfolio.toObject();
  }
}

const portfolioModel = model<PortfolioInfo & Document>(
  "Portfolio",
  PortfolioSchema
);
export default portfolioModel;
