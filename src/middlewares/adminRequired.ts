import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userService";

async function adminRequired(req: any, res: Response, next: NextFunction) {
  const adminId = req.currentUserId;

  if (!adminId) {
    const error = new Error("유저 ID가 존재하지 않습니다.");
    error.name = "Unauthorized";
    return next(error);
  }

  const adminInfo = await userService.getUserById(adminId);
  if (!adminInfo) {
    const error = new Error("관리자 정보를 찾을 수 없습니다.");
    error.name = "NotFound";
    return next(error);
  }

  if (adminInfo.role !== "admin") {
    const error = new Error("관리자 권한이 없습니다.");
    error.name = "Unauthorized";
    return next(error);
  }

  next();
}

export { adminRequired };
