export const commentConfig = {
  enabled: false,
  // Artalk 后端 API 地址；启用评论前请填写。
  server: "",
  visitorCount: false,
};

export const isCommentViewCountEnabled = commentConfig.enabled && commentConfig.visitorCount;
