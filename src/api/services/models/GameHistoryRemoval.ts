/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type GameHistoryRemoval = {
    player_id: number;
    removal_type: GameHistoryRemoval.removal_type;
    reason?: (string | null);
    fields_revealed?: Array<string>;
};

export namespace GameHistoryRemoval {

    export enum removal_type {
        VOTE = 'vote',
        KICK = 'kick',
    }


}

