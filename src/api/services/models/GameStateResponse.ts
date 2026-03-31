/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardView } from './CardView';
import type { GameEventResponse } from './GameEventResponse';
import type { GamePhase } from './GamePhase';
import type { GameSettings } from './GameSettings';
import type { GameStatus } from './GameStatus';
import type { LiveGamePlayerResponse } from './LiveGamePlayerResponse';
import type { RoundEffects } from './RoundEffects';
import type { Scenario } from './Scenario';

export type GameStateResponse = {
    game_id: string;
    game_code: string;
    status?: GameStatus;
    phase?: (GamePhase | null);
    host_player_id: number;
    host_token: string;
    survivors_count: number;
    scenario: Scenario;
    settings: GameSettings;
    players?: Array<LiveGamePlayerResponse>;
    unassigned_cards?: Array<CardView>;
    current_round?: number;
    voting_enabled?: boolean;
    events?: Array<GameEventResponse>;
    round_effects?: RoundEffects;
    votes_this_round?: Record<string, number>;
    session_type?: string;
    payment_id?: (string | null);
    created_at: string;
};

