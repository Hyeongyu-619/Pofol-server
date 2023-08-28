import { Router } from "express";
import {
  userRouter,
  authRouter,
  portfolioRouter,
  projectStudyRouter,
  adminRouter,
} from "./api/index";
import { loginRequired, adminRequired } from "../middlewares";

const apiRouter = Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/portfolio", portfolioRouter);
apiRouter.use("/projectStudy", projectStudyRouter);
apiRouter.use("/admin", adminRouter);

export { apiRouter };
