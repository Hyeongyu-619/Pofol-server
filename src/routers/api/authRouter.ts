import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver";
import { NextFunction, Request, Response, Router } from "express";
import { userService } from "../../services";
import ensureLoggedIn from "connect-ensure-login";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.get("/login/naver", passport.authenticate("naver"));

authRouter.post(
  "/signup", //naver/callback
  passport.authenticate("naver", { failureRedirect: "/login" }),
  async (req, res) => {
    const profile = req.user as any;
    const existingUser = await userService.getUserByEmail(profile.email);
    const { nickName, position, role } = req.body;

    if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET as string
      );
      res.json({ success: true, token });
    } else {
      const newUser = await userService.addUser({
        name: profile.displayName,
        email: profile.email,
        nickName: nickName,
        position: position,
        role: role,
      });

      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET as string
      );
      res.json({ success: true, token });
    }
  }
);

authRouter.get("/logout", function (req, res) {
  req.logout();
});

export { authRouter };
