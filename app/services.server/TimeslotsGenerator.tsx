import { TSBGame, Gambler, TimeSlot, GameStatistics, GetEmptyStatistics } from '../types'; 

// 5 minutes
const INTERVAL_BASE_S = 5 * 60; // 300

export function GenerateTimeslots(game : TSBGame) : TSBGame {
    let timeSlots: TimeSlot[] = [];
    game.statistics = GetEmptyStatistics();

    game.gambler.forEach((gambler : Gambler) => {
        var m = parseInt(gambler.bet.split(':')[0]);
        var s = parseInt(gambler.bet.split(':')[1]);

        timeSlots.push({
            user_id: gambler.user_id,
            name: gambler.name,
            betInSeconds: m * 60 + s,
            startTime: 0,
            endTime: 0
        });
    });

    // Sort timeSlots based on betInSeconds
    timeSlots.sort((a, b) => a.betInSeconds - b.betInSeconds);

    for(let i = 0; i < timeSlots.length; i++) {
        let current = timeSlots[i];
        let previous = timeSlots[i - 1];
        let next = timeSlots[i + 1];

        if (previous && TimeOverlaps(current, previous)) 
            current.startTime = DetermineNewEndpoint(current, previous) + 1; 
        else 
            current.startTime = Math.max(current.betInSeconds - INTERVAL_BASE_S, 0);

        if (next && TimeOverlaps(current, next)) {
            current.endTime = DetermineNewEndpoint(current, next);
            game.statistics.collisions += 1;
        }
        else 
            current.endTime = current.betInSeconds + INTERVAL_BASE_S ;
    }

    game.timeSlots = timeSlots;

    game.statistics.closestBet = GetClosestBet(timeSlots);
    game.statistics.shortestDuration = GetShortestDuration(timeSlots);

    return game;
}

function TimeOverlaps (current: TimeSlot, target: TimeSlot) {
    return Math.abs(current.betInSeconds - target.betInSeconds) < INTERVAL_BASE_S * 2;
}

function DetermineNewEndpoint (current: TimeSlot, target: TimeSlot) {
    return Math.floor((current.betInSeconds + target.betInSeconds) / 2);
}

export function FormatSecondToTime (seconds: number) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;

    var mString = m.toString();
    var sString = s.toString();

    if (s < 10) {
        sString = '0' + s;
    }

    if (m < 10) {
        mString = '0' + m;
    }

    return mString + ':' + sString;
}

function GetClosestBet(timeSlots: TimeSlot[]) {
    let closestBet = {
        player1: '',
        player2: '',
        differenceSeconds: 99999999
    };

    for (let i = 0; i < timeSlots.length; i++) {
        let current = timeSlots[i];
        let next = timeSlots[i + 1];

        if (next) {
            let difference = Math.abs(current.betInSeconds - next.betInSeconds);

            if (difference < closestBet.differenceSeconds) {
                closestBet.player1 = current.name;
                closestBet.player2 = next.name;
                closestBet.differenceSeconds = difference;
            }
        }
    }

    return closestBet;
}

function GetShortestDuration(timeSlots: TimeSlot[]) {
    let shortestDuration = {
        player: '',
        durationSeconds: 99999999
    };

    for (let i = 0; i < timeSlots.length; i++) {
        let current = timeSlots[i];
        let duration = current.endTime - current.startTime;

        if (duration < shortestDuration.durationSeconds) {
            shortestDuration.player = current.name;
            shortestDuration.durationSeconds = duration;
        }
    }

    return shortestDuration;
}


