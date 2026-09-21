export type NotificationDetails = {
  url: string;
  token: string;
  appFid?: number;
};

// TEMP: in-memory store (server restart par reset ho jayega)
const notificationStore = new Map<number, NotificationDetails>();

export function saveNotificationDetails(
  fid: number,
  details: NotificationDetails
) {
  notificationStore.set(fid, details);
}

export function removeNotificationDetails(fid: number) {
  notificationStore.delete(fid);
}

export function getNotificationDetails(fid: number) {
  return notificationStore.get(fid);
}
