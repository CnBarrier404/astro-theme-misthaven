export function normalizeSitePath(pathname: string) {
  const pathWithoutIndexFile = pathname.replace(/\/index\.html$/, "/");
  const pathWithoutHtmlExtension = pathWithoutIndexFile.replace(/\.html$/, "");

  return pathWithoutHtmlExtension.replace(/\/+$/, "") || "/";
}

export function encodePathSegments(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

export function getPostHref(post: { id: string }) {
  return `/posts/${encodePathSegments(post.id)}`;
}

export function getTagHref(tag: string) {
  return `/tags/${encodeURIComponent(tag)}`;
}
