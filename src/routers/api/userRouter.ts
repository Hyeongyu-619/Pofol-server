import { Router, Request, Response, NextFunction } from "express";
import { loginRequired } from "../../middlewares";
import { userService } from "../../services";
import { validation } from "../../utils/validation";

const userRouter = Router();

userRouter.post(
  "/register",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { name, email, nickName, career, position, role, techStack } =
        req.body;
      const userInfo = {
        name,
        email,
        nickName,
        career,
        position,
        role,
        techStack,
      };
      const newUser = await userService.addUser(userInfo);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get(
  "/:naverEmail",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { naverEmail } = req.params;

      const userData = await userService.getUserByEmail(naverEmail);

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }
);

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

userRouter.get(
  "/profile/:userId",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const userData = await userService.getUserById(userId);

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.put(
  "/",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = validation.isLogin(req.currentUserId);
      const update = req.body;
      const updatedUser = await userService.setUser(userId, update);

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.delete(
  "/",
  loginRequired,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = validation.isLogin(req.currentUserId);
      const deleteResult = await userService.deleteUser(userId);

      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

export { userRouter };
