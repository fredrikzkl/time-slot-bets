import { GenerateTimeslots } from "./TimeslotsGenerator";


describe("TimeslotsGenerator", () => {
    test("should generate timeslots no conflicts", () => {
        // Create mock game
        const game = {
            id: "1",
            name: "Test Game",
            url : "1of2of2",
            hostId : "lel",
            status : "active",
            gamblerIds : [
                {
                    id : "1",
                    name : "Aksel",
                    bet : "10:00"
                },
                {
                    id : "2",
                    name : "Fredrik",
                    bet : "20:00"
                },
                {
                    id : "3",
                    name : "Bjorn",
                    bet : "30:00"
                }
            ],
        };

        var result = GenerateTimeslots(game);
        expect(result.timeSlots).toHaveLength(3);
    });
});

