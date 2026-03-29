/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassicLeaderboardEntry } from '../models/ClassicLeaderboardEntry';
import type { DeleteAccountRequest } from '../models/DeleteAccountRequest';
import type { GameHistorySummary } from '../models/GameHistorySummary';
import type { SaboteurLeaderboardEntry } from '../models/SaboteurLeaderboardEntry';
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
     * Get My Games
     * @returns GameHistorySummary Successful Response
     * @throws ApiError
     */
    public getMyGamesApiUsersMeGamesGet({
        limit = 50,
    }: {
        limit?: number,
    }): CancelablePromise<Array<GameHistorySummary>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/users/me/games',
            query: {
                'limit': limit,
            },
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
     * Leaderboard Classic
     * @returns ClassicLeaderboardEntry Successful Response
     * @throws ApiError
     */
    public leaderboardClassicApiLeaderboardClassicGet({
        limit = 50,
    }: {
        limit?: number,
    }): CancelablePromise<Array<ClassicLeaderboardEntry>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/leaderboard/classic',
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
     * @returns SaboteurLeaderboardEntry Successful Response
     * @throws ApiError
     */
    public leaderboardSaboteurApiLeaderboardSaboteurGet({
        limit = 50,
    }: {
        limit?: number,
    }): CancelablePromise<Array<SaboteurLeaderboardEntry>> {
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
