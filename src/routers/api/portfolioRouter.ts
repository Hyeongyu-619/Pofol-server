import { Router, Request, Response, NextFunction } from "express";
import { loginRequired, ownershipRequired } from "../../middlewares";
import { portfolioService } from "../../services";
import { CommentInfo } from "../../types/portfolio";
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
      const userId = req.currentUser._id;
      const status = req.query.status as string;

      const mentoringRequests =
        await portfolioService.getMentoringRequestsByOwnerAndUser(
          userId,
          userId,
          status
        );

      res.status(200).json(mentoringRequests);
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

      res.status(200).json(myMentoringRequests);
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
      const mentoringRequestId = req.params.requestid;
      const message = req.body.message;
      const action = req.body.action;

      await portfolioService.respondToMentoringRequest(
        portfolioId,
        mentoringRequestId,
        message,
        action
      );

      res.status(200).json({ message: `Successfully ${action}ed the request` });
    } catch (error) {
      next(error);
    }
  }
);

portfolioRouter.post(
  "/updateMentoringRequest/:portfolioId/:requestId",
  async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId;
      const mentoringRequestId = new Types.ObjectId(req.params.requestId); // 'new'를 추가
      const { status, message } = req.body;

      const updatedPortfolio = await portfolioService.updateMentoringRequest(
        portfolioId,
        mentoringRequestId,
        status,
        message
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

      let sortQuery: any = {};

      if (sort === "newest") {
        sortQuery.createdAt = -1;
      } else if (sort === "popular") {
        sortQuery.coachingCount = -1;
        sortQuery.createdAt = -1;
      }

      let portfolios;

      if (category) {
        portfolios = await portfolioService.findByPosition(category, sortQuery);
      } else {
        portfolios = await portfolioService.findAll(sortQuery);
      }

      res.status(200).json(portfolios);
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
      const comment: CommentInfo = req.body;
      const updatedPortfolio = await portfolioService.addCommentToPortfolio(
        portfolioId,
        comment
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
          mentoringRequest
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

export { portfolioRouter };
