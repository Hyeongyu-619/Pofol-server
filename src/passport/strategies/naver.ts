import { Strategy as NaverStrategy } from "passport-naver";
import { userService } from "../../services";
import passport from "passport";
import dotenv from "dotenv";
import { access } from "fs";

dotenv.config();

const naverStrategy = new NaverStrategy(
  {
    clientID: process.env.NAVER_CLIENT_ID as string,
    clientSecret: process.env.NAVER_CLIENT_SECRET as string,
    callbackURL: process.env.NAVER_CALLBACK_URL as string,
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log("naver.ts console.log! :" + accessToken);
    try {
      const userEmail = profile.emails?.[0]?.value ?? "";
      const existingUser = await userService.getUserByEmail(userEmail);
      console.log("userEmail:" + userEmail);
      console.log("existingUser:" + existingUser);
      return done(null, profile);
    } catch (error) {
      console.log("naver.ts console.log:" + accessToken);
      return done(error);
    }
  }
);

passport.use(naverStrategy);

export { naverStrategy };
