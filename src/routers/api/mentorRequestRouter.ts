import { Router, Request, Response, NextFunction } from "express";
import { mentorRequestService } from "../../services";
import { adminRequired, loginRequired } from "../../middlewares";

const MentorRequestRouter = Router();

MentorRequestRouter.post(
  "/",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newMentorRequest = await mentorRequestService.addMentorRequest(
        req.body
      );
      res.status(201).json(newMentorRequest);
    } catch (error) {
      next(error);
    }
  }
);

MentorRequestRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const MentorRequests = await mentorRequestService.findAllMentorRequests();
      res.status(200).json(MentorRequests);
    } catch (error) {
      next(error);
    }
  }
);

MentorRequestRouter.put(
  "/:id",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedMentorRequest =
        await mentorRequestService.updateMentorRequest(req.params.id, req.body);
      res.status(200).json(updatedMentorRequest);
    } catch (error) {
      next(error);
    }
  }
);

MentorRequestRouter.delete(
  "/:id",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedMentorRequest =
        await mentorRequestService.deleteMentorRequest(req.params.id);
      res.status(200).json(deletedMentorRequest);
    } catch (error) {
      next(error);
    }
  }
);

export { MentorRequestRouter };
