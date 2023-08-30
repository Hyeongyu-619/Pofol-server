import { Document, model } from "mongoose";
import {
  MentorRequestInfo,
  MentorRequestData,
} from "../../types/mentorRequest";
import { MentorRequestSchema } from "../schema/mentorRequestSchema";

export class MentorRequestModel {
  async create(
    mentorRequestInfo: MentorRequestInfo
  ): Promise<MentorRequestData> {
    const createdMentorRequest = await MentorRequest.create(mentorRequestInfo);
    return createdMentorRequest.toObject();
  }

  async findAll(): Promise<MentorRequestInfo[]> {
    const mentorRequests = await MentorRequest.find({}).lean();
    return mentorRequests;
  }

  async update(
    _id: string,
    update: Partial<MentorRequestInfo>
  ): Promise<MentorRequestData> {
    const filter = { _id };
    const option = { returnOriginal: false, new: true };
    const updatedMentorRequest = await MentorRequest.findOneAndUpdate(
      filter,
      update,
      option
    ).lean();

    if (!updatedMentorRequest) {
      const error = new Error("포지션 정보 업데이트에 실패하였습니다.");
      error.name = "NotFound";
      throw error;
    }
    return updatedMentorRequest;
  }

  async deleteMentorRequest(_id: string): Promise<MentorRequestData | null> {
    const deletedMentorRequest = await MentorRequest.findOneAndDelete({
      _id,
    }).lean();
    if (!deletedMentorRequest) {
      throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
    }
    return deletedMentorRequest;
  }
}

const MentorRequest = model<MentorRequestInfo & Document>(
  "MentorRequest",
  MentorRequestSchema
);
export default MentorRequest;
