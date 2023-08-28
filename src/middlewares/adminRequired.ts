import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userService";

async function adminRequired(req: any, res: Response, next: NextFunction) {
  const currentUser = req.currentUser;

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
  next();
}

export { adminRequired };
