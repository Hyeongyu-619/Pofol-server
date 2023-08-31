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

  async findById(_id: string): Promise<MentorRequestData> {
    const mentorRequest = await MentorRequest.findById({ _id }).lean();
    if (!mentorRequest) {
      const error = new Error(
        "해당하는 id의 멘토 전환 신청서가 존재하지 않습니다."
      );
      error.name = "NotFound!";
      throw error;
    }
    return mentorRequest;
  }

  async findAll(): Promise<MentorRequestInfo[]> {
    const mentorRequests = await MentorRequest.find({}).lean();
    return mentorRequests;
  }

  async findMentorRequestsWithPagination(
    skip: number,
    limit: number
  ): Promise<MentorRequestInfo[]> {
    return await MentorRequest.find().skip(skip).limit(limit).exec();
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

  async findMentorRequestsByStatus(
    status: string,
    skip: number,
    limit: number
  ): Promise<MentorRequestData[]> {
    return await MentorRequest.find({ status })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async countAllMentorRequests(): Promise<number> {
    return await MentorRequest.countDocuments().exec();
  }

  async countMentorRequestsByStatus(status: string): Promise<number> {
    return await MentorRequest.countDocuments({ status }).exec();
  }
}

const MentorRequest = model<MentorRequestInfo & Document>(
  "MentorRequest",
  MentorRequestSchema
);
export default MentorRequest;
