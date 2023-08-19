import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { userService } from "../services";

async function loginRequired(req: any, res: Response, next: NextFunction) {
  // request 헤더로부터 authorization bearer 토큰을 받음.

  const wholeToken = req.headers.authorization?.split(" ");

  if (wholeToken) {
    // token format 확인
    const tokenFormat = wholeToken[0];
    if (tokenFormat !== "Bearer") {
      res.status(401).json({
        result: "Unauthorized",
        reason: "지원되지 않는 토큰 포맷입니다.",
      });
    }
    const userToken = wholeToken[1];
    if (!userToken || userToken === "null") {
      res.status(401).json({
        result: "Unauthorized",
        reason: "로그인한 유저만 사용할 수 있는 서비스입니다.",
      });
    }

    try {
      //  네이버 Access Token 얻기
      const tokenResponse = await axios.post(
        "https://nid.naver.com/oauth2.0/token",
        null,
        {
          params: {
            grant_type: "authorization_code",
            client_id: process.env.NAVER_CLIENT_ID,
            client_secret: process.env.NAVER_CLIENT_SECRET,
            code: userToken,
            state: "YOUR_STATE",
          },
        }
      );
      const accessToken = tokenResponse.data.access_token;

      //  네이버 사용자 프로필 정보 가져오기
      const profileResponse = await axios.get(
        "https://openapi.naver.com/v1/nid/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const userEmail = profileResponse.data.response.email;

      // DB에서 해당 이메일로 사용자 정보 찾기
      const user = await userService.getUserByEmail(userEmail);

      if (!user) {
        const error = new Error("등록된 회원이 아닙니다.");
        error.name = "Unauthorized";
        throw error;
      }
      req.currentUserId = String(user._id);
      next();
    } catch (error) {
      next(error);
    }
    if (tokenFormat !== "Bearer") {
      return res.status(401).json({
        result: "Unauthorized",
        reason: "지원되지 않는 토큰 포맷입니다.",
      });
    }
  }
}

export { loginRequired };
