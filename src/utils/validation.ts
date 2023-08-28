/* eslint-disable class-methods-use-this */
import { UserInfo } from "../types/user";
import { PortfolioInfo } from "../types/portfolio";
import { ProjectStudyInfo } from "../types/projectStudy";

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
    const nickNamePattern = /^[가-힣a-zA-Z0-9]+$/;
    if (!nickNamePattern.test(nickName)) {
      const error = new Error("닉네임은 한글, 숫자, 영어만 입력 가능합니다.");
      error.name = "BadRequest";
      throw error;
    }
    if (nickName.length > 10) {
      const error = new Error("닉네임을 10자 이하로 입력해주세요.");
      error.name = "BadRequest";
      throw error;
    }
  }
  addPortfolioApplication(portfolioInfo: PortfolioInfo): void {
    const {
      name,
      position,
      company,
      title,
      description,
      career,
      nickName,
      coachingCount,
    } = portfolioInfo;

    if (
      !name ||
      !position ||
      !company ||
      !title ||
      !description ||
      !career ||
      !nickName ||
      !coachingCount
    ) {
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

    if (description.length > 1000) {
      const error = new Error("내용을 1000자 이하로 입력해주세요.");
      error.name = "BadRequest";
      throw error;
    }
  }

  addProjectStudyApplication(projectStudyInfo: ProjectStudyInfo): void {
    const {
      name,
      position,
      title,
      description,
      nickName,
      howContactTitle,
      howContactContent,
      process,
      deadline,
      recruits,
      classification,
    } = projectStudyInfo;

    if (
      !name ||
      !position ||
      !title ||
      !description ||
      !howContactTitle ||
      !howContactContent ||
      !nickName ||
      !process ||
      !deadline ||
      !recruits ||
      !classification
    ) {
      const error = new Error(
        "프로젝트/신청서 게시물에 필요한 정보가 모두 입력되지 않았습니다."
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
      const error = new Error("내용을 1000자 이하로 입력해주세요.");
      error.name = "BadRequest";
      throw error;
    }
  }
}

export const validation = new Validation();
