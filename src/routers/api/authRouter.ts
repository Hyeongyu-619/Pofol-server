import passport from "passport";
import "passport-naver";
import { NextFunction, Request, Response, Router } from "express";
import { userService } from "../../services";
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

authRouter.post("/signup", (req, res, next) => {
  passport.authenticate("naver", async (error: any, user: any, info: any) => {
    if (error) {
      console.error("Authentication error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!user) {
      console.log("No user found:", info);
      return res.redirect("/login");
    }

    req.logIn(user, async (loginError) => {
      if (loginError) {
        console.error("Login error:", loginError);
        return res.status(500).json({ error: "Login Error" });
      }

      const profile = user;
      console.log(profile);
      const existingUser = await userService.getUserByEmail(profile.email);
      console.log(existingUser);
      const { nickName, position, role } = req.body;
      console.log(req.body);

      if (existingUser) {
        const token = jwt.sign(
          { id: existingUser._id },
          process.env.JWT_SECRET as string
        );
        return res.json({ success: true, token });
      } else {
        console.log("Creating new user...");
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
        return res.json({ success: true, token });
      }
    });
  })(req, res, next);
});
authRouter.get("/logout", function (req, res) {
  req.logout();
});

export { authRouter };
