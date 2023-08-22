import { Router, Request, Response, NextFunction } from "express";
import { loginRequired } from "../../middlewares";
import { portfolioService } from "../../services";

const portfolioRouter = Router();

portfolioRouter.get(
  "/:portfolioId",
  // loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { portfolioId } = req.params;
      const portfolio = await portfolioService.getPortfolioById(portfolioId);
      res.status(200).json(portfolio);
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.post(
  "/",
  // loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const newPortfolio = req.body;
      const createdPortfolio = await portfolioService.addPortfolioApplication(
        newPortfolio
      );
      res.status(201).json(createdPortfolio);
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.put(
  "/:portfolioId",
  // loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { portfolioId } = req.params;
      const updatedData = req.body;
      const updatedPortfolio = await portfolioService.updatePortfolio(
        portfolioId,
        updatedData
      );
      res.status(200).json(updatedPortfolio);
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.delete(
  "/:portfolioId",
  // loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { portfolioId } = req.params;
      const deleteResult = await portfolioService.deletePortfolio(portfolioId);
      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

export { portfolioRouter };
