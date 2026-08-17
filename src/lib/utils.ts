import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// The standard shadcn/ui helper: merges conditional class names and
// resolves conflicting Tailwind utility classes (e.g. "p-2" vs "p-4").
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
