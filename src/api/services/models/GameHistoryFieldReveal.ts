/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type GameHistoryFieldReveal = {
    player_id: number;
    field: string;
    source: GameHistoryFieldReveal.source;
    by_player_id?: (number | null);
    power?: (string | null);
};

export namespace GameHistoryFieldReveal {

    export enum source {
        AUTO = 'auto',
        MANUAL = 'manual',
        POWER = 'power',
    }


}

