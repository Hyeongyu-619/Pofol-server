import { Strategy as NaverStrategy } from "passport-naver";
import passport from "passport";

const naverStrategy = new NaverStrategy(
  {
    clientID: process.env.NAVER_CLIENT_ID as string,
    clientSecret: process.env.NAVER_CLIENT_SECRET as string,
    callbackURL: process.env.NAVER_CALLBACK_URL as string,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      return done(null, profile);
    } catch (error) {
      return done(error);
    }
  }
);

passport.use(naverStrategy);

export { naverStrategy };
