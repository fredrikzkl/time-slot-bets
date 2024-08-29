
import { json } from '@remix-run/react';
import { JoinGameRequest, TSBGame } from '../types.ts';
import db from '../utils/db';
import { PostgrestError } from '@supabase/supabase-js';
import { GenerateTimeslots } from './TimeslotsGenerator';

export async function JoinGame(request: JoinGameRequest): Promise<PostgrestError | null> {
    let bet = request.minutes + ":" + request.seconds;
    const { error } = await db.from('gambler').insert({
        name: request.name,
        game_id: request.game_id,
        user_id: request.user_id,
        bet: bet
    });

    if (error) {
        return error;
    }
    return null;
}

export async function GetGameId(game_url?: string) {
    const { data, error } = await db.from('game').select(`
        id
      `).eq('game_url', game_url).single();
    return { data, error };
}

export async function GetGameNoBets(game_url?: string) {
    const { data, error } = await db.from('game').select(`
        game_name,
        id,
        game_url,
        status,
        host_id,
        created_at,
        gambler ( name, user_id )
      `).eq('game_url', game_url).single();
    return { data, error };
}

export async function GetGameWithBets(game_url?: string) {
    const { data, error } = await db.from('game').select(`
        game_name,
        id,
        game_url,
        status,
        host_id,
        created_at,
        gambler ( name, user_id, bet )
      `).eq('game_url', game_url).single();
    return { data, error };
}

export async function StartGame(gameId: string) {
    const { error } = await db.from('game').update({
        status: 'started'
    }).eq('id', gameId);
    return error;
}