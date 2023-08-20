import { Document, model } from "mongoose";
import { User } from "..";
import { UserInfo, UserData } from "../../types/user";
import { UserSchema } from "../schema/userSchema";

export class UserModel {
  async findByEmail(email: string): Promise<UserData | null> {
    const user = await User.findOne({ email }).lean();
    return user;
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
    const users = await User.find({}).lean();
    return users;
  }
  async create(userInfo: UserInfo): Promise<UserData> {
    const createdUser = await User.create(userInfo);
    return createdUser.toObject();
  }
  async update(_id: string, update: Partial<UserInfo>): Promise<UserData> {
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
  }

  async deleteUser(_id: string): Promise<UserData | null> {
    const deletedUser = await User.findOneAndDelete({ _id }).lean();
    if (!deletedUser) {
      throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
    }
    return deletedUser;
  }

  // async adminDeleteUser(userId: string): Promise<void> {
  //   const targetUser = await User.findOne({ _id: userId });

  //   if (!targetUser) {
  //     throw new Error(`${userId}가 DB에 존재하지 않습니다!`);
  //   }
  //   await User.deleteOne({ _id: userId });
  // }
}

const userModel = model<UserInfo & Document>("User", UserSchema);
export default userModel;
