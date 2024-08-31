import { FormatSecondToTime } from "../services.server/TimeslotsGenerator";
import { GameStatistics } from "../types";

type props = {
    playerCount: number,
    statistics: GameStatistics
}

const StatisticsComponent = ({ playerCount, statistics }: props) => {
    const closestBet =FormatSecondToTime(statistics.closestBet.differenceSeconds);
    const shortestDuration = FormatSecondToTime(statistics.shortestDuration.durationSeconds);
    return (
        <div className="stats shadow mt-8">
            <div className="stat">
                <div className="stat-title">Players</div>
                <div className="stat-value">{playerCount}</div>
            </div>
            <div className="stat">
                <div className="stat-title">Collisions</div>
                <div className="stat-value">{statistics.collisions}</div>
            </div>
            <div className="stat">
                <div className="stat-title">Closest bet</div>
                <div className="stat-value">{closestBet}</div>
                <div className="stat-desc">{statistics.closestBet.player1} and {statistics.closestBet.player2}</div>
            </div>
            <div className="stat">
                <div className="stat-title">Shortest duration</div>
                <div className="stat-value">{shortestDuration}</div>
                <div className="stat-desc">{statistics.shortestDuration.player}</div>
            </div>
        </div>
    )
}

export default StatisticsComponent;