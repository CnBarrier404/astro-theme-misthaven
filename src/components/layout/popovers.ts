function positionPopover(popover: HTMLElement, trigger: HTMLButtonElement) {
  const { bottom, right, width } = trigger.getBoundingClientRect();
  const documentRight = document.documentElement.getBoundingClientRect().right;
  popover.style.top = `${bottom + window.scrollY}px`;
  popover.style.right = `${documentRight - right}px`;
  popover.style.setProperty("--popover-trigger-width", `${width}px`);
}

function findTrigger(popover: HTMLElement) {
  return document.querySelector<HTMLButtonElement>(`button[popovertarget="${CSS.escape(popover.id)}"]`);
}

const hasAnchorPositioning = CSS.supports("top: anchor(bottom)");

if (!hasAnchorPositioning) {
  document.addEventListener(
    "beforetoggle",
    (event) => {
      const popover = event.target;
      if (!(popover instanceof HTMLElement) || !popover.hasAttribute("data-anchored-popover")) return;
      if (!(event instanceof ToggleEvent) || event.newState !== "open") return;

      const trigger = findTrigger(popover);
      if (trigger) positionPopover(popover, trigger);
    },
    { capture: true },
  );
}

window.addEventListener(
  "resize",
  () => {
    for (const popover of document.querySelectorAll<HTMLElement>("[data-anchored-popover]:popover-open")) {
      const trigger = findTrigger(popover);
      if (!trigger) continue;

      if (getComputedStyle(trigger).display === "none") popover.hidePopover();
      else if (!hasAnchorPositioning) positionPopover(popover, trigger);
    }
  },
  { passive: true },
);
