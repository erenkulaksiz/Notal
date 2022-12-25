export function scale(
  number: number,
  [inMin, inMax]: number[],
  [outMin, outMax]: number[]
) {
  return ((number - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}
