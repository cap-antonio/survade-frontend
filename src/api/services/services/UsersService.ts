/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeleteAccountRequest } from '../models/DeleteAccountRequest';
import type { LeaderboardEntry } from '../models/LeaderboardEntry';
import type { UserPublicProfile } from '../models/UserPublicProfile';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get Me
     * @returns UserPublicProfile Successful Response
     * @throws ApiError
     */
    public getMeApiUsersMeGet(): CancelablePromise<UserPublicProfile> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/users/me',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Me
     * @returns void
     * @throws ApiError
     */
    public deleteMeApiUsersMeDelete({
        requestBody,
    }: {
        requestBody: DeleteAccountRequest,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/users/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get User
     * @returns UserPublicProfile Successful Response
     * @throws ApiError
     */
    public getUserApiUsersUserIdGet({
        userId,
    }: {
        userId: string,
    }): CancelablePromise<UserPublicProfile> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Leaderboard Survival
     * @returns LeaderboardEntry Successful Response
     * @throws ApiError
     */
    public leaderboardSurvivalApiLeaderboardSurvivalGet({
        limit = 50,
    }: {
        limit?: number,
    }): CancelablePromise<Array<LeaderboardEntry>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/leaderboard/survival',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Leaderboard Saboteur
     * @returns LeaderboardEntry Successful Response
     * @throws ApiError
     */
    public leaderboardSaboteurApiLeaderboardSaboteurGet({
        limit = 50,
    }: {
        limit?: number,
    }): CancelablePromise<Array<LeaderboardEntry>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/leaderboard/saboteur',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
