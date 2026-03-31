/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardView } from './CardView';

export type LiveGamePlayerResponse = {
    player_id: number;
    player_type: string;
    user_id?: (string | null);
    display_name: string;
    player_token: string;
    is_eliminated?: boolean;
    card: CardView;
    revealed_fields?: Array<string>;
};

