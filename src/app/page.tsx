'use client';

import { FormEvent, useState } from "react";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to create booking");
      setMessage(`Booking request received. Reference: ${data.booking.id}`);
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header><div className="brand">✚ CareBook</div><span className="pill">Demo · Secure-by-design starter</span></header>
      <main>
        <section className="hero">
          <div>
            <span className="pill">Care that fits your schedule</span>
            <h1>Your next step toward feeling better.</h1>
            <p>Book a virtual consultation, receive appointment updates, and pay through a secure hosted checkout flow. This demo does not provide medical advice.</p>
            <div className="grid3">
              <div className="panel"><strong>Simple booking</strong><p className="small">A clear flow from details to confirmation.</p></div>
              <div className="panel"><strong>Payment-ready</strong><p className="small">Razorpay order and webhook endpoints.</p></div>
              <div className="panel"><strong>Reminders</strong><p className="small">Twilio SMS integration scaffold.</p></div>
            </div>
          </div>
          <div className="panel">
            <h2>Request an appointment</h2>
            <p>Use sample details only while developing locally.</p>
            <form onSubmit={submitBooking}>
              <label>Full name<input name="patientName" minLength={2} maxLength={100} required placeholder="Aarav Sharma" /></label>
              <label>Email<input name="patientEmail" type="email" required placeholder="you@example.com" /></label>
              <label>Phone number<input name="patientPhone" type="tel" required pattern="[+0-9() -]{8,20}" placeholder="+91 98765 43210" /></label>
              <label>Clinician<select name="clinicianName" required defaultValue=""><option value="" disabled>Select a clinician</option><option>Dr. Asha Rao · General consultation</option><option>Dr. Neel Mehta · Wellness consultation</option><option>Dr. Mira Sen · Follow-up consultation</option></select></label>
              <label>Preferred date and time<input name="scheduledAt" type="datetime-local" required /></label>
              <button disabled={busy}>{busy ? "Submitting…" : "Request booking"}</button>
              {message && <div className="notice" role="status">{message}</div>}
            </form>
            <p className="small">Booking requests are pending until a payment/confirmation workflow is completed.</p>
          </div>
        </section>
      </main>
    </>
  );
}
