import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendBookingSms } from "@/lib/twilio";

const schema = z.object({ to: z.string().min(8).max(20), message: z.string().min(1).max(300) });

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Valid to and message are required" }, { status: 400 });
  try {
    const result = await sendBookingSms(parsed.data.to, parsed.data.message);
    return NextResponse.json(result, { status: result.sent ? 200 : 202 });
  } catch (error) {
    console.error("sms.send failed", error);
    return NextResponse.json({ error: "SMS could not be sent" }, { status: 502 });
  }
}
