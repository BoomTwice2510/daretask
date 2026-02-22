// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

// TEMP: in-memory store (server restart pe reset ho jayega)
const notificationStore = new Map<
  number,
  { url: string; token: string; appFid?: number }
>();

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
      // user ne Dare Protocol mini app ke liye notifications ON ki
      notificationStore.set(fid, {
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
      // user ne notifications OFF ki
      notificationStore.delete(fid);
      console.log("Removed notification token for fid", fid);
    }

    // hamesha jaldi 200 do, warna Base app error dikha sakta hai
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in webhook:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// isko export karenge taaki doosri API routes se use kar sako
export function getNotificationDetails(fid: number) {
  return notificationStore.get(fid);
}
