import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spilrix Distribution — Get Your Music Heard",
  description:
    "Distribute your music globally with Spilrix. Upload, track status, and reach listeners everywhere.",
  keywords: ["music distribution", "release music", "artist portal", "Spilrix"],
  openGraph: {
    title: "Spilrix Distribution",
    description: "Get your music heard everywhere.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
