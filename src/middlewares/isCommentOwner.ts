import { Request, Response, NextFunction } from "express";
import { projectStudyService } from "../services/projectStudyService";
import { Types } from "mongoose";
import { portfolioService } from "../services/portfolioService";

const isCommentOwner = (resourceType: "projectStudy" | "portfolio") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).currentUser._id;
      const { projectStudyId, portfolioId, commentId } = req.params;
      const resourceId = projectStudyId || portfolioId;

      let resource;
      if (resourceType === "projectStudy") {
        resource = await projectStudyService.getProjectStudyById(resourceId);
      } else if (resourceType === "portfolio") {
        resource = await portfolioService.getPortfolioById(resourceId);
      } else {
        return res.status(400).json({ error: "잘못된 리소스 타입입니다." });
      }

      if (!resource) {
        return res
          .status(404)
          .json({ error: "해당하는 게시물이 존재하지 않습니다." });
      }

      const comment = resource.comments?.find((cmt) =>
        (cmt.ownerId as any).equals(userId)
      );

      if (!comment) {
        return res
          .status(404)
          .json({ error: "해당하는 댓글이 존재하지 않습니다." });
      }

      if (!(comment.ownerId as any).equals(userId)) {
        return res
          .status(403)
          .json({ error: "본인이 작성한 댓글만 수정/삭제할 수 있습니다." });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "서버 에러" });
    }
  };
};
export default isCommentOwner;
