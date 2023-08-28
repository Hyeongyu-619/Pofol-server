import { Router, Request, Response, NextFunction } from "express";
import { adminRequired, loginRequired } from "../../middlewares";
import { portfolioService, userService } from "../../services";
import { CommentInfo } from "../../types/portfolio";
import { Types } from "mongoose";

const adminRouter = Router();

adminRouter.get(
  "/user",
  loginRequired,
  adminRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const allUsers = await userService.findAll();
      console.log(allUsers);
      res.status(200).json(allUsers);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.put(
  "/user",
  loginRequired,
  adminRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.currentUserId;
      const update = req.body;
      const updatedUser = await userService.updateUser(userId, update);

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);
adminRouter.get(
  "/user/:email",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;

      const userData = await userService.getUserByEmail(email);

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }
);
adminRouter.delete(
  "/user/:userId",
  loginRequired,
  adminRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const userIdToDelete = req.params.userId;

      if (userIdToDelete === req.currentUserId) {
        return res
          .status(400)
          .send("You cannot delete your own account via this route.");
      }

      const deleteResult = await userService.deleteUser(userIdToDelete);

      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.get(
  "/portfolio/:portfolioId",
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

adminRouter.get(
  "/portfolio",
  adminRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const portfolios = await portfolioService.findAll();
      res.status(200).json(portfolios);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.put(
  "/portfolio/:portfolioId",
  loginRequired,
  adminRequired,
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

adminRouter.delete(
  "/portfolio/:portfolioId",
  loginRequired,
  adminRequired,
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

export { adminRouter };
