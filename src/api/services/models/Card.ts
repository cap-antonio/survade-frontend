/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DarkSecret } from './DarkSecret';
import type { SpecialPower } from './SpecialPower';

export type Card = {
    role: (string | Record<string, any>);
    gender: (string | Record<string, any>);
    health: (string | Record<string, any>);
    dark_secret: DarkSecret;
    special_skill: (string | Record<string, any>);
    phobia?: (string | Record<string, any> | null);
    inventory_item?: (string | Record<string, any> | null);
    personality_trait?: (string | Record<string, any> | null);
    hobby?: (string | Record<string, any> | null);
    special_power: SpecialPower;
    is_saboteur?: boolean;
};

