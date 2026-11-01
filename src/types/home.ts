export interface SiteStat {
  value: string;
  label: string;
  icon: "article" | "folder" | "tag" | "chart";
}

export interface CategoryCount {
  name: string;
  count: number;
}
