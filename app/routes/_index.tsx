import type { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";

import { v4 as uuidv4 } from 'uuid';

import useUserId from "../utils/useUserId.js";

import type { OutletContext } from '~types'

export const meta: MetaFunction = () => {
  return [
    { title: "Time slot bets" },
  ];
};

export default function Index() {
  const { supabase } = useOutletContext<OutletContext>();

  async function handleNewGame() {
    const userId = useUserId();
    let gameUrl = uuidv4().slice(0, 8);
    supabase.from('game').insert({host_id: userId, game_url: gameUrl}).then(() => {
      // Navigate to the new game
    });
  }

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Time slot bets ⚽️</h1>
      <button className="btn btn-primary" type="submit" onClick={() => handleNewGame()}>
        New game 🤝
      </button>
    </div>
  );
}
