import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userService";

async function adminRequired(req: any, res: Response, next: NextFunction) {
  const adminId = req.currentUserId;
  if (adminId) {
    const adminInfo = await userService.getUserById(adminId);
    next();
    if (adminInfo.role === "admin") {
      next();
    } else {
      const error = new Error("관리자 권한이 없습니다.");
      error.name = "Unauthorized";
      next(error);
    }
  }
}

export { adminRequired };
