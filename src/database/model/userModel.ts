import { Types } from "mongoose";
import { User } from "..";

export interface UserInfo {
  name: string;
  email: string;
  nickName: string;
  career: string;
  position: string;
  role: string;
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
}

export const userModel = new UserModel();
