"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ToastState } from "../types";

const InfoIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="7.25" y="7" width="1.5" height="5" rx="0.75" />
    <circle cx="8" cy="4.5" r="0.875" />
  </svg>
);
const SuccessIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="7" />
    <polyline points="4.5,8.5 7,11 11.5,5.5" />
  </svg>
);
const WarningIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1.5L14.5 13H1.5L8 1.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="7.25" y="6" width="1.5" height="4" rx="0.75" />
    <circle cx="8" cy="11.5" r="0.875" />
  </svg>
);
const ErrorIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="8" cy="8" r="7" />
    <line x1="5.5" y1="5.5" x2="10.5" y2="10.5" /><line x1="10.5" y1="5.5" x2="5.5" y2="10.5" />
  </svg>
);

const severityTone: Record<string, { icon: ReactNode; fallback: string }> = {
  info: { icon: <InfoIcon />, fallback: "#38bdf8" },
  success: { icon: <SuccessIcon />, fallback: "#22c55e" },
  warning: { icon: <WarningIcon />, fallback: "#f59e0b" },
  error: { icon: <ErrorIcon />, fallback: "#fb7185" },
};

function shell(state: ToastState, index: number): CSSProperties {
  return {
    width: state.width,
    minHeight: Math.max(92, Math.round(state.height / 3)),
    padding: state.padding,
    borderRadius: state.radius,
    border: `${state.borderWidth}px solid ${state.border}`,
    boxShadow: `0 ${Math.round(state.shadow / 3) + index * 3}px ${state.shadow + index * 6}px rgba(0,0,0,.28)`,
    background: state.background,
    color: state.foreground,
    fontFamily: state.fontFamily,
    opacity: state.disabled || state.previewState === "closed" ? 0.55 : 1,
    transform: state.motion ? `translate(${index * 6}px, ${index * 6}px)` : undefined,
    transition: state.motion ? "opacity 0.3s ease, transform 0.3s ease" : "none",
  };
}

export default function LivePreview({ state }: { state: ToastState }) {
  const tone = severityTone[state.severity] ?? severityTone.info;
  const accent = state.accent || tone.fallback;
  const count = Math.max(1, Math.min(5, Math.round(state.stackCount)));
  const liveRole = state.role === "alert" || state.severity === "error" ? "alert" : "status";
  const livePoliteness = liveRole === "alert" ? "assertive" : "polite";
  const isFocused = state.previewState === "focus";

  return (
    <section
      id={state.id}
      role={state.role === "region" ? "region" : undefined}
      aria-label={state.ariaLabel}
      data-placement={state.placement}
      data-swipe-direction={state.swipeDirection}
      className="grid gap-3"
      style={{ justifyItems: state.placement.includes("right") ? "end" : "start" }}
    >
      {Array.from({ length: count }, (_, index) => (
        <article
          key={index}
          role={liveRole}
          aria-live={livePoliteness}
          aria-atomic="true"
          tabIndex={state.disabled ? -1 : state.tabIndex}
          className="grid gap-3"
          style={{
            ...shell(state, index),
            outline: isFocused && index === 0 ? `3px solid ${accent}` : "none",
            outlineOffset: isFocused && index === 0 ? 4 : 0,
          }}
        >
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-sm font-black" style={{ borderColor: accent, color: accent }}>
              {tone.icon}
            </span>
            <div className="grid min-w-0 flex-1 gap-1">
              <h3 className="m-0" style={{ fontSize: state.titleSize, fontWeight: state.fontWeight }}>
                {index === 0 ? state.title : `${state.title} ${index + 1}`}
              </h3>
              <p className="m-0" style={{ color: state.muted, fontSize: state.bodySize }}>
                {state.description}
              </p>
            </div>
            {state.dismissible ? (
              <button type="button" disabled={state.disabled} aria-label="Dismiss toast" className="rounded-xl border px-3 py-2" style={{ borderColor: state.border, color: state.foreground, lineHeight: 0 }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="2" y1="2" x2="12" y2="12" /><line x1="12" y1="2" x2="2" y2="12" />
                </svg>
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: state.muted }}>
            <span>{state.helper}</span>
            <span>{state.duration}ms</span>
          </div>
          {state.showAction ? (
            <button type="button" disabled={state.disabled} className="justify-self-start rounded-xl px-4 py-2 text-sm font-bold" style={{ background: accent, color: "#020617" }}>
              {state.label}
            </button>
          ) : null}
        </article>
      ))}
    </section>
  );
}
