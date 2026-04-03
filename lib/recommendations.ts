import { getRelatedPosts } from "@/lib/content";

export type Recommendation = {
  slug: string;
  title: string;
  url: string;
  recommendationScore: number;
  recommendationReason: string;
};

export function getRecommendationsForPost(slug: string): Recommendation[] {
  return getRelatedPosts(slug).map((post) => ({
    slug: post.slug,
    title: post.title,
    url: post.url,
    recommendationScore: post.recommendationScore,
    recommendationReason: post.recommendationReason
  }));
}
