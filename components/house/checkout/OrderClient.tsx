"use client";

import { useStore } from "@/context/StoreContext";
import { waLink } from "@/lib/whatsapp";
import { Button } from "../primitives";

/**
 * The WhatsApp handoff on the confirmation page.
 *
 * Split out as the only client-side part of that page: the message is built
 * from the order the browser remembers, and everything else — including
 * whether the payment actually landed — is decided on the server, where it
 * cannot be edited by whoever is looking at it.
 */
export default function OrderSendButton() {
  const { lastOrder, orderMessageText } = useStore();
  if (!lastOrder) return null;

  return (
    <Button href={waLink(orderMessageText(lastOrder))} target="_blank" rel="noopener">
      Send order {lastOrder.ref} on WhatsApp
    </Button>
  );
}
