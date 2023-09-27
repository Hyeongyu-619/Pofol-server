import { Document, Types, model } from "mongoose";
import { ProjectStudy } from "..";
import {
  ProjectStudyInfo,
  ProjectStudyData,
  CommentData,
  CommentInfo,
} from "../../types/projectStudy";
import { ProjectStudySchema } from "../schema/projectStudySchema";

interface QueryParams {
  classification?: string;
  position?: string;
}

export class ProjectStudyModel {
  async findByTitle(title: string): Promise<ProjectStudyData | null> {
    try {
      const projectStudy: ProjectStudyData | null = await ProjectStudy.findOne({
        title,
      }).lean();
      return projectStudy;
    } catch (error) {
      throw new Error("프로젝트/스터디를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findById(_id: string): Promise<ProjectStudyData> {
    try {
      const projectStudy: ProjectStudyData | null = await ProjectStudy.findById(
        {
          _id,
        }
      ).lean();
      if (!projectStudy) {
        const error = new Error(
          "해당하는 id의 프로젝트/스터디가 존재하지 않습니다."
        );
        error.name = "NotFound!";
        throw error;
      }
      return projectStudy;
    } catch (error) {
      throw new Error("프로젝트/스터디를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findAll(): Promise<ProjectStudyInfo[]> {
    try {
      const projectStudies: ProjectStudyInfo[] = await projectStudyModel
        .find()
        .sort({ createdAt: -1 })
        .lean<ProjectStudyInfo[]>();
      return projectStudies;
    } catch (error) {
      throw new Error(
        "모든 프로젝트/스터디를 조회하는 중에 오류가 발생했습니다.",
        { cause: error }
      );
    }
  }

  async findAllProjectStudy(
    limit: number,
    skip: number
  ): Promise<[ProjectStudyInfo[], number]> {
    try {
      const projectStudies: ProjectStudyInfo[] = await ProjectStudy.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean<ProjectStudyInfo[]>();

      const total = await ProjectStudy.countDocuments();

      return [projectStudies, total];
    } catch (error) {
      throw new Error(
        "모든 프로젝트/스터디를 페이징 조회하는 중에 오류가 발생했습니다.",
        {
          cause: error,
        }
      );
    }
  }

  async findCommentsById(
    id: string,
    limit: number,
    skip: number
  ): Promise<[CommentInfo[], number]> {
    try {
      const projectStudy: ProjectStudyData | null = await ProjectStudy.findById(
        id
      ).lean();

      if (!projectStudy) {
        const error = new Error(
          "해당하는 id의 프로젝트/스터디가 존재하지 않습니다."
        );
        error.name = "NotFound!";
        throw error;
      }
      const total = projectStudy.comments ? projectStudy.comments.length : 0;

      const reversedComments = projectStudy.comments
        ? [...projectStudy.comments].reverse()
        : [];

      const slicedComments = reversedComments
        ? reversedComments.slice(skip, skip + limit)
        : [];

      return [slicedComments, total];
    } catch (error) {
      throw new Error("댓글을 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findByOwnerId(ownerId: string): Promise<ProjectStudyInfo[]> {
    try {
      const projectStudies: ProjectStudyInfo[] = await ProjectStudy.find({
        ownerId,
      })
        .sort({ createdAt: -1 })
        .lean<ProjectStudyInfo[]>();
      return projectStudies;
    } catch (error) {
      throw new Error("프로젝트/스터디를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findByClassificationAndPosition(
    query: QueryParams,
    limit: number,
    skip: number
  ): Promise<[ProjectStudyInfo[], number]> {
    try {
      const projectStudies: ProjectStudyInfo[] = await ProjectStudy.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean<ProjectStudyInfo[]>();

      const total = await ProjectStudy.countDocuments(query);

      return [projectStudies, total];
    } catch (error) {
      throw new Error("프로젝트/스터디를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findProjectStudiesByLatestAndPosition(
    position: string,
    limit: number
  ): Promise<ProjectStudyInfo[]> {
    try {
      return ProjectStudy.find({ position: position })
        .sort({ coachingCount: -1, createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      throw new Error("프로젝트/스터디를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }
  async getAllPositions(): Promise<string[]> {
    try {
      const projectStudies = await ProjectStudy.find().lean();
      const positions = projectStudies.flatMap((projectStudy) => {
        return Array.isArray(projectStudy.position)
          ? projectStudy.position
          : [projectStudy.position];
      });

      projectStudies.forEach((projectStudy) => {
        if (Array.isArray(projectStudy.position)) {
          positions.push(...projectStudy.position);
        } else {
          positions.push(projectStudy.position);
        }
      });

      const uniquePositions = Array.from(new Set(positions));
      return uniquePositions;
    } catch (error) {
      throw new Error("직무 목록을 불러오는 중 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findProjectStudies(limit: number): Promise<ProjectStudyInfo[]> {
    try {
      return ProjectStudy.find().sort({ createdAt: -1 }).limit(limit).lean();
    } catch (error) {
      throw new Error("프로젝트/스터디를 생성하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async create(projectStudyInfo: ProjectStudyInfo): Promise<ProjectStudyData> {
    try {
      const createdprojectStudy = await ProjectStudy.create(projectStudyInfo);
      return createdprojectStudy.toObject();
    } catch (error) {
      throw new Error("프로젝트/스터디를 생성하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async update(
    _id: string,
    update: Partial<ProjectStudyInfo>
  ): Promise<ProjectStudyData> {
    try {
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
    } catch (error) {
      throw new Error(
        "프로젝트/스터디를 업데이트하는 중에 오류가 발생했습니다.",
        {
          cause: error,
        }
      );
    }
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
    try {
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
    } catch (error) {
      throw new Error(
        "프로젝트/스터디에 댓글을 생성하는 중에 오류가 발생했습니다.",
        {
          cause: error,
        }
      );
    }
  }

  async deleteCommentFromProjectStudy(
    projectStudyId: string,
    commentId: Types.ObjectId
  ): Promise<ProjectStudyData> {
    try {
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
    } catch (error) {
      throw new Error(
        "프로젝트/스터디에 댓글을 삭제하는 중에 오류가 발생했습니다.",
        {
          cause: error,
        }
      );
    }
  }

  async updateCommentInprojectStudy(
    projectStudyId: string,
    commentId: Types.ObjectId,
    updatedComment: CommentInfo
  ): Promise<ProjectStudyData> {
    try {
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
    } catch (error) {
      throw new Error(
        "프로젝트/스터디에 댓글을 업데이트하는 중에 오류가 발생했습니다.",
        {
          cause: error,
        }
      );
    }
  }
}

const projectStudyModel = model<ProjectStudyInfo & Document>(
  "ProjectStudy",
  ProjectStudySchema
);
export default projectStudyModel;
