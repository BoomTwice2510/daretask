// app/api/test-notify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendMiniAppNotification } from "@/lib/sendMiniAppNotification";
import { getNotificationDetails } from "../webhook/route";

export async function POST(req: NextRequest) {
  const { fid } = await req.json(); // jisko notify karna hai

  const details = getNotificationDetails(fid);
  if (!details) {
    return NextResponse.json(
      { ok: false, reason: "No notification token for this fid" },
      { status: 400 }
    );
  }

  await sendMiniAppNotification({
    url: details.url,
    token: details.token,
    title: "Dare update",
    body: "Your dare just changed state. Tap to view the onchain details on Dare Protocol.",
    targetFid: fid,
  });

  return NextResponse.json({ ok: true });
}
