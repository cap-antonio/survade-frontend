export function formatSetting(settingKey: string): string {
  return settingKey
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export const normalizePath = (value: string): string => {
  if (value.length > 1 && value.endsWith("/")) {
    return value.slice(0, -1)
  }

  return value
}

export const isActivePath = (href: string, pathname: string): boolean => {
  const currentPath = normalizePath(pathname)
  const normalizedHref = normalizePath(href)

  if (normalizedHref === "/") {
    return currentPath === "/"
  }

  return (
    currentPath === normalizedHref ||
    currentPath.startsWith(`${normalizedHref}/`)
  )
}
