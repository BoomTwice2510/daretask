// lib/sendMiniAppNotification.ts
type MiniAppNotificationPayload = {
  url: string;
  token: string;
  title: string;
  body: string;
  targetFid: number;
};

export async function sendMiniAppNotification({
  url,
  token,
  title,
  body,
  targetFid,
}: MiniAppNotificationPayload) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notification_id: crypto.randomUUID(),
      token,
      title,
      body,
      target_fids: [targetFid],
    }),
  });

  if (!res.ok) {
    console.error(
      "Failed to send mini app notification",
      await res.text()
    );
  }
}
