//flightControllerCancel.test.js

//Constants
const { declinePendingFlight, cancelApprovedFlight, cancelOrder } = require('../controllers/flightController');
const { Itinerary } = require("../models");

//Mock it up
jest.mock("../models", () => ({
    Itinerary: {
        findByPk: jest.fn(),
    },
}));

jest.mock('../controllers/flightController', () => ({
    ...jest.requireActual('../controllers/flightController'),
    cancelOrder: jest.fn(),
}));


//Testing time
describe("Flight Controller", () => {

    //Tests for declinePendingFlight
    describe("declinePendingFlight", () => {


        //Test 1: Error if tryiing to decline a non-pending itineary
        it("Should throw an error if trying to decline a non-pending itinerary", async () => {
            const mockItinerary = { ApprovalStatus: "approved" };
            Itinerary.findByPk.mockResolvedValue(mockItinerary);
            await expect(declinePendingFlight(1)).rejects.toThrow("Only pending itineraries can be declined");
        });

        
    });

    //Test for cancelApprovedFlight function
    describe("cancelApprovedFlight", () => {

        //Test 2: Error if no itineary
        it("Should throw an error if itinerary is not found", async () => {
            Itinerary.findByPk.mockResolvedValue(null);  // Simulate itinerary not found
            await expect(cancelApprovedFlight(1)).rejects.toThrow("Itinerary not found");
        });

        //Test 3: Error if trying to cancel ghost itinerary
        it("Should throw an error if trying to cancel a non-approved itinerary", async () => {
            const mockItinerary = { ApprovalStatus: "pending" };
            Itinerary.findByPk.mockResolvedValue(mockItinerary);
            await expect(cancelApprovedFlight(1)).rejects.toThrow("Only approved itineraries can be cancelled");
        });

        
    });
});
