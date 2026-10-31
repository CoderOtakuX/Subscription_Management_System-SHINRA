"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepItem {
  id: string;
  label: string;
  description?: string;
}

export type Step = StepItem;

interface StepperProps {
  steps: StepItem[] | string[];
  currentStep: string;
  className?: string;
  onStepClick?: (stepId: string) => void;
}

export function Stepper({
  steps,
  currentStep,
  className,
  onStepClick,
}: StepperProps) {
  // Normalize steps to StepItem format
  const normalizedSteps: StepItem[] = steps.map((step) =>
    typeof step === "string" ? { id: step, label: step } : step
  );

  const currentIndex = normalizedSteps.findIndex(
    (s) => s.id.toLowerCase() === currentStep.toLowerCase() || s.label.toLowerCase() === currentStep.toLowerCase()
  );

  return (
    <div className={cn("w-full py-4", className)}>
      {/* Horizontal on md+, Vertical below md */}
      <ol className="flex flex-col md:flex-row items-start md:items-center w-full gap-4 md:gap-0">
        {normalizedSteps.map((step, index) => {
          const isCompleted = currentIndex > index;
          const isCurrent = currentIndex === index;
          const isUpcoming = currentIndex < index;
          const isLast = index === normalizedSteps.length - 1;

          return (
            <li
              key={step.id}
              className={cn(
                "flex-1 flex flex-row md:flex-col lg:flex-row items-center relative w-full md:w-auto",
                !isLast && "md:after:content-[''] md:after:w-full md:after:h-0.5 md:after:border-b md:after:border-outline md:after:inline-block md:after:mx-2 lg:after:mx-4"
              )}
            >
              <button
                type="button"
                disabled={!onStepClick}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "flex items-center gap-3 text-left transition-colors group",
                  onStepClick ? "cursor-pointer" : "cursor-default"
                )}
              >
                {/* Step Circle / Badge */}
                <span
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-label-md font-semibold shrink-0 transition-all",
                    isCompleted && "bg-secondary text-on-secondary",
                    isCurrent && "bg-primary text-on-primary ring-4 ring-primary-container",
                    isUpcoming && "bg-surface-container text-on-surface-variant border border-outline"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>

                {/* Step Label */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-body-md font-medium leading-none",
                      isCurrent && "text-primary font-bold",
                      isCompleted && "text-on-surface font-semibold",
                      isUpcoming && "text-on-surface-variant"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-body-sm text-on-surface-muted mt-0.5">
                      {step.description}
                    </span>
                  )}
                </div>
              </button>

              {/* Mobile connecting line between steps */}
              {!isLast && (
                <div className="md:hidden ml-4 pl-0.5 my-1.5 h-6 border-l-2 border-outline" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
