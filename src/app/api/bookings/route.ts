import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bookingSchema = z.object({
  patientName: z.string().trim().min(2).max(100),
  patientEmail: z.string().trim().email().max(254),
  patientPhone: z.string().trim().min(8).max(20).regex(/^[+0-9() -]+$/),
  clinicianName: z.string().trim().min(3).max(120),
  scheduledAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = bookingSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid booking details", details: parsed.error.flatten() }, { status: 400 });
    const scheduledAt = new Date(parsed.data.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
      return NextResponse.json({ error: "Choose a future appointment date and time" }, { status: 400 });
    }
    const booking = await prisma.booking.create({
      data: {
        patientName: parsed.data.patientName,
        patientEmail: parsed.data.patientEmail,
        patientPhone: parsed.data.patientPhone,
        clinicianName: parsed.data.clinicianName,
        scheduledAt,
        amountPaise: 49900,
      },
      select: { id: true, status: true, scheduledAt: true, amountPaise: true },
    });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("booking.create failed", error);
    return NextResponse.json({ error: "Booking service unavailable. Check database configuration." }, { status: 500 });
  }
}
