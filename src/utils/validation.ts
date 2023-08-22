/* eslint-disable class-methods-use-this */
import { UserInfo } from "../types/user";
import { PortfolioInfo } from "../types/portfolio";

class Validation {
  addUser(userInfo: UserInfo): void {
    const { name, email, nickName, position } = userInfo;

    if (!name || !email || !nickName || !position) {
      const error = new Error("필수 정보가 모두 입력되지 않았습니다.");
      error.name = "NotFound";
      throw error;
    }

    if (name.length > 10) {
      const error = new Error("이름을 10자 이하로 입력해주세요.");
      error.name = "BadRequest";
      throw error;
    }
  }
  addPortfolioApplication(portfolioInfo: PortfolioInfo): void {
    const { name, position, company, title, description } = portfolioInfo;

    if (!name || !position || !company || !title || !description) {
      const error = new Error(
        "포트폴리오 멘토링 신청서에 필요한 정보가 모두 입력되지 않았습니다."
      );
      error.name = "BadRequest";
      throw error;
    }

    if (title.length > 50) {
      const error = new Error("제목을 50자 이하로 입력해주세요.");
      error.name = "BadRequest";
      throw error;
    }

    if (description.length > 500) {
      const error = new Error("내용을 500자 이하로 입력해주세요.");
      error.name = "BadRequest";
      throw error;
    }
  }

  // isLogin(userId: string | undefined): string {
  //   if (typeof userId === "undefined") {
  //     const error = new Error("로그인 후 확인 가능합니다.");
  //     error.name = "Unauthorized";
  //     throw error;
  //   }
  //   return userId;
  // }
}

export const validation = new Validation();
