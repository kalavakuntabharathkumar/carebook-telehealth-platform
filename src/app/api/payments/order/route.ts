import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

const schema = z.object({ bookingId: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    const booking = await prisma.booking.findUnique({ where: { id: parsed.data.bookingId } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.status !== "PENDING") return NextResponse.json({ error: "Booking is not payable" }, { status: 409 });

    const order = await getRazorpay().orders.create({
      amount: booking.amountPaise,
      currency: "INR",
      receipt: booking.id,
      notes: { bookingId: booking.id },
    });
    await prisma.booking.update({ where: { id: booking.id }, data: { paymentOrderId: order.id } });
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("payment.order failed", error);
    return NextResponse.json({ error: "Unable to create payment order. Check Razorpay configuration." }, { status: 500 });
  }
}
