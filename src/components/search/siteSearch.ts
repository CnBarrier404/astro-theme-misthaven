import { findSearchResults, getSearchIndex, type SearchEntry } from "./searchIndex";

export class SiteSearch extends HTMLElement {
  private input!: HTMLInputElement;
  private panel!: HTMLElement;
  private status!: HTMLElement;
  private results!: HTMLUListElement;
  private clearButton!: HTMLButtonElement;
  private template!: HTMLTemplateElement;
  private listeners?: AbortController;
  private activeResult = -1;
  private queryVersion = 0;

  connectedCallback() {
    this.input = this.querySelector("input")!;
    this.panel = this.querySelector("[data-search-panel]")!;
    this.status = this.querySelector("[data-search-status]")!;
    this.results = this.querySelector('[role="listbox"]')!;
    this.clearButton = this.querySelector("[data-search-clear]")!;
    this.template = this.querySelector("template")!;

    this.listeners = new AbortController();
    const { signal } = this.listeners;
    this.input.addEventListener("focus", () => this.setPanelOpen(true), { signal });
    this.input.addEventListener("click", () => this.setPanelOpen(true), { signal });
    this.input.addEventListener("input", () => void this.updateResults(), { signal });
    this.input.addEventListener("keydown", this.handleKeyDown, { signal });
    this.clearButton.addEventListener("click", () => this.search(""), { signal });
    this.results.addEventListener(
      "click",
      (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!(event.target instanceof Element) || !event.target.closest("a")) return;

        this.setPanelOpen(false);
        this.closest("dialog")?.close();
      },
      { signal },
    );
    this.addEventListener(
      "focusout",
      (event) => {
        if (event.relatedTarget instanceof Node && !this.contains(event.relatedTarget)) this.setPanelOpen(false);
      },
      { signal },
    );
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (!event.composedPath().includes(this)) this.setPanelOpen(false);
      },
      { signal },
    );
  }

  disconnectedCallback() {
    this.listeners?.abort();
    this.queryVersion += 1;
  }

  search(query: string) {
    this.input.value = query;
    this.input.focus();
    void this.updateResults();
  }

  private setPanelOpen(open: boolean) {
    this.panel.toggleAttribute("data-open", open);
    this.input.setAttribute("aria-expanded", String(open));
    if (!open) this.selectResult(-1);
  }

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing) return;

    const isOpen = this.panel.hasAttribute("data-open");
    if (event.key === "Escape") {
      this.setPanelOpen(false);
      return;
    }

    const count = this.results.children.length;
    if (count === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.setPanelOpen(true);
      const next =
        event.key === "ArrowDown"
          ? (this.activeResult + 1) % count
          : this.activeResult < 0
            ? count - 1
            : (this.activeResult + count - 1) % count;
      this.selectResult(next);
    } else if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      this.results.children[Math.max(0, this.activeResult)].querySelector("a")?.click();
    }
  };

  private showStatus(message: string) {
    this.status.textContent = message;
    this.results.hidden = true;
    this.results.replaceChildren();
    this.selectResult(-1);
  }

  private async updateResults() {
    const query = this.input.value.trim();
    const version = ++this.queryVersion;
    this.clearButton.hidden = !this.input.value;
    this.setPanelOpen(true);

    if (!query) {
      this.showStatus(this.dataset.searchPrompt ?? "");
      return;
    }

    try {
      const index = getSearchIndex();
      if (index instanceof Promise) this.showStatus(this.dataset.searchLoading ?? "");
      const entries = await index;
      if (version === this.queryVersion) this.renderResults(findSearchResults(entries, query));
    } catch (error) {
      console.error(error);
      if (version === this.queryVersion) this.showStatus(this.dataset.searchError ?? "");
    }
  }

  private renderResults(entries: SearchEntry[]) {
    if (entries.length === 0) {
      this.showStatus(this.dataset.searchEmpty ?? "");
      return;
    }

    this.status.textContent = (this.dataset.searchCount ?? "{count}").replace("{count}", String(entries.length));
    this.results.replaceChildren(...entries.map((entry, index) => this.createResult(entry, index)));
    this.results.hidden = false;
    this.selectResult(-1);
  }

  private createResult(entry: SearchEntry, index: number) {
    const option = this.template.content.cloneNode(true) as DocumentFragment;
    option.firstElementChild!.id = `${this.results.id}-${index}`;
    option.querySelector("a")!.href = entry.href;
    option.querySelector("[data-result-title]")!.textContent = entry.title;
    option.querySelector("[data-result-description]")!.textContent = entry.description;
    option.querySelector("[data-result-category]")!.textContent = entry.category;
    const date = option.querySelector("time")!;
    date.dateTime = entry.publishedAt;
    date.textContent = entry.publishedLabel;
    return option;
  }

  private selectResult(index: number) {
    this.activeResult = index;
    Array.from(this.results.children).forEach((option, optionIndex) => {
      option.setAttribute("aria-selected", String(optionIndex === index));
    });
    const active = this.results.children[index];
    if (active) {
      this.input.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView({ block: "nearest" });
    } else {
      this.input.removeAttribute("aria-activedescendant");
    }
  }
}

if (!customElements.get("site-search")) customElements.define("site-search", SiteSearch);
