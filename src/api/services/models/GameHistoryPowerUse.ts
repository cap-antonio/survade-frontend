/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GameHistoryFieldReveal } from './GameHistoryFieldReveal';

export type GameHistoryPowerUse = {
    player_id: number;
    power: string;
    target_player_id?: (number | null);
    forced_field?: (string | null);
    revealed_fields?: Array<GameHistoryFieldReveal>;
};

