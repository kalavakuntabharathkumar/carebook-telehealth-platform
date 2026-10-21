import twilio from "twilio";

export async function sendBookingSms(to: string, message: string) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.info(`[SMS not sent; Twilio not configured] to=${to} message=${message}`);
    return { sent: false, reason: "not-configured" as const };
  }
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const result = await client.messages.create({ to, from: TWILIO_FROM_NUMBER, body: message });
  return { sent: true, sid: result.sid };
}
