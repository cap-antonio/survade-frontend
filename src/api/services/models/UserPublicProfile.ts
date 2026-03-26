/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SaboteurStats } from './SaboteurStats';
import type { SurvivalStats } from './SurvivalStats';

export type UserPublicProfile = {
    user_id: string;
    display_name: string;
    favourite_setting: (string | null);
    survival: SurvivalStats;
    saboteur: SaboteurStats;
};

