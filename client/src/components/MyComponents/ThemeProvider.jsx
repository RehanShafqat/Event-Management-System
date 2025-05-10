// src/components/theme-provider.tsx
// Not needed for Vite, but included for clarity if copied from Next.js examples
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
