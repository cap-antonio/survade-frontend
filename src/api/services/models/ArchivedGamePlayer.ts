/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ArchivedGamePlayer = {
    player_id: number;
    player_type: string;
    user_id: (string | null);
    display_name: string;
    is_survivor: boolean;
    is_eliminated: boolean;
    eliminated_in_round?: (number | null);
    elimination_type?: (string | null);
    revealed_fields?: Array<string>;
    card: Record<string, any>;
};

