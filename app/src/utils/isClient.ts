export function isClient() {
  return typeof window === "undefined" ? false : true;
}
