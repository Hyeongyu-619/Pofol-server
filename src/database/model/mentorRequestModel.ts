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
    try {
      const createdMentorRequest = await MentorRequest.create(
        mentorRequestInfo
      );
      return createdMentorRequest.toObject();
    } catch (error) {
      throw new Error("멘토 요청을 생성하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findById(_id: string): Promise<MentorRequestData> {
    try {
      const mentorRequest = await MentorRequest.findById({ _id }).lean();
      if (!mentorRequest) {
        throw new Error("해당하는 id의 멘토 전환 신청서가 존재하지 않습니다.");
      }
      return mentorRequest;
    } catch (error) {
      throw new Error("멘토 요청을 찾는 중에 오류가 발생했습니다", {
        cause: error,
      });
    }
  }

  async findAll(): Promise<MentorRequestInfo[]> {
    try {
      const mentorRequests = await MentorRequest.find({}).lean();
      return mentorRequests;
    } catch (error) {
      throw (
        (new Error("모든 멘토 요청을 불러오는 중에 오류가 발생했습니다."),
        {
          cause: error,
        })
      );
    }
  }

  async findMentorRequestsWithPagination(
    skip: number,
    limit: number
  ): Promise<MentorRequestInfo[]> {
    try {
      return await MentorRequest.find().skip(skip).limit(limit).exec();
    } catch (error) {
      throw new Error("멘토 요청을 페이징 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async update(
    _id: string,
    update: Partial<MentorRequestInfo>
  ): Promise<MentorRequestData> {
    try {
      const filter = { _id };
      const option = { returnOriginal: false, new: true };
      const updatedMentorRequest = await MentorRequest.findOneAndUpdate(
        filter,
        update,
        option
      ).lean();

      if (!updatedMentorRequest) {
        throw new Error("멘토 요청 정보 업데이트에 실패하였습니다.");
      }
      return updatedMentorRequest;
    } catch (error) {
      throw new Error("멘토 요청을 업데이트하는 중에 오류가 발생했습니다", {
        cause: error,
      });
    }
  }

  async findMentorRequestsByStatus(
    status: string,
    skip: number,
    limit: number
  ): Promise<MentorRequestData[]> {
    try {
      return await MentorRequest.find({ status })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    } catch (error) {
      throw new Error(
        "특정 상태의 멘토 요청을 조회하는 중에 오류가 발생했습니다.",
        {
          cause: error,
        }
      );
    }
  }

  async countAllMentorRequests(): Promise<number> {
    try {
      return await MentorRequest.countDocuments().exec();
    } catch (error) {
      throw new Error(
        "모든 멘토 요청의 개수를 조회하는 중에 오류가 발생했습니다.",
        {
          cause: error,
        }
      );
    }
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
  async countMentorRequestsByStatus(status: string): Promise<number> {
    try {
      return await MentorRequest.countDocuments({ status }).exec();
    } catch (error) {
      throw new Error(
        "특정 상태의 멘토 요청 개수를 조회하는 중에 오류가 발생했습니다.",
        {
          cause: error,
        }
      );
    }
  }
}

const MentorRequest = model<MentorRequestInfo & Document>(
  "MentorRequest",
  MentorRequestSchema
);
export default MentorRequest;
