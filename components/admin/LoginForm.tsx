"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/admin/actions";

const EMPTY: ActionState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, EMPTY);

  return (
    <form action={action} className="ad-card">
      <label className="ad-field">
        <span>Password</span>
        <input
          className="ad-input"
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          required
        />
      </label>

      {state.error && (
        <p style={{ color: "var(--ad-accent)", fontSize: 13, margin: "0 0 12px" }}>{state.error}</p>
      )}

      <button className="ad-btn" type="submit" disabled={pending} style={{ width: "100%" }}>
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
