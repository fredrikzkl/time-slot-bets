import { json, LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { TSBGame, TimeSlot } from "../types";
import { GetGameWithBets } from "../services.server/GameService";

import { ClockIcon, HomeIcon } from '../components/Icons';

import { formatDate } from "../hooks/useFormatDate";

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
    status: data.status,
    host_id: data.host_id,
    game_url: data.game_url,
    created_at: data.created_at,
    gambler: data.gambler || [],
    timeSlots: []
  };

  GenerateTimeslots(game);
  game = GenerateTimeslots(game);

  return json(game);
}

function getBetDuration(startTime: number, endTime: number) {
  return endTime - startTime;
}

export default function GameJoin() {
  let game = useLoaderData<typeof loader>() as TSBGame;

  const timeSlotComponent = (ts: TimeSlot, isFirst?: boolean, isLast?: boolean) => {
    var betDuration = getBetDuration(ts.startTime, ts.endTime);
    return (
      <li key={ts.user_id}>
        {!isFirst &&
          <hr className="bg-primary" />
        }

        <div className="timeline-start">
          <div className="tooltip" data-tip={`Bet: ${FormatSecondToTime(ts.betInSeconds)}`}>
            <button className="btn btn-ghost">{ts.name}</button>
          </div>
        </div>
        <div className="timeline-middle">
          <ClockIcon />
        </div>
        <div className="timeline-end timeline-box">
          <div className="tooltip" data-tip={`Duration: ${FormatSecondToTime(betDuration)}`}>
            {FormatSecondToTime(ts.startTime)} - {FormatSecondToTime(ts.endTime)}
          </div>
        </div>

        {!isLast &&
          <hr className="bg-primary" />
        }
      </li>
    )
  }

  var timeSlots = game.timeSlots || [];

  return (
    <div className="container text-center">
      <div className="mt-12 mb-12">
        <h1 className="text-5xl text-center font-bold ">{game.game_name}</h1>
        <p className="mt-2">{formatDate(new Date(game.created_at))}</p>
      </div>

      <div>
        <ul className="timeline timeline-vertical">
          {
            game.timeSlots.map((ts: any, index: number) => (
              timeSlotComponent(ts, index === 0, index === timeSlots.length - 1))
            )
          }
        </ul>
      </div>

      <div className="stats shadow mt-8">
        <div className="stat text-primary">
          <div className="stat-title">Players</div>
          <div className="stat-value">{game.gambler.length}</div>
        </div>
        <div className="stat text-secondary">
          <div className="stat-title">Collisions</div>
          <div className="stat-value">{game.gambler.length}</div>
        </div>
        <div className="stat text-accent">
          <div className="stat-title">Closest bet</div>
          <div className="stat-value">{game.gambler.length}</div>
        </div>
      </div>

      <div className="mt-8">
        <NavLink
          to="/"
          className={`btn btn-outline`}
        >
          <HomeIcon />
          Home
        </NavLink>
      </div>
    </div>
  )
} 