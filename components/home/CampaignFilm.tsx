"use client";

import { useEffect, useRef, useState } from "react";
import Rise from "./Rise";

/**
 * A statement with the campaign film running full-bleed beneath it.
 *
 * The film is 10MB, which is far too much to hand every visitor on page load,
 * so nothing is fetched until the section is close to the viewport: the
 * `<video>` starts with no `src` and only a poster, and the source is attached
 * once it's within 400px. It then plays only while actually on screen and
 * pauses when scrolled past, which keeps it off the CPU for the rest of the
 * page.
 *
 * Three conditions skip the video entirely and leave the poster: a
 * reduced-motion preference, the browser's data-saver flag, and a connection
 * reporting 2G. Autoplay also requires muting, so the film starts silent with
 * a control to turn sound on — it has an audio track and at 35 seconds it is
 * a film rather than wallpaper.
 */
export default function CampaignFilm({
  title,
  note,
  src,
  poster,
  caption,
}: {
  title: React.ReactNode;
  note?: string;
  src: string;
  poster: string;
  caption?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  // Decide once whether this visitor should get the film at all.
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const thrifty = Boolean(conn?.saveData) || ["slow-2g", "2g"].includes(conn?.effectiveType ?? "");
    if (reduced || thrifty) return;

    // Attach the source a little before it is needed.
    const arm = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          arm.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    arm.observe(el);

    // Play only while it is genuinely on screen.
    const toggle = new IntersectionObserver(
      (entries) => setPlaying(entries.some((e) => e.isIntersecting)),
      { threshold: 0.2 },
    );
    toggle.observe(el);

    return () => { arm.disconnect(); toggle.disconnect(); };
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || !armed) return;
    if (playing) {
      // Autoplay can still be refused; the poster stays up if it is.
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [armed, playing]);

  return (
    <section style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--hp-line)" }}>
      <div className="hp-shell" style={{ paddingTop: "var(--hp-section)", paddingBottom: "clamp(34px, 4vw, 64px)" }}>
        <Rise>
          <h2 className="hp-display hp-statement" style={{ maxWidth: "16ch" }}>{title}</h2>
          {note && (
            <p className="hp-body" style={{ margin: "clamp(26px,3vw,44px) 0 0", maxWidth: "44ch" }}>{note}</p>
          )}
        </Rise>
      </div>

      <div ref={wrap} className="hp-film">
        <video
          ref={video}
          // Held back until the observer arms it — see the note above.
          src={armed ? src : undefined}
          poster={poster}
          muted={muted}
          loop
          playsInline
          preload="none"
          aria-label="Air Dior campaign film"
          onCanPlay={() => setReady(true)}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: ready ? 1 : 0.999,
            transition: "opacity .6s var(--hp-ease)",
          }}
        />

        <div className="hp-film-bar">
          {caption && <span className="hp-label hp-label-light">{caption}</span>}
          {armed && (
            <button
              type="button"
              onClick={() => {
                const v = video.current;
                if (!v) return;
                v.muted = !v.muted;
                setMuted(v.muted);
              }}
              aria-pressed={!muted}
              className="hp-film-sound"
            >
              {muted ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M11 5 6 9H3v6h3l5 4z" /><path d="m17 9 4 6" /><path d="m21 9-4 6" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M11 5 6 9H3v6h3l5 4z" /><path d="M16 9a4 4 0 0 1 0 6" /><path d="M19 6.5a8 8 0 0 1 0 11" />
                </svg>
              )}
              {muted ? "Sound off" : "Sound on"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
