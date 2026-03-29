/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArchivedGamePlayer } from './ArchivedGamePlayer';
import type { GameHistoryRound } from './GameHistoryRound';
import type { GameSettings } from './GameSettings';
import type { Scenario } from './Scenario';

export type GameHistoryDetailResponse = {
    game_id: string;
    game_code: string;
    created_at: string;
    ended_at: (string | null);
    status: string;
    settings: GameSettings;
    scenario: Scenario;
    survivor_player_ids: Array<number>;
    players: Array<ArchivedGamePlayer>;
    rounds: Array<GameHistoryRound>;
};

