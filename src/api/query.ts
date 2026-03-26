import { QueryClient } from "@tanstack/react-query"

const getApiStatus = (error: any) =>
  error?.response?.status || error?.status || 0

const retry = (failureCount: number, error: any) => {
  const status = getApiStatus(error)
  return [400, 403, 409, 404, 500, 503].includes(status)
    ? false
    : failureCount <= 3
}

const throwOnError = (error: Error) =>
  ![400, 401, 403, 409, 413].includes(getApiStatus(error))

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry,
      throwOnError,
    },
    mutations: {
      retry: false,
      throwOnError,
    },
  },
})
