// Tailwind needs complete static utility strings.
export const dropdownMotionClass =
  "hidden -translate-y-1 opacity-0 transition transition-discrete duration-150 ease-soft data-open:block data-open:translate-y-0 data-open:opacity-100 starting:data-open:-translate-y-1 starting:data-open:opacity-0";

export const popoverMotionClass =
  "-translate-y-1 opacity-0 transition-[opacity,translate,display,overlay] transition-discrete duration-150 ease-soft open:translate-y-0 open:opacity-100 starting:open:-translate-y-1 starting:open:opacity-0";

export const anchoredPopoverClass =
  "absolute inset-auto top-[anchor(bottom)] right-[anchor(right)] m-0 mt-2 [position-anchor:auto]";

export const nudgeForwardClass = "transition-transform duration-200 ease-soft group-hover:translate-x-0.5";
export const nudgeBackClass = "transition-transform duration-200 ease-soft group-hover:-translate-x-0.5";

export function prefersReducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getSoftEasing() {
  return getComputedStyle(document.documentElement).getPropertyValue("--ease-soft").trim() || "ease-out";
}

export function fadeInUpdatedText(element: HTMLElement) {
  if (prefersReducedMotion()) return;
  element.animate({ opacity: [0, 1] }, { duration: 240, easing: getSoftEasing() });
}
