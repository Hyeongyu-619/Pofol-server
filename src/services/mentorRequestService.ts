import { Types } from "mongoose";
import { MentorRequestModel } from "../database/model/mentorRequestModel";
import { MentorRequestInfo, MentorRequestData } from "../types/mentorRequest";

class MentorRequestService {
  mentorRequestModel: MentorRequestModel;

  constructor(mentorRequestModelArg: MentorRequestModel) {
    this.mentorRequestModel = mentorRequestModelArg;
  }

  async addMentorRequest(
    mentorRequestInfo: MentorRequestInfo
  ): Promise<MentorRequestData> {
    const createdNewMentorRequest = await this.mentorRequestModel.create(
      mentorRequestInfo
    );
    return createdNewMentorRequest;
  }

  async updateMentorRequest(
    _id: string,
    update: Partial<MentorRequestInfo>
  ): Promise<MentorRequestData> {
    const updatedMentorRequest = await this.mentorRequestModel.update(
      _id,
      update
    );
    return updatedMentorRequest;
  }

  async deleteMentorRequest(_id: string): Promise<MentorRequestData | null> {
    const deletedMentorRequest =
      await this.mentorRequestModel.deleteMentorRequest(_id);
    return deletedMentorRequest;
  }

  async findAllMentorRequests(): Promise<MentorRequestInfo[]> {
    try {
      const mentorRequests = await this.mentorRequestModel.findAll();
      return mentorRequests;
    } catch (error) {
      throw new Error("포지션 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async getMentorRequestById(_id: string): Promise<MentorRequestData> {
    const user = await this.mentorRequestModel.findById(_id);
    return user;
  }

  async findMentorRequestsByStatus(
    status: string
  ): Promise<MentorRequestData[]> {
    return await this.mentorRequestModel.findMentorRequestsByStatus(status);
  }
}

const mentorRequestModelInstance = new MentorRequestModel();
export const mentorRequestService = new MentorRequestService(
  mentorRequestModelInstance
);
