import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareBook | Book care with confidence",
  description: "A demo telehealth booking and payments platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
