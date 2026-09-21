// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  removeNotificationDetails,
  saveNotificationDetails,
} from "@/lib/notification-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      event,
      fid,
      appFid,
      notificationDetails,
    }: {
      event: string;
      fid: number;
      appFid?: number;
      notificationDetails?: { url: string; token: string };
    } = body;

    // TODO: production me yahan signature / auth verify karo

    if (
      (event === "miniapp_added" || event === "notifications_enabled") &&
      notificationDetails?.url &&
      notificationDetails?.token
    ) {
      saveNotificationDetails(fid, {
        url: notificationDetails.url,
        token: notificationDetails.token,
        appFid,
      });

      console.log("Saved notification token for fid", fid);
    }

    if (
      event === "miniapp_removed" ||
      event === "notifications_disabled"
    ) {
      removeNotificationDetails(fid);
      console.log("Removed notification token for fid", fid);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in webhook:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
