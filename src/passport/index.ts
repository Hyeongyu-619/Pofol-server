import passport from "passport";
import { naverStrategy } from "./strategies/naver";
import { userService } from "../services/userService";

passport.use(naverStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
