const apiCatalogPath = "/.well-known/api-catalog";
const apiCatalogLink = `<${apiCatalogPath}>; rel="api-catalog"; type="application/linkset+json"`;

function acceptsMarkdown(accept) {
  return accept.split(",").some((range) => {
    const [type, ...params] = range
      .toLowerCase()
      .split(";")
      .map((value) => value.trim());
    if (type !== "text/markdown") return false;

    const quality = params.find((value) => value.startsWith("q="));
    return quality === undefined || Number(quality.slice(2)) > 0;
  });
}

function withHeaders(response, headers, varyOnAccept = false) {
  const next = new Response(response.body, response);
  for (const [name, value] of Object.entries(headers)) {
    next.headers.set(name, value);
  }
  if (varyOnAccept) {
    const vary = (next.headers.get("Vary") ?? "")
      .toLowerCase()
      .split(",")
      .map((name) => name.trim());
    if (!vary.includes("*") && !vary.includes("accept")) next.headers.append("Vary", "Accept");
  }
  return next;
}

export function createMarkdownWorker(routes) {
  const markdownIndex = new Map(routes.flatMap((route) => route.paths.map((path) => [path, route])));

  return {
    async fetch(request, env) {
      if (request.method !== "GET" && request.method !== "HEAD") return env.ASSETS.fetch(request);

      const url = new URL(request.url);
      const path = url.pathname;

      if (path === apiCatalogPath) {
        const response = await env.ASSETS.fetch(request);
        return response.ok ? withHeaders(response, { "Content-Type": "application/linkset+json" }) : response;
      }

      const markdown = markdownIndex.get(path);
      const directMarkdown = markdownIndex.size > 0 && /\.md$/i.test(path);
      const negotiateMarkdown = markdown && acceptsMarkdown(request.headers.get("Accept") ?? "");

      if (directMarkdown || negotiateMarkdown) {
        if (!directMarkdown) url.pathname = markdown.uri;
        const response = await env.ASSETS.fetch(new Request(url, request));
        if (!response.ok && response.status !== 304) return response;

        const headers = { "Content-Type": "text/markdown; charset=utf-8", Link: apiCatalogLink };
        if (markdown) headers["x-markdown-tokens"] = String(markdown.tokenCount);
        return withHeaders(response, headers, true);
      }

      const response = await env.ASSETS.fetch(request);
      if (!markdown || (!response.ok && response.status !== 304)) return response;

      return withHeaders(response, markdown.advertiseCatalog ? { Link: apiCatalogLink } : {}, true);
    },
  };
}
