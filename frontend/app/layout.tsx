import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EchoMind — A place for everything you say",
  description: "A voice-first personal memory agent.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
