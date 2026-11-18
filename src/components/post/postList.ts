import { getArtalkViewCounts, viewCountPlaceholder } from "@/components/comments/viewCounts";
import { fadeInUpdatedText, getSoftEasing, prefersReducedMotion } from "@/utils/motion";

export type SortMode = "latest" | "views";

export class PostListElement extends HTMLElement {
  #list?: HTMLOListElement;
  #items: HTMLLIElement[] = [];
  #counts = new Map<string, number>();
  #mode: SortMode = "latest";
  #request?: AbortController;
  #animations = new WeakMap<HTMLElement, Animation>();

  connectedCallback() {
    const list = this.querySelector("ol");
    if (!list || this.#list === list) return;

    this.#list = list;
    this.#items = [...list.querySelectorAll<HTMLLIElement>("li[data-post-path]")];
    const { viewServer, viewSite } = this.dataset;
    if (viewServer && viewSite && this.#items.length > 0) {
      this.#request = new AbortController();
      void this.#loadViewCounts(viewServer, viewSite, this.#request.signal);
    }
  }

  disconnectedCallback() {
    this.#request?.abort();
    this.#list = undefined;
  }

  sortBy(mode: SortMode) {
    this.#mode = mode;
    const list = this.#list;
    if (!list) return;

    const limit = Number(this.dataset.limit ?? this.#items.length);
    this.#items.forEach((item) => this.#animations.get(item)?.cancel());
    const reducedMotion = prefersReducedMotion();
    const previous = new Map<HTMLElement, DOMRect>();
    if (!reducedMotion) {
      for (const item of this.#items) {
        if (!item.hidden) previous.set(item, item.getBoundingClientRect());
      }
    }

    const items =
      mode === "latest" ? this.#items : this.#items.toSorted((left, right) => this.#views(right) - this.#views(left));

    items.forEach((item, index) => {
      item.hidden = index >= limit;
      list.append(item);
    });

    if (!reducedMotion) {
      const easing = getSoftEasing();
      for (const item of items) {
        if (!item.hidden) this.#animateItem(item, previous.get(item), easing);
      }
    }
  }

  #views(item: HTMLLIElement) {
    return this.#counts.get(item.dataset.postPath ?? "") ?? 0;
  }

  async #loadViewCounts(server: string, site: string, signal: AbortSignal) {
    try {
      const keys = this.#items.map((item) => item.dataset.postPath!);
      const counts = await getArtalkViewCounts(server, site, keys, signal);
      if (signal.aborted) return;
      this.#counts = counts;

      for (const item of this.#items) {
        const count = this.#views(item);
        const value = item.querySelector<HTMLElement>("[data-post-card-view-value]");
        if (count > 0 && value) {
          value.textContent = String(count);
          fadeInUpdatedText(value);
        } else if (value) {
          value.textContent = viewCountPlaceholder;
        }
      }

      if (this.#mode === "views") this.sortBy(this.#mode);
    } catch (error) {
      if (!signal.aborted) console.error("Failed to load Artalk view counts", error);
    }
  }

  #animateItem(item: HTMLElement, previous: DOMRect | undefined, easing: string) {
    const current = item.getBoundingClientRect();
    if (previous?.left === current.left && previous.top === current.top) return;

    const keyframes = previous
      ? {
          transform: [
            `translate(${previous.left - current.left}px, ${previous.top - current.top}px)`,
            "translate(0, 0)",
          ],
        }
      : { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] };

    this.#animations.set(item, item.animate(keyframes, { duration: 260, easing }));
  }
}
