import { Document, Types, model } from "mongoose";
import { ProjectStudy } from "..";
import {
  ProjectStudyInfo,
  ProjectStudyData,
  CommentData,
  CommentInfo,
} from "../../types/projectStudy";
import { ProjectStudySchema } from "../schema/projectStudySchema";

export class ProjectStudyModel {
  async findByTitle(title: string): Promise<ProjectStudyData | null> {
    const projectStudy: ProjectStudyData | null = await ProjectStudy.findOne({
      title,
    }).lean();
    return projectStudy;
  }

  async findById(_id: string): Promise<ProjectStudyData> {
    const projectStudy: ProjectStudyData | null = await ProjectStudy.findById({
      _id,
    }).lean();
    if (!projectStudy) {
      const error = new Error(
        "해당하는 id의 포트폴리오 멘토링 신청서가 존재하지 않습니다."
      );
      error.name = "NotFound!";
      throw error;
    }
    return projectStudy;
  }

  async findAll(): Promise<ProjectStudyInfo[]> {
    const projectStudys: ProjectStudyInfo[] = await projectStudyModel
      .find()
      .sort({ createdAt: -1 })
      .lean<ProjectStudyInfo[]>();
    return projectStudys;
  }

  async findByOwnerId(ownerId: string): Promise<ProjectStudyInfo[]> {
    const portfolios: ProjectStudyInfo[] = await ProjectStudy.find({ ownerId })
      .sort({ createdAt: -1 })
      .lean<ProjectStudyInfo[]>();
    return portfolios;
  }

  async findByClassificationAndPosition(query: {
    [key: string]: string;
  }): Promise<ProjectStudyInfo[]> {
    try {
      const portfolios = await ProjectStudy.find(query)
        .sort({ createdAt: -1 })
        .lean<ProjectStudyInfo[]>();
      return portfolios;
    } catch (error) {
      throw new Error("게시물을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  // async findByCategory(category: string): Promise<ProjectStudyInfo[]> {
  //   try {
  //     const portfolios = await ProjectStudy.find({ category: category })
  //       .sort({ createdAt: -1 })
  //       .lean<ProjectStudyInfo[]>();
  //     return portfolios;
  //   } catch (error) {
  //     throw new Error("게시물을 조회하는 중에 오류가 발생했습니다.");
  //   }
  // }

  // async findByPosition(position: string): Promise<ProjectStudyInfo[]> {
  //   try {
  //     const portfolios = await ProjectStudy.find({ position: position })
  //       .sort({ createdAt: -1 })
  //       .lean<ProjectStudyInfo[]>();
  //     return portfolios;
  //   } catch (error) {
  //     throw new Error("게시물을 조회하는 중에 오류가 발생했습니다.");
  //   }
  // }

  async findProjectStudiesByCreatedAt(
    limit: number
  ): Promise<ProjectStudyInfo[]> {
    return ProjectStudy.find().sort({ createdAt: -1 }).limit(limit).lean();
  }

  async create(projectStudyInfo: ProjectStudyInfo): Promise<ProjectStudyData> {
    const createdprojectStudy = await ProjectStudy.create(projectStudyInfo);
    return createdprojectStudy.toObject();
  }

  async update(
    _id: string,
    update: Partial<ProjectStudyInfo>
  ): Promise<ProjectStudyData> {
    const filter = { _id };
    const option = { returnOriginal: false, new: true };
    const updatedprojectStudy: ProjectStudyData | null =
      await ProjectStudy.findOneAndUpdate(filter, update, option).lean();

    if (!updatedprojectStudy) {
      const error = new Error(
        "포트폴리오 멘토링 신청서 정보 업데이트에 실패하였습니다."
      );
      error.name = "NotFound";
      throw error;
    }
    return updatedprojectStudy;
  }

  async deleteProjectStudy(_id: string): Promise<ProjectStudyData | null> {
    const deletedprojectStudy: ProjectStudyData | null =
      await ProjectStudy.findOneAndDelete({ _id }).lean();
    if (!deletedprojectStudy) {
      throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
    }
    return deletedprojectStudy;
  }
  async addCommentToprojectStudy(
    _id: string,
    comment: CommentInfo
  ): Promise<ProjectStudyData> {
    const projectStudy = await ProjectStudy.findById(_id);
    if (!projectStudy) {
      const error = new Error("해당 포트폴리오가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    projectStudy.comments.push({
      _id: new Types.ObjectId(),
      ...comment,
    });

    await projectStudy.save();
    return projectStudy.toObject();
  }

  async deleteCommentFromProjectStudy(
    projectStudyId: string,
    commentId: Types.ObjectId
  ): Promise<ProjectStudyData> {
    const projectStudy = await ProjectStudy.findById(projectStudyId);
    if (!projectStudy || !projectStudy.comments) {
      const error = new Error("해당 포트폴리오나 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    projectStudy.comments = projectStudy.comments.filter(
      (comment) => !comment._id?.equals(commentId)
    );
    await projectStudy.save();
    return projectStudy.toObject();
  }

  async updateCommentInprojectStudy(
    projectStudyId: string,
    commentId: Types.ObjectId,
    updatedComment: CommentInfo
  ): Promise<ProjectStudyData> {
    const projectStudy = await ProjectStudy.findById(projectStudyId);
    if (!projectStudy || !projectStudy.comments) {
      const error = new Error("해당 게시물이나 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    const commentIndex = projectStudy.comments.findIndex((comment) =>
      comment._id.equals(commentId)
    );
    if (commentIndex === -1) {
      const error = new Error("해당 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    projectStudy.comments[commentIndex] = {
      ...projectStudy.comments[commentIndex],
      ...updatedComment,
    };

    await projectStudy.save();
    return projectStudy.toObject();
  }
}

const projectStudyModel = model<ProjectStudyInfo & Document>(
  "ProjectStudy",
  ProjectStudySchema
);
export default projectStudyModel;
