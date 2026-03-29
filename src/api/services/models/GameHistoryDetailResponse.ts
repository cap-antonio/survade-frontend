/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArchivedGamePlayer } from './ArchivedGamePlayer';
import type { GameHistoryRound } from './GameHistoryRound';

export type GameHistoryDetailResponse = {
    game_id: string;
    game_code: string;
    created_at: string;
    ended_at: (string | null);
    status: string;
    settings: Record<string, any>;
    scenario: Record<string, any>;
    survivor_player_ids: Array<number>;
    players: Array<ArchivedGamePlayer>;
    rounds: Array<GameHistoryRound>;
};

