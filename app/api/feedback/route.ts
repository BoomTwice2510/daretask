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

    const toEmail = process.env.FEEDBACK_TO_EMAIL;
    if (!toEmail) {
      console.error("FEEDBACK_TO_EMAIL not set");
      return NextResponse.json(
        { error: "Config error" },
        { status: 500 }
      );
    }

    const result = await resend.emails.send({
      from: "Dare Feedback <onboarding@resend.dev>", // default Resend sender
      to: toEmail,
      subject: `New Dare feedback (rating: ${rating || "N/A"})`,
      text: `Feedback:\n\n${message}\n\nRating: ${rating || "N/A"}`,
    });

    if ((result as any).error) {
      console.error("Resend error:", (result as any).error);
      return NextResponse.json(
        { error: "Email send failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("feedback error", err);
    return NextResponse.json(
      { error: "Failed to send" },
      { status: 500 }
    );
  }
}
