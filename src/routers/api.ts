import { Router } from "express";
import { userRouter, authRouter } from "./api/index";
import { loginRequired, adminRequired } from "../middlewares";

const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);

export { apiRouter };
