import passport from "passport";
import "passport-naver-v2";
import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";
import { userService } from "../../services";

interface UserEmail {
  email: string;
  primary: true;
  verified: true;
  visibility: any;
}

const authRouter = Router();
// 네이버로 로그인하기 라우터
authRouter.get(
  "/login",
  passport.authenticate("naver", { authType: "reprompt" })
);

// 네이버 서버 로그인 후 redirect URL 설정에 따른 라우터
authRouter.get(
  "/naver/callback",
  passport.authenticate("naver", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    res.redirect("/");
  }
);

export { authRouter };
