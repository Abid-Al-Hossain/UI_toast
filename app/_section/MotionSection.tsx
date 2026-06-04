"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import Switch from "@/components/shared/input/Switch";
import type { ToastState } from "../types";

type Props = { state: ToastState; update: <K extends keyof ToastState>(key: K, value: ToastState[K]) => void };

export default function MotionSection({ state, update }: Props) {
  return <SectionCard title="Motion" subtitle="Motion controls for native toast generation."><Switch label="Motion safe" checked={state.motion} onChange={(value) => update("motion", value)} />
<Slider label="Duration" value={state.duration} min={0} max={6000} step={1} onChange={(value) => update("duration", value)} /></SectionCard>;
}
