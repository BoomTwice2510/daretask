// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message, rating } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const toEmail = process.env.FEEDBACK_TO_EMAIL!;
    if (!toEmail) {
      throw new Error("FEEDBACK_TO_EMAIL not set");
    }

    await resend.emails.send({
      from: "Dare Feedback <feedback@dareprotocol.com>",
      to: toEmail,
      subject: `New Dare feedback (rating: ${rating || "N/A"})`,
      text: `Feedback:\n\n${message}\n\nRating: ${rating || "N/A"}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("feedback error", err);
    return NextResponse.json(
      { error: "Failed to send" },
      { status: 500 }
    );
  }
}
