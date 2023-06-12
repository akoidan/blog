export function formatDate(d: Date): string {
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
