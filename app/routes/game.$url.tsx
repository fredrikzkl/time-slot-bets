
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

import GamblerTable from "../components/GamblerTable";

import db from '../utils/db';
import GameLink from "../components/GameLink";
import useUserId from "../utils/useUserId";
import { useEffect, useState } from "react";

import type { Game } from '~types'
import NewGamblerForm from "../components/NewGamblerForm";


export const meta: MetaFunction = () => {
  return [
    { title: "Time Slot Bet Game" },
  ];
};

export async function loader({
  params,
}: LoaderFunctionArgs) {
  const { data: gameData } = await db.from('game').select(`
      id,
      game_url,
      status,
      host_id,
      created_at,
      gambler ( name, user_id )
    `).eq('game_url', params.url).single();

  if (!gameData) {
    return json("Game not found", { status: 404 });
  }

  return json(gameData);
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  return await db.from('gambler').insert([values]);
}

export default function Game() {
  let data = useLoaderData<typeof loader>() as Game;

  const [userId, setUserId] = useState('')
  const [isNewPlayer, setIsNewPlayer] = useState(true);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    setUserId(useUserId() || '');
    if (data.host_id === userId) {
      setIsHost(true);
    }
    if (data.gambler.some((g:any) => g.user_id === userId)) {
        setIsNewPlayer(false);
    }
  }, [data, userId]);

  return (
    <div className="container mx-auto justify-center">
      <div className="font-sans p-8">
        <h1 className="text-3xl">Game:</h1>
        {isHost && <div className="badge badge-success">You are host</div>}
      </div>

      {isNewPlayer ? (
        <>
        <NewGamblerForm gameId={data.id} userId={userId} />
        </>
      ) : (
        <>
          <GameLink />
          <GamblerTable gamblers={data.gambler}/>
          {isHost && (
            <button className="btn btn-primary">Start Round</button>
          )}
        </>
      )}

    </div>
  );
}