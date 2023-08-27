import { Router } from "express";
import {
  userRouter,
  authRouter,
  portfolioRouter,
  projectStudyRouter,
} from "./api/index";
import { loginRequired, adminRequired } from "../middlewares";

const apiRouter = Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/portfolio", portfolioRouter);
apiRouter.use("/projectStudy", projectStudyRouter);

export { apiRouter };
