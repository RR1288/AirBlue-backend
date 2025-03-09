// flightController.test.js
const flightController = require("../controllers/flightController");
const { sendSuccess, sendError } = require("../utils/responseHelpers");

// Mock the fetch API used in the flight controller
global.fetch = jest.fn();

// Sample response data for mock. Its better to mock then make the actual API call since things can get really muddy for unit testing.
const mockOfferRequestResponse = {
    data: {
        id: "mockOfferRequestId",
    },
};

const mockOfferResponse = {
    data: {
        offers: [
            { id: "offer1", price: 100 },
            { id: "offer2", price: 200 },
        ],
    },
};

describe("Flight Controller", () => {
    // Mock console.error to suppress error logs. The tests pass but the console would spit out a bunch of stuff
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        // Restore the original implementation of console.error
        console.error.mockRestore();
    });

    afterEach(() => {
        // Reset fetch mock to prevent state leakage between tests
        fetch.mockClear();
    });

    //First Test: create an offer request and return an ID
    it("Should create an offer request and return an id", async () => {
        // Arrange
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockOfferRequestResponse,
        });

        const requestBody = {
            origin: "LHR",
            destination: "JFK",
            departureDate: "2025-04-01",
            cabinClass: "economy",
        };

        // Act
        const result = await flightController.createOfferRequest(requestBody);

        // Assert
        expect(result).toEqual(mockOfferRequestResponse.data.id);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            "https://api.duffel.com/air/offer_requests?return_offers=false",
            expect.objectContaining({
                method: "POST",
                body: expect.stringContaining("LHR"),
            })
        );
    });

    //Second Test: Throw an error if offer fails
    it("Should throw an error if the offer request fails", async () => {
        // Arrange
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        const requestBody = {
            origin: "LHR",
            destination: "JFK",
            departureDate: "2025-04-01",
            cabinClass: "economy",
        };

        // Act & Assert
        await expect(flightController.createOfferRequest(requestBody)).rejects.toThrow(
            "Error creating an offer request"
        );
    });

    //Third Test: Should sucesffuly fetch flight offers
    it("Should fetch flight offers successfully", async () => {
        // Arrange
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockOfferResponse,
        });

        const offerRequestId = "mockOfferRequestId";
        const limit = 10;

        // Act
        const result = await flightController.fetchOffers({ offerRequestId, limit });

        // Assert
        expect(result).toEqual(mockOfferResponse);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("offer_request_id=mockOfferRequestId"),
            expect.objectContaining({
                method: "GET",
            })
        );
    });

    //Fourth Test: Handel errors when fetching offers
    it("should handle an error when fetching offers", async () => {
        // Arrange
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        const offerRequestId = "mockOfferRequestId";
        const limit = 10;

        // Act & Assert
        await expect(flightController.fetchOffers({ offerRequestId, limit })).rejects.toThrow(
            "Error fetching offers"
        );
    });
});
