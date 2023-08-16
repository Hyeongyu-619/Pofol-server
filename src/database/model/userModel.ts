import { Types } from "mongoose";
import { User } from "..";

export interface UserInfo {
  name: string;
  email: string;
  nickName: string;
  career: string;
  position: string;
  role?: string;
  profileImage?: string;
}
export interface UserData extends UserInfo {
  _id: Types.ObjectId;
}

export interface ImageInfo {
  body: string;
  file: string;
  type: string;
}

export class UserModel {
  async findByEmail(email: string): Promise<UserData | null> {
    const user = await User.findOne({ email });
    return user;
  }

  async findById(_id: string): Promise<UserData> {
    const user = await User.findOne({ _id });
    if (!user) {
      const error = new Error("해당하는 id의 사용자가 존재하지 않습니다.");
      error.name = "NotFound!";
      throw error;
    }
    return user;
  }
  async findAll(): Promise<UserInfo[]> {
    const users = await User.find({});
    return users;
  }
  async create(userInfo: UserInfo): Promise<UserData> {
    const createdUser = await User.create(userInfo);

    if (!createdUser) {
      const error = new Error("회원가입에 실패하였습니다.");
      error.name = "NotFound";
      throw error;
    }
    return createdUser;
  }
  async update(_id: string, update: Partial<UserInfo>): Promise<UserData> {
    const filter = { _id };
    const option = { returnOriginal: false };
    const updatedUser = await User.findOneAndUpdate(filter, update, option);

    if (!updatedUser) {
      const error = new Error("유저 정보 업데이트에 실패하였습니다.");
      error.name = "NotFound";
      throw error;
    }
    return updatedUser;
  }

  async deleteUser(_id: string): Promise<void> {
    const deletedUser = await User.findOneAndDelete({ _id });
  }

  async adminDeleteUser(userId: string): Promise<void> {
    const targetUser = await User.findOne({ _id: userId });

    if (!targetUser) {
      throw new Error(`${userId}가 DB에 존재하지 않습니다!`);
    }
    await User.deleteOne({ _id: userId });
  }

  async approveMentor(userId: string): Promise<UserData | null> {
    const filter = { _id: userId };
    const update = { role: "mentor" };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    if (!updatedUser) {
      throw new Error(`DB에 ${userId}로 조회한 유저가 존재하지 않습니다.`);
    }

    return updatedUser;
  }
}

export const userModel = new UserModel();
