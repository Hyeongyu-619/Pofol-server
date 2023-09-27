import { Router } from "express";
import {
  userRouter,
  authRouter,
  portfolioRouter,
  projectStudyRouter,
  adminRouter,
  positionRouter,
  mentorRequestRouter,
  notificationRouter,
} from "./api/index";

const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/portfolios", portfolioRouter);
apiRouter.use("/projectStudies", projectStudyRouter);
apiRouter.use("/admins", adminRouter);
apiRouter.use("/positions", positionRouter);
apiRouter.use("/mentorRequests", mentorRequestRouter);
apiRouter.use("/notifications", notificationRouter);

export { apiRouter };
