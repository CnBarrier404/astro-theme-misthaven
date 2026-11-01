export interface SiteStat {
  value: string;
  label: string;
  icon: "article" | "folder" | "tag";
}

export interface CategoryCount {
  name: string;
  count: number;
}
