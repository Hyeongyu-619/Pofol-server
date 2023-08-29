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
      const userId = req.currentUser.id.toString();
      let item;

      if (type === "projectStudy") {
        item = await projectStudyService.getProjectStudyById(itemId);
      } else if (type === "portfolio") {
        item = await portfolioService.getPortfolioById(itemId);
      }

      if (!item) {
        res.status(404).send({ message: `${type} not found` });
        return;
      }

      if (item.ownerId.toString() !== userId) {
        res.status(403).send({
          message: `You do not have permission to modify this ${type}`,
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export { ownershipRequired };
