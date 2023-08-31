import { Router, Request, Response, NextFunction } from "express";
import { adminRequired, loginRequired } from "../../middlewares";
import {
  portfolioService,
  projectStudyService,
  userService,
} from "../../services";
import { CommentInfo } from "../../types/portfolio";
import { Types } from "mongoose";

const adminRouter = Router();

adminRouter.get(
  "/user",
  loginRequired,
  adminRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit) || 10;
      const skip = Number(req.query.skip) || 0;

      const allUsers = await userService.findAllWithPagination(skip, limit);

      res.status(200).json(allUsers);
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

adminRouter.put(
  "/user/:userId/role",
  loginRequired,
  adminRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const updatedUser = await userService.updateUserRole(userId, role);
      res.status(200).json(updatedUser);
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
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit) || 10;
      const skip = Number(req.query.skip) || 0;
      const sortQuery = { createdAt: -1 };

      const portfolios = await portfolioService.findAll(sortQuery, limit, skip);

      res.status(200).json(portfolios);
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
adminRouter.delete(
  "/:portfolioId/comments/:commentId",
  loginRequired,
  adminRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { portfolioId, commentId } = req.params;
      const updatedPortfolio =
        await portfolioService.deleteCommentFromPortfolio(
          portfolioId,
          new Types.ObjectId(commentId)
        );
      res.status(200).json(updatedPortfolio);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.get("/", async (req: any, res: Response, next: NextFunction) => {
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit) || 12;
      const skip = Number(req.query.skip) || 0;

      const projectStudies = await projectStudyService.findAllProjectStudy(
        limit,
        skip
      );

      res.status(200).json(projectStudies);
    } catch (error) {
      next(error);
    }
  };
});

adminRouter.delete(
  "/:projectStudyId",
  loginRequired,
  adminRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { projectStudyId } = req.params;
      const deleteResult = await projectStudyService.deleteProjectStudy(
        projectStudyId
      );
      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.put(
  "/:projectStudyId/comments/:commentId",
  loginRequired,
  adminRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { projectStudyId, commentId } = req.params;
      const updatedComment: CommentInfo = req.body;
      const updatedprojectStudy =
        await projectStudyService.updateCommentInProjectStudy(
          projectStudyId,
          new Types.ObjectId(commentId),
          updatedComment
        );
      res.status(200).json(updatedprojectStudy);
    } catch (error) {
      next(error);
    }
  }
);

export { adminRouter };
