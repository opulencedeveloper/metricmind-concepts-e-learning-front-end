import type { Metadata } from "next";
import RootClientWrapper from "@/components/RootClientWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetricMind",
  description: "Learn, Grow, Succeed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <RootClientWrapper>
          {children}
        </RootClientWrapper>
      </body>
    </html>
  );
}
