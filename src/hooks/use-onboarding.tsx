import { createContext, use, useState, type ReactNode } from "react";

import {
  hasCompletedSetup,
  markSetupCompleted,
} from "@/features/onboarding/onboarding";

type OnboardingContextValue = {
  setupCompleted: boolean;
  completeSetup: (showTutorial: boolean) => void;
  tutorialVisible: boolean;
  closeTutorial: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

// Whether the first setup is done, and the tutorial the end of the setup opens.
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [setupCompleted, setSetupCompleted] = useState(hasCompletedSetup);
  const [tutorialVisible, setTutorialVisible] = useState(false);

  function completeSetup(showTutorial: boolean) {
    markSetupCompleted();
    setSetupCompleted(true);
    setTutorialVisible(showTutorial);
  }

  return (
    <OnboardingContext
      value={{
        setupCompleted,
        completeSetup,
        tutorialVisible,
        closeTutorial: () => setTutorialVisible(false),
      }}
    >
      {children}
    </OnboardingContext>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const context = use(OnboardingContext);
  if (context === null) {
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  }
  return context;
}
