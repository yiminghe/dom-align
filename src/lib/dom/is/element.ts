export function isElement(input: unknown): input is Element {
  return (input as any)?.nodeType === 1
}
