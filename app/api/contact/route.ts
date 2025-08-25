// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, tel, email, title, message, locale } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const subject = title && title.trim() ? title : `New contact from ${name}`;

    await resend.emails.send({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO!, // あなたのGmail
      replyTo: email, // 受信メールからそのまま返信可能
      subject,
      text: [
        `Locale: ${locale ?? "-"}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Tel: ${tel ?? "-"}`,
        `Title: ${title ?? "-"}`,
        "",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact send error:", e);
    return NextResponse.json(
      { ok: false, error: "Send failed" },
      { status: 500 }
    );
  }
}
