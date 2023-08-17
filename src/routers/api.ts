import { Router } from "express";
import { userRouter } from "./api/index";
import { loginRequired, adminRequired } from "../middlewares";

const apiRouter = Router();

apiRouter.use("/users", userRouter);

export { apiRouter };
