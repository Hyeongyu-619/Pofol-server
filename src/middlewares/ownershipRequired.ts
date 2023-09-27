import { NextFunction, Response } from "express";
import { projectStudyService } from "../services/projectStudyService";
import { portfolioService } from "../services/portfolioService";

const ownershipRequired = (type: "projectStudy" | "portfolio") => {
  return async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const itemId =
        type === "projectStudy"
          ? req.params.projectStudyId
          : req.params.portfolioId;
      const userId = req.currentUser._id.toString();
      let item;

      if (type === "projectStudy") {
        item = await projectStudyService.getProjectStudyById(itemId);
      } else if (type === "portfolio") {
        item = await portfolioService.getPortfolioById(itemId);
      }

      if (!item) {
        return next(new Error(`${type}을(를) 찾을 수 없습니다.`));
      }

      if (item.ownerId.toString() !== userId) {
        return next(new Error(`이 ${type}을(를) 수정할 권한이 없습니다.`));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export { ownershipRequired };
