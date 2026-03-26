import { useMutation } from "@tanstack/react-query"
import { api } from "../client"
import { ApiParams } from "@/api/hooks/api.types"

export const useCreateCheckout = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<
        typeof api.payments.createCheckoutApiPaymentsCreateCheckoutPost
      >,
    ) => {
      return await api.payments.createCheckoutApiPaymentsCreateCheckoutPost(
        payload,
      )
    },
    onSuccess: (data) => {
      window.location.href = data.checkout_url
    },

    mutationKey: ["createCheckout"],
  })

  return {
    ...mutation,
    createCheckout: mutation.mutate,
  }
}
