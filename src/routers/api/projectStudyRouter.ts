import { Router, Request, Response, NextFunction } from "express";
import { loginRequired, ownershipRequired } from "../../middlewares";
import { projectStudyService } from "../../services";
import { CommentInfo } from "../../types/projectStudy";
import { Types } from "mongoose";
import isCommentOwner from "../../middlewares/isCommentOwner";

const projectStudyRouter = Router();

projectStudyRouter.get(
  "/mypage",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.currentUser._id;
      const portfolios = await projectStudyService.findByOwnerId(ownerId);

      res.status(200).json(portfolios);
    } catch (error) {
      next(error);
    }
  }
);

projectStudyRouter.get(
  "/:projectStudyId",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { projectStudyId } = req.params;
      const projectStudy = await projectStudyService.getProjectStudyById(
        projectStudyId
      );
      res.status(200).json(projectStudy);
    } catch (error) {
      next(error);
    }
  }
);

projectStudyRouter.get(
  "/",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { classification, position } = req.query;
      const limit = Number(req.query.limit) || 6;
      const skip = Number(req.query.skip) || 0;
      let projectStudies;
      let total;

      if (classification || position) {
        [projectStudies, total] =
          await projectStudyService.findByClassificationAndPosition(
            classification,
            position,
            limit,
            skip
          );
      } else {
        [projectStudies, total] = await projectStudyService.findAllProjectStudy(
          limit,
          skip
        );
      }

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({ projectStudies, totalPages });
    } catch (error) {
      next(error);
    }
  }
);

projectStudyRouter.get(
  "/:projectStudyId/comments",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { projectStudyId } = req.params;
      const limit = Number(req.query.limit) || 10;
      const skip = Number(req.query.skip) || 0;

      const [comments, total] =
        await projectStudyService.getCommentsByProjectStudyId(
          projectStudyId,
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

projectStudyRouter.post(
  "/",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const newprojectStudy = req.body;
      const createdprojectStudy =
        await projectStudyService.addProjectStudyApplication(newprojectStudy);
      res.status(201).json(createdprojectStudy);
    } catch (error) {
      next(error);
    }
  }
);

projectStudyRouter.put(
  "/:projectStudyId",
  loginRequired,
  ownershipRequired("projectStudy"),
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { projectStudyId } = req.params;
      const updatedData = req.body;
      const updatedprojectStudy = await projectStudyService.updateProjectStudy(
        projectStudyId,
        updatedData
      );
      res.status(200).json(updatedprojectStudy);
    } catch (error) {
      next(error);
    }
  }
);

projectStudyRouter.delete(
  "/:projectStudyId",
  loginRequired,
  ownershipRequired("projectStudy"),
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

projectStudyRouter.post(
  "/:projectStudyId/comments",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { projectStudyId } = req.params;
      const comment: CommentInfo = req.body;
      const userId = req.currentUser._id;
      const projectStudy = await projectStudyService.getProjectStudyById(
        projectStudyId
      );
      const ownerId = projectStudy.ownerId;

      const updatedprojectStudy =
        await projectStudyService.addCommentToProjectStudy(
          projectStudyId,
          comment,
          userId,
          ownerId
        );
      res.status(201).json(updatedprojectStudy);
    } catch (error) {
      next(error);
    }
  }
);

projectStudyRouter.delete(
  "/:projectStudyId/comments/:commentId",
  loginRequired,
  isCommentOwner("projectStudy"),
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { projectStudyId, commentId } = req.params;
      const updatedprojectStudy =
        await projectStudyService.deleteCommentFromProjectStudy(
          projectStudyId,
          new Types.ObjectId(commentId)
        );
      res.status(200).json(updatedprojectStudy);
    } catch (error) {
      next(error);
    }
  }
);

projectStudyRouter.put(
  "/:projectStudyId/comments/:commentId",
  loginRequired,
  isCommentOwner("projectStudy"),
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

projectStudyRouter.get(
  "/recommend/latestprojectstudy",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const projectStudies =
        await projectStudyService.findLatestProjectStudies();
      res.status(200).json(projectStudies);
    } catch (error) {
      next(error);
    }
  }
);

projectStudyRouter.get(
  "/recommend/recommendProjectStudy",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const projectStudies =
        await projectStudyService.findTopMentorProjectStudiesByPosition(
          req.currentUser._id
        );
      res
        .status(200)
        .json({ projectStudies, nickName: req.currentUser.nickName });
    } catch (error) {
      next(error);
    }
  }
);
projectStudyRouter.get(
  "/recommend/recommendProjectStudyForGuest",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const allPositions = await projectStudyService.getAllPositions();
      const randomPosition =
        allPositions[Math.floor(Math.random() * allPositions.length)];
      const projectStudies =
        await projectStudyService.findTopMentorProjectStudiesByPosition(
          null,
          randomPosition
        );
      res.status(200).json({ projectStudies });
    } catch (error) {
      next(error);
    }
  }
);
export { projectStudyRouter };
