//eventConntrollerGroupUpdate.test.js

//Constants
const { updateEventGroup } = require("../controllers/eventController");
const { EventGroup } = require("../models");

//Mocks
jest.mock("../models", () => ({
    EventGroup: {
        findByPk: jest.fn(),
    }
}));

//Testing time
describe("updateEventGroup", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    //Test 1: Error if no event group
    it("Should throw an error if event group is not found", async () => {
        const eventGroupID = 9999999999999; 
        const updates = { Name: "Updated Event Group", flightBudget: 5000 };

        EventGroup.findByPk.mockResolvedValue(null);

        await expect(updateEventGroup(eventGroupID, updates)).rejects.toThrow(
            "Failed to update event group"
        );
    });

    //Test 2: Error i update fails
    it("Should throw an error if update fails", async () => {
        const eventGroupID = 1;
        const updates = { Name: "Updated Event Group", flightBudget: 5000 };

        const mockEventGroup = {
            EventGroupID: eventGroupID,
            Name: "Old Event Group",
            flightBudget: 1000,
            update: jest.fn().mockRejectedValue(new Error("Update failed")),
        };

        EventGroup.findByPk.mockResolvedValue(mockEventGroup);

        await expect(updateEventGroup(eventGroupID, updates)).rejects.toThrow(
            "Failed to update event group"
        );
    });
});
