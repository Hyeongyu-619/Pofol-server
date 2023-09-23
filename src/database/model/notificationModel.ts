import { Document, model } from "mongoose";
import { NotificationInfo, NotificationData } from "../../types/notification";
import { NotificationSchema } from "../schema/notificationSchema";

const Notification = model<NotificationInfo & Document>(
  "Notification",
  NotificationSchema
);
export class NotificationModel {
  async create(notificationInfo: NotificationInfo): Promise<NotificationData> {
    const createdNotification = await Notification.create(notificationInfo);
    return createdNotification.toObject();
  }

  async findAll(): Promise<NotificationInfo[]> {
    const notifications = await Notification.find({}).lean();
    return notifications;
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
      throw new Error("Notifications could not be retrieved.");
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
      throw new Error("Notifications could not be retrieved.");
    }
  }

  async update(
    _id: string,
    update: Partial<NotificationInfo>
  ): Promise<NotificationData> {
    const filter = { _id };
    const option = { returnOriginal: false, new: true };
    const updatedNotification = await Notification.findOneAndUpdate(
      filter,
      update,
      option
    ).lean();

    if (!updatedNotification) {
      const error = new Error("알림 정보 업데이트에 실패하였습니다.");
      error.name = "NotFound";
      throw error;
    }
    return updatedNotification;
  }

  async deleteNotification(_id: string): Promise<NotificationData | null> {
    const deletedNotification = await Notification.findOneAndDelete({
      _id,
    }).lean();
    if (!deletedNotification) {
      throw new Error(`${_id}가 DB에 존재하지 않습니다!`);
    }
    return deletedNotification;
  }

  async countAllNotifications(): Promise<number> {
    return await Notification.countDocuments().exec();
  }

  async countNotificationsByUserId(userId: string): Promise<number> {
    return await Notification.countDocuments({ userId }).exec();
  }
}

export default Notification;
