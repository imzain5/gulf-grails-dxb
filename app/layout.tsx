import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import SiteChrome from "@/components/SiteChrome";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Gulf Grails — Luxury sneakers, verified. Dubai, UAE.",
    template: "%s · Gulf Grails",
  },
  description: "Jordan, Yeezy, Balenciaga, Dior and collab sneakers, verified in-house and delivered across the UAE. Cash on delivery or bank transfer — order directly on WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
