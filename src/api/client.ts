import { axiosAPI } from "@/api/axios"
import {
  apigen,
  BaseHttpRequest,
  CancelablePromise,
  OpenAPI,
  OpenAPIConfig,
} from "@/api/services"
import { request as __request } from "./services/core/request"
import { ApiRequestOptions } from "@/api/services/core/ApiRequestOptions"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

class AxiosHttpRequestWithAuth extends BaseHttpRequest {
  axiosInstance = axiosAPI

  constructor(config: OpenAPIConfig) {
    super(config)
  }

  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return __request(this.config, options, this.axiosInstance)
  }
}

export const api = new apigen(
  {
    BASE: API_BASE,
    TOKEN: OpenAPI.TOKEN,
    // TODO: Uncomment this if you want to add a version header
    // HEADERS: async () => {
    // 	return {
    // 		'X-Client-Version': process.env.VITE_APP_VERSION ?? '',
    // 	}
    // },
  },
  AxiosHttpRequestWithAuth,
)
