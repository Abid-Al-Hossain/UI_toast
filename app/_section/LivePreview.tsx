"use client";

import type { CSSProperties } from "react";
import type { ToastState } from "../types";

const severityTone: Record<string, { icon: string; fallback: string }> = {
  info: { icon: "i", fallback: "#38bdf8" },
  success: { icon: "+", fallback: "#22c55e" },
  warning: { icon: "!", fallback: "#f59e0b" },
  error: { icon: "!", fallback: "#fb7185" },
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
              <button type="button" disabled={state.disabled} aria-label="Dismiss toast" className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: state.border, color: state.foreground }}>
                x
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
