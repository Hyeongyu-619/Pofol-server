import { Types } from "mongoose";
import { NotificationModel } from "../database/model/notificationModel";
import { NotificationInfo, NotificationData } from "../types/notification";

class NotificationService {
  notificationModel: NotificationModel;

  constructor(notificationModelArg: NotificationModel) {
    this.notificationModel = notificationModelArg;
  }

  async addNotification(
    notificationInfo: NotificationInfo
  ): Promise<NotificationData> {
    const createdNewNotification = await this.notificationModel.create(
      notificationInfo
    );
    return createdNewNotification;
  }

  async updateNotification(
    _id: string,
    update: Partial<NotificationInfo>
  ): Promise<NotificationData> {
    const updatedNotification = await this.notificationModel.update(
      _id,
      update
    );
    return updatedNotification;
  }

  async deleteNotification(_id: string): Promise<NotificationData | null> {
    const deletedNotification = await this.notificationModel.deleteNotification(
      _id
    );
    return deletedNotification;
  }

  async findAllNotifications(): Promise<NotificationInfo[]> {
    try {
      const notifications = await this.notificationModel.findAll();
      return notifications;
    } catch (error) {
      throw new Error("알람 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async findAllNotificationsWithPagination(
    userId: string,
    skip: number,
    limit: number
  ): Promise<[NotificationInfo[], number]> {
    const notifications =
      await this.notificationModel.findAllNotificationsByUserId(
        userId,
        skip,
        limit
      );
    const total = await this.notificationModel.countNotificationsByUserId(
      userId
    );
    return [notifications, total];
  }
}

const notificationModelInstance = new NotificationModel();
export const notificationService = new NotificationService(
  notificationModelInstance
);
