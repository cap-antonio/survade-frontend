export const getErrorMessage = (error: unknown) => {
  const message =
    typeof error === "object" &&
    error !== null &&
    "body" in error &&
    Array.isArray(
      (error as { body?: { detail?: Array<{ msg?: string }> } }).body?.detail,
    )
      ? (error as { body?: { detail?: Array<{ msg?: string }> } }).body
          ?.detail?.[0]?.msg
      : undefined

  return message
}
