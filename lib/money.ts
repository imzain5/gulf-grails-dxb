export function money(n: number): string {
  return "AED " + Math.round(n).toLocaleString("en-US");
}
