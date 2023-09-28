import { Document, model } from "mongoose";
import {
  NotificationInfo,
  NotificationData,
} from "../../types/notificationTypes";
import { NotificationSchema } from "../schema/notificationSchema";

export class NotificationModel {
  async create(notificationInfo: NotificationInfo): Promise<NotificationData> {
    try {
      const createdNotification = await Notification.create(notificationInfo);
      return createdNotification.toObject();
    } catch (error) {
      throw new Error("알림을 생성하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findAll(): Promise<NotificationInfo[]> {
    try {
      const notifications = await Notification.find({}).lean();
      return notifications;
    } catch (error) {
      throw new Error("모든 알림을 불러오는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findAllNotifications(
    skip: number,
    limit: number
  ): Promise<NotificationInfo[]> {
    try {
      const notifications = await Notification.find()
        .skip(skip)
        .limit(limit)
        .lean();
      return notifications;
    } catch (error) {
      throw new Error("알림을 페이징 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async findAllNotificationsByUserId(
    userId: string,
    skip: number,
    limit: number
  ): Promise<NotificationInfo[]> {
    try {
      const notifications = await Notification.find({ userId })
        .skip(skip)
        .limit(limit)
        .lean();
      return notifications;
    } catch (error) {
      throw new Error("사용자 ID로 알림을 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async update(
    _id: string,
    update: Partial<NotificationInfo>
  ): Promise<NotificationData> {
    try {
      const filter = { _id };
      const option = { returnOriginal: false, new: true };
      const updatedNotification = await Notification.findOneAndUpdate(
        filter,
        update,
        option
      ).lean();

      if (!updatedNotification) {
        throw new Error("알림 정보 업데이트에 실패하였습니다.");
      }

      return updatedNotification;
    } catch (error) {
      throw new Error("알림을 업데이트하는 중에 오류가 발생했습니다", {
        cause: error,
      });
    }
  }

  async deleteNotification(_id: string): Promise<NotificationData | null> {
    try {
      const deletedNotification = await Notification.findOneAndDelete({
        _id,
      }).lean();
      if (!deletedNotification) {
        throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
      }
      return deletedNotification;
    } catch (error) {
      throw new Error("알림을 삭제하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async countAllNotifications(): Promise<number> {
    try {
      return await Notification.countDocuments().exec();
    } catch (error) {
      throw new Error("모든 알림의 개수를 조회하는 중에 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }

  async countNotificationsByUserId(userId: string): Promise<number> {
    try {
      return await Notification.countDocuments({ userId }).exec();
    } catch (error) {
      throw new Error(
        "사용자 ID로 알림 개수를 조회하는 중에 오류가 발생했습니다.",
        {
          cause: error,
        }
      );
    }
  }
}

const Notification = model<NotificationInfo & Document>(
  "Notification",
  NotificationSchema
);

export default Notification;
