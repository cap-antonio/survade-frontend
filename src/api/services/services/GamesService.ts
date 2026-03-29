/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BannerImpressionRequest } from '../models/BannerImpressionRequest';
import type { CountedResponse } from '../models/CountedResponse';
import type { CreateGameRequest } from '../models/CreateGameRequest';
import type { CreateGameResponse } from '../models/CreateGameResponse';
import type { EventsResponse } from '../models/EventsResponse';
import type { GameHistoryDetailResponse } from '../models/GameHistoryDetailResponse';
import type { GameHistorySummary } from '../models/GameHistorySummary';
import type { JoinGameRequest } from '../models/JoinGameRequest';
import type { JoinGameResponse } from '../models/JoinGameResponse';
import type { OkResponse } from '../models/OkResponse';
import type { RateGameRequest } from '../models/RateGameRequest';
import type { RevealCardRequest } from '../models/RevealCardRequest';
import type { UnlockRewardedRequest } from '../models/UnlockRewardedRequest';
import type { UnlockRewardedResponse } from '../models/UnlockRewardedResponse';
import type { UsePowerRequest } from '../models/UsePowerRequest';
import type { VoteRequest } from '../models/VoteRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class GamesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create Game
     * @returns CreateGameResponse Successful Response
     * @throws ApiError
     */
    public createGameApiGamesPost({
        requestBody,
    }: {
        requestBody: CreateGameRequest,
    }): CancelablePromise<CreateGameResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * List Game Histories
     * @returns GameHistorySummary Successful Response
     * @throws ApiError
     */
    public listGameHistoriesApiGamesHistoryGet(): CancelablePromise<Array<GameHistorySummary>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/games/history',
        });
    }

    /**
     * Get Game
     * @returns any Successful Response
     * @throws ApiError
     */
    public getGameApiGamesGameCodeGet({
        gameCode,
        xHostToken,
    }: {
        gameCode: string,
        xHostToken?: (string | null),
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/games/{game_code}',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-host-token': xHostToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Join Game
     * @returns JoinGameResponse Successful Response
     * @throws ApiError
     */
    public joinGameApiGamesGameCodeJoinPost({
        gameCode,
        requestBody,
    }: {
        gameCode: string,
        requestBody: JoinGameRequest,
    }): CancelablePromise<JoinGameResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/join',
            path: {
                'game_code': gameCode,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Start Game
     * @returns OkResponse Successful Response
     * @throws ApiError
     */
    public startGameApiGamesGameCodeStartPost({
        gameCode,
        xHostToken,
    }: {
        gameCode: string,
        xHostToken: string,
    }): CancelablePromise<OkResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/start',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-host-token': xHostToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Next Round
     * @returns EventsResponse Successful Response
     * @throws ApiError
     */
    public nextRoundApiGamesGameCodeNextRoundPost({
        gameCode,
        xHostToken,
    }: {
        gameCode: string,
        xHostToken: string,
    }): CancelablePromise<EventsResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/next-round',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-host-token': xHostToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Reveal Card
     * @returns any Successful Response
     * @throws ApiError
     */
    public revealCardApiGamesGameCodeRevealCardPost({
        gameCode,
        xPlayerToken,
        requestBody,
    }: {
        gameCode: string,
        xPlayerToken: string,
        requestBody: RevealCardRequest,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/reveal-card',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-player-token': xPlayerToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Use Power
     * @returns any Successful Response
     * @throws ApiError
     */
    public usePowerApiGamesGameCodeUsePowerPost({
        gameCode,
        xPlayerToken,
        requestBody,
    }: {
        gameCode: string,
        xPlayerToken: string,
        requestBody: UsePowerRequest,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/use-power',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-player-token': xPlayerToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Cast Vote
     * @returns any Successful Response
     * @throws ApiError
     */
    public castVoteApiGamesGameCodeVotePost({
        gameCode,
        xPlayerToken,
        requestBody,
    }: {
        gameCode: string,
        xPlayerToken: string,
        requestBody: VoteRequest,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/vote',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-player-token': xPlayerToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * End Voting
     * @returns EventsResponse Successful Response
     * @throws ApiError
     */
    public endVotingApiGamesGameCodeEndVotingPost({
        gameCode,
        xHostToken,
    }: {
        gameCode: string,
        xHostToken: string,
    }): CancelablePromise<EventsResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/end-voting',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-host-token': xHostToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Kick Player
     * @returns EventsResponse Successful Response
     * @throws ApiError
     */
    public kickPlayerApiGamesGameCodeKickPlayerIdPost({
        gameCode,
        playerId,
        xHostToken,
    }: {
        gameCode: string,
        playerId: number,
        xHostToken: string,
    }): CancelablePromise<EventsResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/kick/{player_id}',
            path: {
                'game_code': gameCode,
                'player_id': playerId,
            },
            headers: {
                'x-host-token': xHostToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Rate Game
     * @returns any Successful Response
     * @throws ApiError
     */
    public rateGameApiGamesGameCodeRatePost({
        gameCode,
        xPlayerToken,
        requestBody,
    }: {
        gameCode: string,
        xPlayerToken: string,
        requestBody: RateGameRequest,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/rate',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-player-token': xPlayerToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * @deprecated
     * Get History (Legacy)
     * Legacy raw event-log endpoint. Use GET /api/games/history/{game_id} for the structured history DTO.
     * @returns any Successful Response
     * @throws ApiError
     */
    public getHistoryApiGamesGameCodeHistoryGet({
        gameCode,
    }: {
        gameCode: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/games/{game_code}/history',
            path: {
                'game_code': gameCode,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get History Detail
     * @returns GameHistoryDetailResponse Successful Response
     * @throws ApiError
     */
    public getHistoryDetailApiGamesHistoryGameIdGet({
        gameId,
    }: {
        gameId: string,
    }): CancelablePromise<GameHistoryDetailResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/games/history/{game_id}',
            path: {
                'game_id': gameId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Unlock Rewarded
     * @returns UnlockRewardedResponse Successful Response
     * @throws ApiError
     */
    public unlockRewardedApiGamesGameCodeUnlockRewardedPost({
        gameCode,
        xHostToken,
        requestBody,
    }: {
        gameCode: string,
        xHostToken: string,
        requestBody: UnlockRewardedRequest,
    }): CancelablePromise<UnlockRewardedResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/unlock-rewarded',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-host-token': xHostToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Report Banner Impression
     * @returns CountedResponse Successful Response
     * @throws ApiError
     */
    public reportBannerImpressionApiGamesGameCodeAdsBannerImpressionPost({
        gameCode,
        xPlayerToken,
        requestBody,
    }: {
        gameCode: string,
        xPlayerToken: string,
        requestBody: BannerImpressionRequest,
    }): CancelablePromise<CountedResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/games/{game_code}/ads/banner-impression',
            path: {
                'game_code': gameCode,
            },
            headers: {
                'x-player-token': xPlayerToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
