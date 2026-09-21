import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { message, rating, screenshotUrl } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const toEmail = process.env.FEEDBACK_TO_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!toEmail || !resendApiKey) {
      console.error(
        "Feedback email configuration is missing (FEEDBACK_TO_EMAIL or RESEND_API_KEY)"
      );
      return NextResponse.json(
        { error: "Feedback service is not configured" },
        { status: 503 }
      );
    }

    const resend = new Resend(resendApiKey);

    const textParts = [
      `Feedback:\n${message}`,
      `\nRating: ${rating || "N/A"}`,
      screenshotUrl ? `\nScreenshot (data URL):\n${screenshotUrl}` : "",
    ];

    const result = await resend.emails.send({
      from: "Dare Feedback <onboarding@resend.dev>",
      to: toEmail,
      subject: `New Dare feedback (rating: ${rating || "N/A"})`,
      text: textParts.join("\n"),
    });

    if (result.error) {
      console.error("Resend error:", result.error);
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
