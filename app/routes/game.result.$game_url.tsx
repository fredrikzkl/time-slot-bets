import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TSBGame, TimeSlot } from "../types";
import useUserId from "../hooks/useUserId";
import { GetGameNoBets, GetGameWithBets } from "../services.server/GameService";

import { GenerateTimeslots, FormatSecondToTime } from '../services.server/TimeslotsGenerator';

export async function loader({
  params,
}: LoaderFunctionArgs) {
  const { data, error } = await GetGameWithBets(params.game_url);

  if (error)
    return json(error.message, { status: 500 });
  if (!data) {
    return json(`Game '${params.game_url}' not found`, { status: 404 });
  }
  
  let game: TSBGame = {
    game_name: data.game_name,
    id: data.id,
    game_url: data.game_url,
    status: data.status,
    host_id: data.host_id,
    created_at: data.created_at,
    gambler: data.gambler || [],
    timeSlots: []
  };

  GenerateTimeslots(game);
  game = GenerateTimeslots(game);

  return json(game);
}

export default function GameJoin() {
  let game = useLoaderData<typeof loader>() as TSBGame;

  const timeSlotComponent = (ts: TimeSlot) => {
    return (
      <li key={ts.user_id}>
        <div className="timeline-start">
        {ts.name}
        </div>
        <div className="timeline-middle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div className="timeline-end timeline-box">
          {FormatSecondToTime(ts.startTime)} - {FormatSecondToTime(ts.endTime)} 
        </div>
        <hr />
      </li>
    )
  }

  var timeSlots = game.timeSlots || [];

  return (
    <div className="min-h-screen">
      <h1 className="text-5xl font-bold">{game.game_name}</h1>
    <div>
      <ul className="timeline timeline-vertical">
        {
          game.timeSlots.map((ts: any) => (timeSlotComponent(ts)))
        }
      </ul>
      </div>
    </div>
  )
} 