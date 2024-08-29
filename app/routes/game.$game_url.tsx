
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

import GamblerTable from "../components/GamblerTable";

import db from '../utils/db';
import GameLink from "../components/GameLink";
import useUserId from "../hooks/useUserId";

import { useEffect, useState } from "react";

import { TSBGame } from "../types";

import JoinButton from "../components/JoinButton";
import { GetGameNoBets } from "../services.server/GameService";
import StartRoundButton from "../components/StartRoundButton";
import GameBody from "../components/GameBody";


export const meta: MetaFunction = () => {
  return [
    { title: "Time Slot Bet Game" },
  ];
};

export async function loader({
  params,
}: LoaderFunctionArgs) {
  const { data, error } = await GetGameNoBets(params.game_url);
  if (error)
    return json(error.message, { status: 500 });

  if (!data)
    return json("Game not found", { status: 404 });

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  return await db.from('gambler').insert([values]);
}

export default function Game() {
  let data = useLoaderData<typeof loader>() as TSBGame;
  const userId = useUserId();

  const [isNewPlayer, setIsNewPlayer] = useState(true);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (data.host_id === userId) {
      setIsHost(true);
    }
    if (data.gambler.some((g: any) => g.user_id === userId)) {
      setIsNewPlayer(false);
    }
  }, [data, userId]);

  return (
    <GameBody
      name={data.game_name}
      createdAt={data.created_at}
      isHost
    >
      <GameLink />

      {isNewPlayer && (
        <div className="mt-8">
          <JoinButton gameUrl={data.game_url} />
        </div>
      )}

      <GamblerTable gamblers={data.gambler} userId={userId} />
      {isHost && (
        <StartRoundButton gameUrl={data.game_url}/>
      )}

    </GameBody>
  );
}

