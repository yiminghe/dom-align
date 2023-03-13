export function isInteger(input: unknown): input is number {
  if ((typeof input === 'number' || input instanceof Number) && !isNaN(input as number)) {
    return true
  }
  return false
}
