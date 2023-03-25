export function isShadowRoot(input: unknown): input is ShadowRoot {
  return (input as any)?.nodeType === 11
}
