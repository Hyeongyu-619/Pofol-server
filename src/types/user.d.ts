export interface UserInfo {
  name: string;
  email: string;
  nickName: string;
  position: string;
  role: string;
  profileImageUrl?: string;
  techStack?: string;
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserData extends UserInfo {
  _id: Types.ObjectID;
}
