import passport from "passport";
import { userService } from "../services/userService";
import "./strategies/naver";

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});

export default passport;
