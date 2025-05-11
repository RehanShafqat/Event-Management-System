export const ROLES = {
  PRESIDENT: "President",
  VP: "VP",
  AVP: "AVP",
  HEAD: "Head",
  DEPUTY: "Deputy",
  OFFICER: "Officer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
