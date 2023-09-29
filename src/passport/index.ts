import passport from "passport";
import "./strategies/naver";

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});

export default passport;
