import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Text to Speech - AI Narrator",
    description: "Convert your scripts into natural-sounding speech with AI-powered text-to-speech technology",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
