import { NextFunction, Request, Response } from "express";
import { userService } from "../services";
import jwt, { JwtPayload } from "jsonwebtoken";

function isJwtPayloadWithExpiration(
  token: string | JwtPayload
): token is JwtPayload & { exp: number } {
  return typeof token !== "string" && "exp" in token;
}

async function loginRequired(req: any, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token || token === "null") {
    return res.status(401).json({
      result: "Unauthorized",
      reason: "로그인한 유저만 사용할 수 있는 서비스입니다.",
    });
  }
  const decodedToken = jwt.decode(token); // verify가 아닌 decode를 사용하여 토큰 내용만 가져옵니다.

  if (!decodedToken) {
    return res.status(401).json({
      result: "Unauthorized",
      reason: "정상적인 토큰이 아닙니다.",
    });
  }

  if (
    isJwtPayloadWithExpiration(decodedToken) &&
    decodedToken.exp < Date.now() / 1000
  ) {
    return res.redirect("/");
  }

  try {
    const decodedEmail = decodeURIComponent(req.cookies.email);
    const user = await userService.getUserByEmail(decodedEmail);

    if (!user) {
      const error = new Error("등록된 회원이 아닙니다.");
      error.name = "Unauthorized";
      throw error;
    }

    req.currentUser = user;
    next();
  } catch (error) {
    return res.status(401).json({
      result: "Unauthorized",
      reason: "정상적인 토큰이 아닙니다.",
    });
  }
}

export { loginRequired };
