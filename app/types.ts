import type { Session, SupabaseClient } from "@supabase/supabase-js";

export type OutletContext = {
    supabase: SupabaseClient;
    session: Session
}

export type TSBGame = {
    game_name : string,
    id : string,
    game_url : string,
    created_at : string,
    host_id : string,
    status : string,
    gambler : Gambler[],
    timeSlots : TimeSlot[],
    statistics : GameStatistics
}

export type Gambler = {
    user_id : string;
    name : string;
    bet : string;
}

export type JoinGameRequest = {
    game_url: string;
    user_id: string;
    name : string;
    minutes : string;
    seconds: string;
}

// All numbers are represented in seconds
export type TimeSlot = {
    user_id: string;
    name: string;
    betInSeconds: number;
    startTime: number;
    endTime: number;
}

export type GameStatistics = {
    collisions : number,
    closestBet : {
        player1 : string,
        player2 : string,
        differenceSeconds : number
    }
    shortestDuration : {
        player : string,
        durationSeconds : number
    }
}

export function GetEmptyStatistics(): GameStatistics {
    return {
        collisions: 0,
        closestBet: {
            player1: '',
            player2: '',
            differenceSeconds: 0
        },
        shortestDuration: {
            player: '',
            durationSeconds: 0
        },
    }
}

