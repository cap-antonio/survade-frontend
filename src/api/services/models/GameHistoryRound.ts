/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GameEventResponse } from './GameEventResponse';
import type { GameHistoryFieldReveal } from './GameHistoryFieldReveal';
import type { GameHistoryPowerUse } from './GameHistoryPowerUse';
import type { GameHistoryRemoval } from './GameHistoryRemoval';
import type { GameHistoryVote } from './GameHistoryVote';

export type GameHistoryRound = {
    round: number;
    opened_fields?: Array<GameHistoryFieldReveal>;
    powers_used?: Array<GameHistoryPowerUse>;
    votes?: Array<GameHistoryVote>;
    removed_players?: Array<GameHistoryRemoval>;
    events: Array<GameEventResponse>;
};

