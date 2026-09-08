import type { Metadata } from "next";

/**
 * The styleguide sits outside the `(store)` route group, so it inherits the
 * document and the three faces from the root layout and none of the legacy
 * storefront's chrome or CSS. `.house` is what switches on the token layer.
 */
export const metadata: Metadata = {
  title: "House system",
  robots: { index: false, follow: false },
};

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  return <div className="house">{children}</div>;
}
