import { Router, Request, Response, NextFunction } from "express";
import { loginRequired } from "../../middlewares";
import { userService } from "../../services";
import { validation } from "../../utils/validation";

const userRouter = Router();

userRouter.get(
  "/mypage",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = validation.isLogin(req.currentUserId);
      const myInfo = await userService.getUserById(userId);
      res.status(200).json(myInfo);
    } catch (error) {
      next(error);
    }
  }
);

export { userRouter };
