import { ApiError } from "@/api/services"
import { UseQueryOptions } from "@tanstack/react-query"

export type TQueryProps<Q> = Partial<Omit<UseQueryOptions<Q>, "queryFn">>
export type ApiParams<T extends (...args: any) => any> = Parameters<T>[0]

export interface TypedApiError<T = any> extends ApiError {
  body: T
}
