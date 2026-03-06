"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type InstallerFlowStep = {
  kind: "system" | "input" | "command";
  text: string;
  delayBefore?: number;
  appendToPrevious?: boolean;
};

export type InstallerFlow = {
  id: string;
  label: string;
  steps: InstallerFlowStep[];
};

type InstallerFlowTerminalProps = {
  title: string;
  flows: InstallerFlow[];
};

const LINE_PAUSE_MS = 260;
const USER_INPUT_DELAY_MS = 700;

export function InstallerFlowTerminal({
  title,
  flows,
}: InstallerFlowTerminalProps) {
  const safeFlows = useMemo(
    () => flows.filter((flow) => flow.steps.length > 0),
    [flows],
  );
  const [activeFlowId, setActiveFlowId] = useState<string>(
    safeFlows[0]?.id ?? "",
  );
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [stepPhase, setStepPhase] = useState<"waiting" | "typing">("waiting");
  const outputRef = useRef<HTMLDivElement | null>(null);

  const activeFlow =
    safeFlows.find((flow) => flow.id === activeFlowId) ?? safeFlows[0];
  const isDone = !activeFlow || stepIndex >= activeFlow.steps.length;

  useEffect(() => {
    if (!activeFlow || isDone) {
      return;
    }

    const currentStep = activeFlow.steps[stepIndex];
    if (!currentStep) {
      return;
    }

    if (currentStep.kind === "system") {
      const timer = window.setTimeout(() => {
        setVisibleLines((previous) => [...previous, currentStep.text]);
        setStepIndex((value) => value + 1);
      }, currentStep.delayBefore ?? LINE_PAUSE_MS);

      return () => window.clearTimeout(timer);
    }

    const typedText =
      currentStep.kind === "command"
        ? `$ ${currentStep.text}`
        : currentStep.text;

    if (stepPhase === "waiting") {
      const delay = currentStep.delayBefore ?? USER_INPUT_DELAY_MS;
      const timer = window.setTimeout(() => {
        if (!currentStep.appendToPrevious) {
          setVisibleLines((previous) => [...previous, ""]);
        }
        setStepPhase("typing");
      }, delay);

      return () => window.clearTimeout(timer);
    }

    if (charIndex < typedText.length) {
      const jitter = 18 + Math.floor(Math.random() * 32);
      const timer = window.setTimeout(() => {
        setVisibleLines((previous) => {
          const next = [...previous];

          if (currentStep.appendToPrevious) {
            if (next.length === 0) {
              next.push(typedText[charIndex]);
            } else {
              next[next.length - 1] =
                (next[next.length - 1] ?? "") + typedText[charIndex];
            }
            return next;
          }

          if (next.length === 0) {
            next.push(typedText[charIndex]);
          } else {
            next[next.length - 1] =
              (next[next.length - 1] ?? "") + typedText[charIndex];
          }

          return next;
        });
        setCharIndex((value) => value + 1);
      }, jitter);

      return () => window.clearTimeout(timer);
    }

    const nextLineTimer = window.setTimeout(() => {
      setStepIndex((value) => value + 1);
      setCharIndex(0);
      setStepPhase("waiting");
    }, LINE_PAUSE_MS / 2);

    return () => window.clearTimeout(nextLineTimer);
  }, [activeFlow, charIndex, isDone, stepIndex, stepPhase]);

  useEffect(() => {
    const container = outputRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight;
  }, [visibleLines, stepIndex, charIndex, isDone]);

  useEffect(() => {
    if (!isDone) {
      return;
    }

    const timer = window.setTimeout(() => {
      setVisibleLines([]);
      setStepIndex(0);
      setCharIndex(0);
      setStepPhase("waiting");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isDone]);

  if (!activeFlow) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {safeFlows.map((flow) => {
          const isActive = flow.id === activeFlow.id;
          return (
            <button
              key={flow.id}
              type="button"
              onClick={() => {
                setActiveFlowId(flow.id);
                setVisibleLines([]);
                setStepIndex(0);
                setCharIndex(0);
                setStepPhase("waiting");
              }}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                  : "border-slate-400 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {flow.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 dark:border-slate-700">
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {title}
          </p>
        </div>
        <div
          ref={outputRef}
          className="hide-scrollbar h-[310px] overflow-x-auto overflow-y-auto space-y-1 p-4 font-mono text-sm leading-relaxed text-slate-100"
        >
          {visibleLines.map((line, index) => (
            <p key={`${activeFlow.id}-${index}`} className="wrap-break-word">
              {line === "" ? "\u00A0" : line}
            </p>
          ))}
          {!isDone ? <p className="animate-pulse text-slate-500">▋</p> : null}
        </div>
      </div>
    </div>
  );
}
