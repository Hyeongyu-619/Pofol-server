import { UserModel } from "../database/model/userModel";
import { UserInfo, UserData } from "../types/user";
import { validation } from "../utils/validation";

class UserService {
  userModel: UserModel;

  constructor(userModelArg: UserModel) {
    this.userModel = userModelArg;
  }

  async addUser(userInfo: UserInfo): Promise<UserData> {
    const { email } = userInfo;

    validation.addUser(userInfo);

    const user = await this.userModel.findByEmail(email);
    if (user) {
      const error = new Error(
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
      error.name = "Conflict";
      throw error;
    }

    const createdNewUser = await this.userModel.create(userInfo);
    return createdNewUser;
  }

  async getUserByEmail(email: string): Promise<UserData | null> {
    const user = await this.userModel.findByEmail(email);
    return user;
  }

  async getUserById(_id: string): Promise<UserData> {
    const user = await this.userModel.findById(_id);
    return user;
  }

  async getUserPositionById(userId: string): Promise<string> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.position;
  }

  async updateUser(_id: string, update: Partial<UserInfo>): Promise<UserData> {
    const updatedUser = await this.userModel.update(_id, update);
    return updatedUser;
  }

  async updateUserRole(_id: string, newRole: string): Promise<UserData> {
    const updatedUser = await this.userModel.update(_id, { role: newRole });
    return updatedUser;
  }

  async deleteUser(_id: string): Promise<UserData | null> {
    const deletedUser = await this.userModel.deleteUser(_id);
    return deletedUser;
  }

  async findAll(): Promise<UserInfo[]> {
    try {
      const users = await this.userModel.findAll();
      return users;
    } catch (error) {
      throw new Error("유저 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async incrementCoachingCount(userId: string): Promise<UserInfo> {
    try {
      const user = await this.userModel.incrementCoachingCount(userId);
      return user;
    } catch (error) {
      throw new Error("멘토링 완료 업데이트 중 오류가 발생했습니다.");
    }
  }

  async approveMentor(_id: string): Promise<UserData> {
    const updatedUser = await this.userModel.update(_id, { role: "mentor" });
    if (!updatedUser) {
      const error = new Error("해당 유저가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }
    return updatedUser;
  }
}

const userModelInstance = new UserModel();
export const userService = new UserService(userModelInstance);
