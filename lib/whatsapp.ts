import { SITE_CONFIG } from "./config";

export function waDigits(): string {
  return SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
}

export function waLink(text: string): string {
  return "https://wa.me/" + waDigits() + "?text=" + encodeURIComponent(text);
}
