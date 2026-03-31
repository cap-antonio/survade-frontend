/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DarkSecret } from './DarkSecret';
import type { SpecialPower } from './SpecialPower';

export type CardView = {
    role: Record<string, string>;
    gender: Record<string, string>;
    health: Record<string, string>;
    dark_secret: DarkSecret;
    special_skill: Record<string, string>;
    phobia?: (Record<string, string> | null);
    inventory_item?: (Record<string, string> | null);
    personality_trait?: (Record<string, string> | null);
    hobby?: (Record<string, string> | null);
    special_power: SpecialPower;
    is_saboteur?: (boolean | null);
};

