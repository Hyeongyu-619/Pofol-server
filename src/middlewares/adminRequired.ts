import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userService";

async function adminRequired(req: any, res: Response, next: NextFunction) {
  // req.currentUser 는 loginRequired 미들웨어에서 설정해준 값입니다.
  const currentUser = req.currentUser;
  console.log(currentUser);

  if (!currentUser) {
    const error = new Error("유저 정보가 존재하지 않습니다.");
    error.name = "Unauthorized";
    return next(error);
  }

  if (currentUser.role !== "admin") {
    const error = new Error("관리자 권한이 없습니다.");
    error.name = "Unauthorized";
    return next(error);
  }
  console.log(currentUser);
  next();
}

export { adminRequired };
