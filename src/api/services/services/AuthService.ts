/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessTokenResponse } from '../models/AccessTokenResponse';
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { LogoutRequest } from '../models/LogoutRequest';
import type { PasswordResetConfirmRequest } from '../models/PasswordResetConfirmRequest';
import type { PasswordResetRequest } from '../models/PasswordResetRequest';
import type { RefreshRequest } from '../models/RefreshRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { RegistrationCodeRequest } from '../models/RegistrationCodeRequest';
import type { TokenResponse } from '../models/TokenResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Register
     * @returns TokenResponse Successful Response
     * @throws ApiError
     */
    public registerApiAuthRegisterPost({
        requestBody,
    }: {
        requestBody: RegisterRequest,
    }): CancelablePromise<TokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Request Registration Code
     * @returns any Successful Response
     * @throws ApiError
     */
    public requestRegistrationCodeApiAuthRegisterRequestCodePost({
        requestBody,
    }: {
        requestBody: RegistrationCodeRequest,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/register/request-code',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Resend Registration Code
     * @returns any Successful Response
     * @throws ApiError
     */
    public resendRegistrationCodeApiAuthRegisterResendCodePost({
        requestBody,
    }: {
        requestBody: RegistrationCodeRequest,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/register/resend-code',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Login
     * @returns TokenResponse Successful Response
     * @throws ApiError
     */
    public loginApiAuthLoginPost({
        requestBody,
    }: {
        requestBody: LoginRequest,
    }): CancelablePromise<TokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Refresh Token
     * @returns AccessTokenResponse Successful Response
     * @throws ApiError
     */
    public refreshTokenApiAuthRefreshPost({
        requestBody,
    }: {
        requestBody: RefreshRequest,
    }): CancelablePromise<AccessTokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Logout
     * @returns void
     * @throws ApiError
     */
    public logoutApiAuthLogoutPost({
        requestBody,
    }: {
        requestBody: LogoutRequest,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Change Password
     * @returns void
     * @throws ApiError
     */
    public changePasswordApiAuthChangePasswordPost({
        requestBody,
    }: {
        requestBody: ChangePasswordRequest,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Request Password Reset
     * @returns any Successful Response
     * @throws ApiError
     */
    public requestPasswordResetApiAuthPasswordResetRequestPost({
        requestBody,
    }: {
        requestBody: PasswordResetRequest,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/password-reset/request',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Confirm Password Reset
     * @returns void
     * @throws ApiError
     */
    public confirmPasswordResetApiAuthPasswordResetConfirmPost({
        requestBody,
    }: {
        requestBody: PasswordResetConfirmRequest,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/password-reset/confirm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
