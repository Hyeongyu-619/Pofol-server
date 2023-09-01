import { Router, Request, Response, NextFunction } from "express";
import { notificationService } from "../../services";
import { adminRequired, loginRequired } from "../../middlewares";

const notificationRouter = Router();

notificationRouter.get(
  "/",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const skip = Number(req.query.skip) || 0;

      const [notifications, total] =
        await notificationService.findAllNotificationsWithPagination(
          req.currentUser._id,
          skip,
          limit
        );

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        notifications,
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
