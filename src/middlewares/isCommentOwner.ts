import { Request, Response, NextFunction } from "express";
import { projectStudyService } from "../services/projectStudyService";
import { portfolioService } from "../services/portfolioService";

const isCommentOwner = (resourceType: "projectStudy" | "portfolio") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).currentUser._id;
      const { projectStudyId, portfolioId, commentId } = req.params;

      if (!projectStudyId && !portfolioId) {
        return next(
          new Error(
            "프로젝트/스터디 ID 또는 포트폴리오 ID가 존재하지 않습니다."
          )
        );
      }

      const resourceId = projectStudyId ?? portfolioId;

      let resource;
      if (resourceType === "projectStudy") {
        resource = await projectStudyService.getProjectStudyById(resourceId);
      } else if (resourceType === "portfolio") {
        resource = await portfolioService.getPortfolioById(resourceId);
      } else {
        return next(new Error("잘못된 리소스 타입입니다."));
      }

      if (!resource) {
        return next(new Error("해당하는 게시물이 존재하지 않습니다."));
      }

      const comment = resource.comments?.find(
        (cmt) => (cmt.ownerId as any) === userId
      );

      if (!comment) {
        return next(new Error("해당하는 댓글이 존재하지 않습니다."));
      }

      if (!(comment.ownerId as any) === userId) {
        return next(new Error("본인이 작성한 댓글만 수정/삭제할 수 있습니다."));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
export default isCommentOwner;
