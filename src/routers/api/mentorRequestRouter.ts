import { Router, Request, Response, NextFunction } from "express";
import { mentorRequestService } from "../../services";
import { adminRequired, loginRequired } from "../../middlewares";

const mentorRequestRouter = Router();

mentorRequestRouter.post(
  "/",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const currentUser = req.currentUser;
      const { career, company, authenticationImageUrl, status } = req.body;
      const { name, nickName, position, email } = currentUser;
      const userId = currentUser._id;

      const newMentorRequest = await mentorRequestService.addMentorRequest({
        name,
        email,
        nickName,
        career,
        company,
        position,
        authenticationImageUrl,
        userId,
        status,
      });

      res.status(201).json(newMentorRequest);
    } catch (error) {
      next(error);
    }
  }
);

mentorRequestRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit) || 10;
      const skip = Number(req.query.skip) || 0;
      const status = req.query.status as string;

      let mentorRequests, total;

      if (status) {
        [mentorRequests, total] =
          await mentorRequestService.findMentorRequestsByStatus(
            status,
            skip,
            limit
          );
      } else {
        [mentorRequests, total] =
          await mentorRequestService.findAllWithPagination(skip, limit);
      }

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        mentorRequests,
        total,
        totalPages,
        limit,
        skip,
      });
    } catch (error) {
      next(error);
    }
  }
);

mentorRequestRouter.get(
  "/:mentorRequestid",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { mentorRequestId } = req.params;
      const mentorRequest = await mentorRequestService.getMentorRequestById(
        mentorRequestId
      );
      res.status(200).json(mentorRequest);
    } catch (error) {
      next(error);
    }
  }
);

mentorRequestRouter.put(
  "/:id",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const updatedMentorRequest =
        await mentorRequestService.updateMentorRequest(
          req.params.id,
          req.body,
          req.params.id
        );
      res.status(200).json(updatedMentorRequest);
    } catch (error) {
      next(error);
    }
  }
);

mentorRequestRouter.delete(
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

mentorRequestRouter.get("/mentorRequest/status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const mentorRequest = await mentorRequestService.getMentorRequestById(id);
    if (mentorRequest) {
      return res.json({ status: mentorRequest.status });
    }
    return res.status(404).json({ message: "Not Found" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
});

export { mentorRequestRouter };
