interface PostDates {
  publishedAt: Date;
  updatedAt?: Date;
}

export function formatPostDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getPostModifiedAt(data: PostDates) {
  return data.updatedAt ?? data.publishedAt;
}

/** Groups posts that are already sorted newest first by their UTC publish year. */
export function groupPostsByYear<Post extends { data: PostDates }>(posts: readonly Post[]) {
  const groups: { year: string; posts: Post[] }[] = [];

  for (const post of posts) {
    const year = formatPostDate(post.data.publishedAt).slice(0, 4);
    const lastGroup = groups.at(-1);

    if (lastGroup?.year === year) {
      lastGroup.posts.push(post);
    } else {
      groups.push({ year, posts: [post] });
    }
  }

  return groups;
}
