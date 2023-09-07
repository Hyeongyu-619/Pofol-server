import { Router, Request, Response, NextFunction } from "express";
import { loginRequired, ownershipRequired } from "../../middlewares";
import { portfolioService, userService } from "../../services";
import {
  CommentInfo,
  MentoringRequestInfo,
  PortfolioInfo,
} from "../../types/portfolio";
import { Types } from "mongoose";
import isCommentOwner from "../../middlewares/isCommentOwner";

const portfolioRouter = Router();

portfolioRouter.get(
  "/mypage",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.currentUser._id;

      const query = { ownerId };

      const portfolios = await portfolioService.findByQuery(query);
      res.status(200).json(portfolios);
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.get(
  "/mentor/mentoringRequests",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.currentUser._id;
      const status = req.query.status as string;

      const mentoringRequests =
        await portfolioService.getMentoringRequestsByOwnerAndUser(
          currentUserId,
          currentUserId,
          status
        );

      const userId = mentoringRequests.map((request) => request.userId);

      const userInfos = await Promise.all(
        userId.map((userId) => userService.getUserById(userId.toString()))
      );

      const result = mentoringRequests.map((request, index) => {
        return {
          mentoringRequest: request,
          userInfo: userInfos[index],
        };
      });

      res.status(200).json({ mentoringRequests, userInfos });
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.get(
  "/user/myMentoringRequests",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.currentUser._id;
      const status = req.query.status as string;

      const myMentoringRequests = await portfolioService.getMyMentoringRequests(
        userId,
        status
      );

      const ownerIds = myMentoringRequests.map((request) => request.ownerId);

      const UserInfos = await Promise.all(
        ownerIds.map((ownerId) => userService.getUserById(ownerId))
      );

      res.status(200).json({ myMentoringRequests, UserInfos });
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.post(
  "/mentor/respondToMentoringRequest/:portfolioId/:requestId",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const portfolioId = req.params.portfolioId;
      const mentoringRequestId = req.params.requestId;
      const message = req.body.message;
      const action = req.body.action;
      const advice = req.body.advice;
      const portfolio = await portfolioService.getMentoringById(
        portfolioId,
        mentoringRequestId
      );

      if (portfolio === null) {
        res.status(404).json({ message: "Portfolio not found" });
        return;
      }

      const userId = portfolio.userId;

      await portfolioService.respondToMentoringRequest(
        portfolioId,
        mentoringRequestId,
        action,
        userId,
        message,
        advice
      );

      res.status(200).json({ message: `Successfully ${action}d the request` });
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.post(
  "/updateMentoringRequest/:portfolioId/:requestId",
  loginRequired,
  async (req: any, res) => {
    try {
      const portfolioId = req.params.portfolioId;
      const mentoringRequestId = new Types.ObjectId(req.params.requestId);
      const { status } = req.body;

      const mentoringRequest = await portfolioService.getMentoringById(
        portfolioId,
        req.params.requestId
      );

      if (mentoringRequest === null) {
        res.status(404).json({ message: "mentoringRequestnot found" });
        return;
      }

      const userId = mentoringRequest.userId;

      const updatedPortfolio = await portfolioService.updateMentoringRequest(
        portfolioId,
        mentoringRequestId,
        status,
        userId
      );

      res.status(200).json({
        message: "Mentoring request updated successfully",
        data: updatedPortfolio,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

portfolioRouter.get(
  "/:portfolioId",
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

portfolioRouter.get(
  "/",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const category = req.query.category;
      const sort = req.query.sort || "newest";
      const limit = Number(req.query.limit) || 12;
      const skip = Number(req.query.skip) || 0;

      let sortQuery: any = {};

      if (sort === "newest") {
        sortQuery.createdAt = -1;
      } else if (sort === "popular") {
        sortQuery.coachingCount = -1;
        sortQuery.createdAt = -1;
      }

      let portfolios;
      let total;

      if (category) {
        [portfolios, total] = await portfolioService.findByPosition(
          category,
          sortQuery,
          limit,
          skip
        );
      } else {
        [portfolios, total] = await portfolioService.findAll(
          sortQuery,
          limit,
          skip
        );
      }

      const pages = Math.ceil(total / limit);

      res.status(200).json({
        data: portfolios,
        total,
        pages,
      });
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.get(
  "/:portfolioId/comments",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { portfolioId } = req.params;
      const limit = Number(req.query.limit) || 10;
      const skip = Number(req.query.skip) || 0;

      const [comments, total] = await portfolioService.getCommentsByPortfolioId(
        portfolioId,
        limit,
        skip
      );

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({ comments, totalPages, total });
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.post(
  "/",
  loginRequired,
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
  loginRequired,
  ownershipRequired("portfolio"),
  async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.body.mentoringRequests) {
        return res
          .status(400)
          .json({ message: "mentoringRequests cannot be modified directly." });
      }

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
  loginRequired,
  ownershipRequired("portfolio"),
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

portfolioRouter.post(
  "/:portfolioId/comments",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { portfolioId } = req.params;
      const userId = req.currentUser._id;
      const comment: CommentInfo = req.body;
      const portfolio = await portfolioService.getPortfolioById(portfolioId);
      const ownerId = portfolio.ownerId;

      const updatedPortfolio = await portfolioService.addCommentToPortfolio(
        portfolioId,
        comment,
        userId,
        ownerId
      );
      res.status(201).json(updatedPortfolio);
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.delete(
  "/:portfolioId/comments/:commentId",
  loginRequired,
  isCommentOwner("portfolio"),
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

portfolioRouter.put(
  "/:portfolioId/comments/:commentId",
  loginRequired,
  isCommentOwner("portfolio"),
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { portfolioId, commentId } = req.params;
      const updatedComment: CommentInfo = req.body;
      const updatedPortfolio = await portfolioService.updateCommentInPortfolio(
        portfolioId,
        new Types.ObjectId(commentId),
        updatedComment
      );
      res.status(200).json(updatedPortfolio);
    } catch (error) {
      next(error);
    }
  }
);
portfolioRouter.post(
  "/:portfolioId/mentoringRequests",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { portfolioId } = req.params;
      const userId = req.currentUser._id;
      const mentoringRequest = { ...req.body, userId };

      const updatedPortfolio =
        await portfolioService.addMentoringRequestToPortfolio(
          portfolioId,
          mentoringRequest,
          userId
        );
      res.status(201).json(updatedPortfolio);
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.get(
  "/recommend/recommendMentor",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const portfolios =
        await portfolioService.findTopMentorPortfoliosByPosition(
          req.currentUser._id
        );
      res.status(200).json({ portfolios, nickName: req.currentUser.nickName });
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.get(
  "/recommend/topMentor",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const portfolios = await portfolioService.findTopMentorPortfolios();
      res.status(200).json(portfolios);
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.get(
  "/portfolio/:portfolioId/mentoringRequest/:requestId/status",
  async (req, res) => {
    try {
      const { portfolioId, requestId } = req.params;
      const portfolio = await portfolioService.getPortfolioById(portfolioId);
      if (portfolio && portfolio.mentoringRequests) {
        const mentoringRequest: MentoringRequestInfo | undefined =
          portfolio.mentoringRequests.find(
            (req) => req._id?.toString() === requestId
          );

        if (mentoringRequest) {
          return res.json({ status: mentoringRequest.status });
        }
      }
      return res.status(404).json({ message: "Not Found" });
    } catch (err) {
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

portfolioRouter.get(
  "/portfolio/:portfolioId/mentoringRequest/:requestId/advice",
  async (req, res) => {
    try {
      const { portfolioId, requestId } = req.params;
      const portfolio = await portfolioService.getPortfolioById(portfolioId);
      if (portfolio && portfolio.mentoringRequests) {
        const mentoringRequest: MentoringRequestInfo | undefined =
          portfolio.mentoringRequests.find(
            (req) => req._id?.toString() === requestId
          );

        if (mentoringRequest) {
          return res.json({ advice: mentoringRequest.advice });
        }
      }
      return res.status(404).json({ message: "Not Found" });
    } catch (err) {
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

portfolioRouter.get(
  "/portfolio/:portfolioId/mentoringRequestCount",
  async (req, res) => {
    try {
      const { portfolioId } = req.params;
      const portfolio: PortfolioInfo = await portfolioService.getPortfolioById(
        portfolioId
      );

      if (portfolio) {
        return res.json({ count: portfolio.mentoringRequests.length });
      }

      return res.status(404).json({ message: "Not Found" });
    } catch (err) {
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

portfolioRouter.get("/portfolios/:id/comments", async (req, res) => {
  const portfolioId = req.params.id;
  const portfolio = await portfolioService.getPortfolioById(portfolioId);

  if (!portfolio) {
    return res.status(404).send("Portfolio not found");
  }

  res.status(200).json(portfolio.comments);
});

export { portfolioRouter };
