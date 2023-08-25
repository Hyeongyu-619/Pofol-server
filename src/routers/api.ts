import { Router } from "express";
import { userRouter, authRouter, portfolioRouter } from "./api/index";
import { loginRequired, adminRequired } from "../middlewares";

const apiRouter = Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/portfolio", portfolioRouter);

export { apiRouter };
