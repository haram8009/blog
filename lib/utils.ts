import { getSiteUrl } from "@/lib/env";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

export function absoluteUrl(path = "") {
  return new URL(path, getSiteUrl()).toString();
}
