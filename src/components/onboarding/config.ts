export const ONBOARDING_TOTAL_STEPS = 4;

export const ONBOARDING_COPY = {
  welcome: {
    eyebrow: "Welcome",
    title: "Track weight with clarity",
    description:
      "Set your numbers, activity, and goal so we can show BMI, progress, and daily calorie needs.",
    cta: "Get started",
  },
  numbers: {
    eyebrow: `Step 1 of ${ONBOARDING_TOTAL_STEPS}`,
    title: "Your numbers",
    description: "Use the pickers — no typing needed.",
  },
  aboutYou: {
    eyebrow: `Step 2 of ${ONBOARDING_TOTAL_STEPS}`,
    title: "About you",
    description:
      "These details help estimate how many calories you need each day.",
  },
  goal: {
    eyebrow: `Step 3 of ${ONBOARDING_TOTAL_STEPS}`,
    title: "Your goal",
    description: "Pick a target weight. You can change this later in Settings.",
  },
  summary: {
    eyebrow: `Step 4 of ${ONBOARDING_TOTAL_STEPS}`,
    title: "Your BMI",
  },
  saveError: "Could not save your profile. Try again.",
} as const;
