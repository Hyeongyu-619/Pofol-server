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

    try {
      console.log(user);
      const existingUser = await userService.getUserByEmail(
        user.emails[0].value
      );
      // const userName = user.displayName;
      const email = user.emails[0].value;

      if (existingUser) {
        const token = jwt.sign(
          { id: existingUser._id },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "6h" }
        );
        res.cookie("token", token, { httpOnly: true, maxAge: 21600000 });
        res.cookie("isToken", true);
        return res.redirect("/");
      } else {
        res.cookie("email", email);
        return res.redirect("/signup");
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
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
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "6h" }
    );

    res.cookie("token", token, { maxAge: 21600000 });
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", function (req, res) {
  res.clearCookie("token");
  res.clearCookie("email");
  res.clearCookie("isToken");
  res.redirect("/");
});

export { authRouter };
