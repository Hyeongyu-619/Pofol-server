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

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/portfolio", portfolioRouter);
apiRouter.use("/projectStudy", projectStudyRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/position", positionRouter);
apiRouter.use("/mentorRequest", mentorRequestRouter);
apiRouter.use("/notification", notificationRouter);

export { apiRouter };
