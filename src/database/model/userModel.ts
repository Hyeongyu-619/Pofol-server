import { Document, model } from "mongoose";
import { User } from "..";
import { UserInfo, UserData } from "../../types/user";
import { UserSchema } from "../schema/userSchema";

export class UserModel {
  async findByEmail(email: string): Promise<UserData | null> {
    try {
      const user = await User.findOne({ email }).lean();
      return user;
    } catch (error) {
      throw new Error("유저를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findById(_id: string): Promise<UserData> {
    const user = await User.findById({ _id }).lean();
    if (!user) {
      const error = new Error("해당하는 id의 사용자가 존재하지 않습니다.");
      error.name = "NotFound!";
      throw error;
    }
    return user;
  }
  async findAll(): Promise<UserInfo[]> {
    try {
      const users = await User.find({}).lean();
      return users;
    } catch (error) {
      throw new Error("모든 유저 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }
  async findUsersWithPagination(
    skip: number,
    limit: number
  ): Promise<UserInfo[]> {
    try {
      return await User.find().skip(skip).limit(limit).exec();
    } catch (error) {
      throw new Error("유저를 페이징 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async countAllUsers(): Promise<number> {
    try {
      const count = await User.countDocuments();
      return count;
    } catch (error) {
      throw new Error("유저의 수를 계산하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async create(userInfo: UserInfo): Promise<UserData> {
    try {
      const createdUser = await User.create(userInfo);
      return createdUser.toObject();
    } catch (error) {
      throw new Error("유저를 생성하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }
  async update(_id: string, update: Partial<UserInfo>): Promise<UserData> {
    try {
      const filter = { _id };
      const option = { returnOriginal: false, new: true };
      const updatedUser = await User.findOneAndUpdate(
        filter,
        update,
        option
      ).lean();

      if (!updatedUser) {
        const error = new Error("유저 정보 업데이트에 실패하였습니다.");
        error.name = "NotFound";
        throw error;
      }
      return updatedUser;
    } catch (error) {
      throw new Error("유저를 업데이트하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async deleteUser(_id: string): Promise<UserData | null> {
    try {
      const deletedUser = await User.findOneAndDelete({ _id }).lean();
      if (!deletedUser) {
        throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
      }
      return deletedUser;
    } catch (error) {
      throw new Error("유저를 삭제하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async incrementCoachingCount(userId: string): Promise<UserData> {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("해당 유저가 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }
    user.coachingCount += 1;
    await user.save();
    return user.toObject();
  }

  async findByNickName(nickname: string): Promise<UserData | null> {
    const user = await User.findOne({ nickName: nickname }).lean();
    return user;
  }
}

const userModel = model<UserInfo & Document>("User", UserSchema);
export default userModel;
