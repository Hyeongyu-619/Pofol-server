import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userService } from "../services";

async function loginRequired(req: any, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token || token === "null") {
    return res.status(401).json({
      result: "Unauthorized",
      reason: "로그인한 유저만 사용할 수 있는 서비스입니다.",
    });
  }

  try {
    const decodedEmail = decodeURIComponent(req.cookies.email);
    // const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    // const decoded = jwt.verify(token, secretKey) as any;
    const user = await userService.getUserByEmail(decodedEmail);

    if (!user) {
      const error = new Error("등록된 회원이 아닙니다.");
      error.name = "Unauthorized";
      throw error;
    }

    req.currentUser = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      result: "Unauthorized",
      reason: "정상적인 토큰이 아닙니다.",
    });
  }
}

export { loginRequired };
