import { Router, Request, Response, NextFunction } from "express";
import { notificationService } from "../../services";
import { loginRequired } from "../../middlewares";

const notificationRouter = Router();

notificationRouter.get("/", loginRequired, async (req: any, res) => {
  try {
    const userId = req.currentUser._id;
    const skip = (req.query.skip, 0);
    const limit = (req.query.limit, 10);

    if (!userId || isNaN(skip) || isNaN(limit)) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const [notifications, total] =
      await notificationService.getAllNotificationsWithPagination(
        userId,
        skip,
        limit
      );

    res.status(200).json({ notifications, total });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

notificationRouter.delete(
  "/:id",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedNotification = await notificationService.deleteNotification(
        req.params.id
      );
      res.status(200).json(deletedNotification);
    } catch (error) {
      next(error);
    }
  }
);

export { notificationRouter };
