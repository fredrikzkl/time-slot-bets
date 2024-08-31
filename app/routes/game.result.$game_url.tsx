import { json, LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { GetEmptyStatistics, TSBGame, TimeSlot } from "../types";
import { GetGameWithBets } from "../services.server/GameService";

import { ClockIcon, HomeIcon } from '../components/Icons';

import { formatDate } from "../hooks/useFormatDate";

import { GenerateTimeslots, FormatSecondToTime } from '../services.server/TimeslotsGenerator';
import StatisticsComponent from "../components/Statistics";
import GameBody from "../components/GameBody";

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
    statistics : GetEmptyStatistics(),
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
    <GameBody 
      name={game.game_name}
      createdAt={game.created_at}
    >
      <div>
        <ul className="timeline timeline-vertical">
          {
            game.timeSlots.map((ts: any, index: number) => (
              timeSlotComponent(ts, index === 0, index === timeSlots.length - 1))
            )
          }
        </ul>
      </div>

      {game.statistics && (
        <StatisticsComponent
          playerCount={game.gambler.length}
          statistics={game.statistics}
        />
      )}


      <div className="mt-8">
        <NavLink
          to="/"
          className={`btn btn-outline`}
        >
          <HomeIcon />
          Home
        </NavLink>
      </div>
    </GameBody>
  )
} 