export function isDocument(input: unknown): input is Document {
  return (input as any)?.nodeType === 9;
}
