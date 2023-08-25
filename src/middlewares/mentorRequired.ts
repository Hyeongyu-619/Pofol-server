import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userService";

async function mentorRequired(req: any, res: Response, next: NextFunction) {
  const mentorId = req.currentUserId;

  if (!mentorId) {
    const error = new Error("유저 ID가 존재하지 않습니다.");
    error.name = "Unauthorized";
    return next(error);
  }

  const mentorInfo = await userService.getUserById(mentorId);
  if (!mentorInfo) {
    const error = new Error("멘토 정보를 찾을 수 없습니다.");
    error.name = "NotFound";
    return next(error);
  }

  if (mentorInfo.role !== "mentor") {
    const error = new Error("멘토 권한이 없습니다.");
    error.name = "Unauthorized";
    return next(error);
  }

  next();
}

export { mentorRequired };
