import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver";
import { NextFunction, Request, Response, Router } from "express";
import { userService } from "../../services";
import ensureLoggedIn from "connect-ensure-login";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.get("/login/naver", passport.authenticate("naver"));

authRouter.get(
  "/return",
  passport.authenticate("naver", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ success: true, message: "Login successful", user: req.user });
    } else {
      res.json({ success: false, message: "Login failed" });
    }
  }
);

authRouter.get("/register", (req, res) => {
  res.render("register");
});

authRouter.post("/register", async (req, res) => {
  try {
    // 입력 데이터 추출
    const {
      name,
      email,
      nickName,
      career,
      position,
      role,
      profileImageUrl,
      techStack,
    } = req.body;
    // 이메일 중복 확인
    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    // 사용자 생성
    const newUser = await userService.addUser({
      name,
      email,
      nickName,
      career,
      position,
      role,
      profileImageUrl,
      techStack,
    });

    res.json({
      success: true,
      message: "Registration successful",
      user: newUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, message: "An unexpected error occurred." });
    }
  }
});

authRouter.get("/profile", ensureLoggedIn.ensureLoggedIn(), (req, res) => {
  console.log(JSON.stringify(req.user));
  res.render("profile", { user: req.user });
});
export { authRouter };
