export interface SiteStat {
  value: string;
  label: string;
  icon: "article" | "pen" | "history";
}

export interface CategoryCount {
  name: string;
  count: number;
}
