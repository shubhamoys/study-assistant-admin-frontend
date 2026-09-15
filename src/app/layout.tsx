import type { Metadata } from "next";
import { Fragment_Mono, Fraunces, Lexend } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

// Same three fonts as study-assistant-frontend — see that repo's
// UI_UX_DESIGN.md §3.1 for the rationale. Kept identical for brand
// consistency between the two apps.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: "variable",
  axes: ["opsz"],
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["400", "500", "600", "700"],
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-fragment-mono",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "StudyLoop — Admin",
  description: "Platform administration for StudyLoop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${lexend.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
