/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CheckoutResponse } from '../models/CheckoutResponse';
import type { CreateCheckoutRequest } from '../models/CreateCheckoutRequest';
import type { ReceivedResponse } from '../models/ReceivedResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PaymentsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create Checkout
     * @returns CheckoutResponse Successful Response
     * @throws ApiError
     */
    public createCheckoutApiPaymentsCreateCheckoutPost({
        requestBody,
    }: {
        requestBody: CreateCheckoutRequest,
    }): CancelablePromise<CheckoutResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/payments/create-checkout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Stripe Webhook
     * @returns ReceivedResponse Successful Response
     * @throws ApiError
     */
    public stripeWebhookApiPaymentsWebhookPost({
        stripeSignature = '',
    }: {
        stripeSignature?: string,
    }): CancelablePromise<ReceivedResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/payments/webhook',
            headers: {
                'stripe-signature': stripeSignature,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
