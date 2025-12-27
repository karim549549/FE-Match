"use client";

import { useMemo, useRef, useEffect } from "react";
import { StepItem } from "./step-item";
import { StepDescription } from "./step-description";
import { STEP_DATA } from "./step-data";

interface VerticalStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function VerticalStepIndicator({
  currentStep,
  totalSteps,
}: VerticalStepIndicatorProps) {
  // #region agent log
  const renderCountRef = useRef(0);
  useEffect(() => {
    renderCountRef.current += 1;
    const timestamp = Date.now();
    fetch('http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'vertical-step-indicator.tsx:13',message:'VerticalStepIndicator render',data:{renderCount:renderCountRef.current,currentStep,totalSteps,timestamp},timestamp,sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  });
  // #endregion

  // Memoize current step data to prevent recalculation
  const currentStepData = useMemo(
    () => STEP_DATA.find((s) => s.number === currentStep),
    [currentStep]
  );

  return (
    <div className="flex flex-col gap-6 pt-8">
      {STEP_DATA.map((step, index) => (
        <StepItem
          key={step.number}
          step={step}
          currentStep={currentStep}
          index={index}
          totalSteps={totalSteps}
        />
      ))}

      {/* Description Section with Translate/Encrypt Effect */}
      {currentStepData && <StepDescription step={currentStepData} />}
    </div>
  );
}

