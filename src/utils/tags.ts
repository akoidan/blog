import {CollectionEntry, getCollection} from "astro:content";

export const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  let tags: string[] = [];
  const filteredPosts = posts.filter(({ data }) => !data.draft);
  filteredPosts.forEach(post => {
    tags = [...tags, ...post.data.tags]
      .map(tag => tag)
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      );
  });
  return tags;
};

export const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  posts.filter(post => post.data.tags.includes(tag));


export async function getStaticPaths() {
  const posts = await getCollection("blog");

  const tags = getUniqueTags(posts);

  return tags.map(tag => {
    return {
      params: { tag },
      props: { tag },
    };
  });
}
