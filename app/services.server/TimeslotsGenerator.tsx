import { TSBGame, Gambler, TimeSlot } from '~/types'; 

const INTERVAL_BASE_S = 5 * 60;

export function GenerateTimeslots(game : TSBGame) : TSBGame {
    let timeSlots: TimeSlot[] = [];

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
            current.startTime = DetermineNewEndpoint(current, previous); 
        else 
            current.startTime = Math.max(current.betInSeconds - INTERVAL_BASE_S, 0);

        if (next && TimeOverlaps(current, next)) 
            current.endTime = DetermineNewEndpoint(current, next);
        else 
            current.endTime = current.betInSeconds + INTERVAL_BASE_S - 1;
    }

    game.timeSlots = timeSlots;
    return game;
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

function TimeOverlaps (current: TimeSlot, target: TimeSlot) {
    return Math.abs(current.betInSeconds - target.betInSeconds) < INTERVAL_BASE_S;
}

function DetermineNewEndpoint (current: TimeSlot, target: TimeSlot) {
    return (current.betInSeconds + target.betInSeconds) / 2;
}