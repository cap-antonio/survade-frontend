/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateCheckoutRequest = {
    product: CreateCheckoutRequest.product;
    setting_key?: (string | null);
};

export namespace CreateCheckoutRequest {

    export enum product {
        SETTING_UNLOCK = 'setting_unlock',
        ALL_SETTINGS = 'all_settings',
        SESSION_NO_ADS = 'session_no_ads',
        CORPORATE_SESSION = 'corporate_session',
    }


}

