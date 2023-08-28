import { NextFunction, Response } from "express";
import { projectStudyService } from "../services/projectStudyService";
import { portfolioService } from "../services/portfolioService";

export const ownershipCheck = (type: "projectStudy" | "portfolio") => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const itemId =
        type === "projectStudy"
          ? req.params.projectStudyId
          : req.params.portfolioId;
      const userId = req.currentUserId;
      let item;

      if (type === "projectStudy") {
        item = await projectStudyService.getProjectStudyById(itemId);
      } else if (type === "portfolio") {
        item = await portfolioService.getPortfolioById(itemId);
      }

      if (!item) {
        return res.status(404).send({ message: `${type} not found` });
      }

      if (item.ownerId.toString() !== userId) {
        return res.status(403).send({
          message: `You do not have permission to modify this ${type}`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
