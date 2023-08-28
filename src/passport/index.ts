import passport from "passport";
import { userService } from "../services/userService";
import "./strategies/naver";

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await userService.getUserById(id);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });

export default passport;
