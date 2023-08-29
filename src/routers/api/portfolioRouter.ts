import { Router, Request, Response, NextFunction } from "express";
import { loginRequired, ownershipRequired } from "../../middlewares";
import { portfolioService } from "../../services";
import { CommentInfo } from "../../types/portfolio";
import { Types } from "mongoose";
import isCommentOwner from "../../middlewares/isCommentOwner";

const portfolioRouter = Router();

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
      const portfolios = await portfolioService.findAll();
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
      const mentoringRequest = {
        userId: req.body.userId,
        status: "requested",
      };
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
// portfolioRouter.put(
//   "/:portfolioId/mentoringRequests/:requestId/complete",
//   loginRequired,
//   async (req: any, res: Response, next: NextFunction) => {
//     try {
//       const { portfolioId, requestId } = req.params;
//       const updatedPortfolio = await portfolioService.completeMentoringRequest(
//         portfolioId,
//         new Types.ObjectId(requestId)
//       );
//       res.status(200).json(updatedPortfolio);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// portfolioRouter.put(
//   "/:portfolioId/mentoringRequests/:requestId/accept",
//   loginRequired,
//   async (req: any, res: Response, next: NextFunction) => {
//     try {
//       const { portfolioId, requestId } = req.params;
//       const updatedPortfolio = await portfolioService.acceptMentoringRequest(
//         portfolioId,
//         new Types.ObjectId(requestId)
//       );
//       res.status(200).json(updatedPortfolio);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

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
