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

  const decodedToken = jwt.decode(token);

  if (!token || token === "null" || !decodedToken) {
    res.cookie("token", "", { maxAge: -1 });
    return res.status(401).json({
      result: "Unauthorized",
      reason: "로그인한 유저만 사용할 수 있는 서비스입니다.",
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
    return res.status(500).json(error);
  }
}

export { loginRequired };
