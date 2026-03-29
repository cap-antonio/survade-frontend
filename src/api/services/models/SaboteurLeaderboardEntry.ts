/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RoleLeaderboardStats } from './RoleLeaderboardStats';

export type SaboteurLeaderboardEntry = {
    rank: number;
    user_id: string;
    display_name: string;
    games_played: number;
    wins: number;
    win_rate: number;
    civilian: RoleLeaderboardStats;
    saboteur: RoleLeaderboardStats;
};

