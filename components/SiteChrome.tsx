import AnnouncementBar from "./AnnouncementBar";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import WhatsAppFloat from "./WhatsAppFloat";
import ToastHost from "./ToastHost";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AnnouncementBar />
      <SiteHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
      <ToastHost />
    </div>
  );
}
