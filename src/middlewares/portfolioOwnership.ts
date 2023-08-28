import { NextFunction, Response } from "express";
import { portfolioService } from "../services/portfolioService";

export const PortfolioOwnership = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.currentUserId;

    const portfolio = await portfolioService.getPortfolioById(portfolioId);

    if (!portfolio) {
      return res.status(404).send({ message: "Portfolio not found" });
    }

    if (portfolio.ownerId.toString() !== userId) {
      return res.status(403).send({
        message: "You do not have permission to modify this portfolio",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
