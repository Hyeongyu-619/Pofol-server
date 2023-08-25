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

authRouter.get("/login/naver/callback", (req, res, next) => {
  passport.authenticate("naver", async (error: any, user: any, info: any) => {
    if (error) {
      return res.status(500).json({ error });
    }
    const existingUser = await userService.getUserByEmail(user.emails[0].value);
    const userName = user.displayName;
    const email = user.email[0].value;

    if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET as string
      );
      return res.cookie("token", token, { httpOnly: true });
    } else {
      res.cookie("userName", userName);
      res.cookie("email", email);
      res.redirect("/signup");
    }
  })(req, res, next);
});

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, name, nickName, position, role } = req.body;

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "이미 가입한 사용자입니다." });
    }
    const newUser = await userService.addUser({
      name,
      email,
      nickName,
      position,
      role,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string
    );

    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/logout", function (req, res) {
  req.logout();
});

export { authRouter };
