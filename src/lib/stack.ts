export function stackTop(viewportHeight: number, sectionHeight: number): number {
  return Math.min(0, viewportHeight - sectionHeight);
}
