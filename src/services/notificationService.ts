import { NotificationModel } from "../database/model/notificationModel";
import { NotificationInfo, NotificationData } from "../types/notificationTypes";

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

  async getAllNotificationsWithPagination(
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
