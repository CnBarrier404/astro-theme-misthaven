/*
 * Shared motion utility lists. Each value is a complete static string so Tailwind can detect it.
 * `prefers-reduced-motion` is handled globally in `base.css`.
 */

/**
 * Reveal for menus and panels toggled with a `data-open` attribute: hidden while closed,
 * fading in and dropping 4px when opened, then fading back out before `display: none` applies.
 */
export const dropdownMotionClass =
  "hidden -translate-y-1 opacity-0 transition transition-discrete duration-150 ease-soft data-open:block data-open:translate-y-0 data-open:opacity-100 starting:data-open:-translate-y-1 starting:data-open:opacity-0";

/** Moves an icon inside a `group` link 2px in its direction of travel on hover. */
export const nudgeForwardClass = "transition-transform duration-200 ease-soft group-hover:translate-x-0.5";
export const nudgeBackClass = "transition-transform duration-200 ease-soft group-hover:-translate-x-0.5";

/** The `--ease-soft` token for Web Animations, which cannot read CSS variables. */
export const softEasing = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Client-only: fades in an element whose text was just replaced, such as a view count that arrived late. */
export function fadeInUpdatedText(element: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  element.animate({ opacity: [0, 1] }, { duration: 240, easing: softEasing });
}
