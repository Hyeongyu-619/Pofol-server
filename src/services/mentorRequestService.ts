import { Types } from "mongoose";
import { MentorRequestModel } from "../database/model/mentorRequestModel";
import { MentorRequestInfo, MentorRequestData } from "../types/mentorRequest";
import { NotificationModel } from "../database/model/notificationModel";

class MentorRequestService {
  mentorRequestModel: MentorRequestModel;
  notificationModel: NotificationModel;

  constructor(
    mentorRequestModelArg: MentorRequestModel,
    notificationModelArg: NotificationModel
  ) {
    this.mentorRequestModel = mentorRequestModelArg;
    this.notificationModel = notificationModelArg;
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
    update: Partial<MentorRequestInfo>,
    userId: Types.ObjectId
  ): Promise<MentorRequestData> {
    const updatedMentorRequest = await this.mentorRequestModel.update(
      _id,
      update
    );

    await this.notificationModel.create({
      userId,
      content: `멘토 전환 신청 상태가 변경되었습니다 상태: ${update.status?.toString()}`,
      mentorRequestStatus: update.status?.toString(),
      mentorRequestId: _id,
    });

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
    status: string,
    skip: number,
    limit: number
  ): Promise<[MentorRequestData[], number]> {
    const mentorRequests =
      await this.mentorRequestModel.findMentorRequestsByStatus(
        status,
        skip,
        limit
      );
    const total = await this.mentorRequestModel.countMentorRequestsByStatus(
      status
    );
    return [mentorRequests, total];
  }

  async findAllWithPagination(
    skip: number,
    limit: number
  ): Promise<[MentorRequestInfo[], number]> {
    const mentorRequests =
      await this.mentorRequestModel.findMentorRequestsWithPagination(
        skip,
        limit
      );
    const total = await this.mentorRequestModel.countAllMentorRequests();
    return [mentorRequests, total];
  }
}

const mentorRequestModelInstance = new MentorRequestModel();
const notificationModelInstance = new NotificationModel();
export const mentorRequestService = new MentorRequestService(
  mentorRequestModelInstance,
  notificationModelInstance
);
