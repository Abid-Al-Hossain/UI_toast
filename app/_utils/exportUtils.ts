import type { ToastState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: ToastState, fileName = "toast"): ExportPayload {
  return { fileName: `${fileName || "toast"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: ToastState) {
  return [
    "import * as React from \"react\";",
    "",
    "const state = " + JSON.stringify(state, null, 2) + ";",
    "",
    "const severityTone = {",
    "  info: { icon: \"i\", fallback: \"#38bdf8\" },",
    "  success: { icon: \"+\", fallback: \"#22c55e\" },",
    "  warning: { icon: \"!\", fallback: \"#f59e0b\" },",
    "  error: { icon: \"!\", fallback: \"#fb7185\" },",
    "};",
    "",
    "export default function ToastComponent() {",
    "  const tone = severityTone[state.severity] || severityTone.info;",
    "  const accent = state.accent || tone.fallback;",
    "  const count = Math.max(1, Math.min(5, Math.round(state.stackCount)));",
    "  const liveRole = state.role === \"alert\" || state.severity === \"error\" ? \"alert\" : \"status\";",
    "  const livePoliteness = liveRole === \"alert\" ? \"assertive\" : \"polite\";",
    "",
    "  return (",
    "    <section id={state.id} role={state.role === \"region\" ? \"region\" : undefined} aria-label={state.ariaLabel} data-placement={state.placement} data-swipe-direction={state.swipeDirection} style={{ display: \"grid\", gap: 12, justifyItems: state.placement.includes(\"right\") ? \"end\" : \"start\" }}>",
    "      {Array.from({ length: count }, (_, index) => (",
    "        <article key={index} role={liveRole} aria-live={livePoliteness} aria-atomic=\"true\" tabIndex={state.disabled ? -1 : state.tabIndex} style={{",
    "          width: state.width,",
    "          minHeight: Math.max(92, Math.round(state.height / 3)),",
    "          padding: state.padding,",
    "          borderRadius: state.radius,",
    "          border: state.borderWidth + \"px solid \" + state.border,",
    "          boxShadow: \"0 \" + (Math.round(state.shadow / 3) + index * 3) + \"px \" + (state.shadow + index * 6) + \"px rgba(0,0,0,.28)\",",
    "          background: state.background,",
    "          color: state.foreground,",
    "          fontFamily: state.fontFamily,",
    "          opacity: state.disabled || state.previewState === \"closed\" ? 0.55 : 1,",
    "          transform: state.motion ? \"translate(\" + index * 6 + \"px, \" + index * 6 + \"px)\" : undefined,",
    "          transition: state.motion ? \"opacity 0.3s ease, transform 0.3s ease\" : \"none\",",
    "        }}>",
    "          <div style={{ display: \"flex\", alignItems: \"flex-start\", gap: 12 }}>",
    "            <span aria-hidden=\"true\" style={{ display: \"grid\", placeItems: \"center\", width: 36, height: 36, flexShrink: 0, borderRadius: 12, border: \"1px solid \" + accent, color: accent, fontWeight: 900 }}>{tone.icon}</span>",
    "            <div style={{ display: \"grid\", gap: 4, flex: 1, minWidth: 0 }}>",
    "              <h3 style={{ margin: 0, fontSize: state.titleSize, fontWeight: state.fontWeight }}>{index === 0 ? state.title : state.title + \" \" + (index + 1)}</h3>",
    "              <p style={{ margin: 0, color: state.muted, fontSize: state.bodySize }}>{state.description}</p>",
    "            </div>",
    "            {state.dismissible ? <button type=\"button\" disabled={state.disabled} aria-label=\"Dismiss toast\" style={{ border: \"1px solid \" + state.border, borderRadius: 12, padding: \"8px 12px\", background: \"transparent\", color: state.foreground }}>x</button> : null}",
    "          </div>",
    "          <div style={{ display: \"flex\", flexWrap: \"wrap\", justifyContent: \"space-between\", gap: 12, color: state.muted, fontSize: 12 }}><span>{state.helper}</span><span>{state.duration}ms</span></div>",
    "          {state.showAction ? <button type=\"button\" disabled={state.disabled} style={{ justifySelf: \"start\", border: 0, borderRadius: 12, padding: \"8px 16px\", background: accent, color: \"#020617\", fontWeight: 800 }}>{state.label}</button> : null}",
    "        </article>",
    "      ))}",
    "    </section>",
    "  );",
    "}",
    "",
  ].join("\n");
}
