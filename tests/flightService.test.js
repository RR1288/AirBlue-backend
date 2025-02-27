// flightController.test.js

//Set up constants
const { createRequest, getOffers } = require("../services/flightService");
const { sendSuccess, sendError } = require("../utils/responseHelpers");
const { validateFlightParams } = require("../utils/validateFlightParams");
const flightController = require("../controllers/flightController");

//There is a lot of mocking in this test, it just had to be done

//Mock up the response helpers
jest.mock("../utils/responseHelpers", () => ({
  sendSuccess: jest.fn(),
  sendError: jest.fn(),
}));

//Mock up flight params
jest.mock("../utils/validateFlightParams", () => ({
  validateFlightParams: jest.fn(),
}));

//Mock up flight controller
jest.mock("../controllers/flightController", () => ({
  createOfferRequest: jest.fn(),
  fetchOffers: jest.fn(),
}));

//Describe the flight service funcitons
describe("Flight Service", () => {

    // Suppress console logs. I dont wanna see all that stuff in the terminal when running the tests
    beforeAll(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRequest", () => {
    it("should create a request and return a success message", async () => {
      const mockRequest = {
        query: {
          origin: "LHR",
          destination: "JFK",
          departureDate: "2025-04-01",
          cabinClass: "economy",
        },
      };
      const mockResponse = {};
      const mockRequestId = "mockRequestId";
      flightController.createOfferRequest.mockResolvedValue(mockRequestId);
      validateFlightParams.mockImplementation(() => {});

      // Act
      await createRequest(mockRequest, mockResponse);

      // Assert
      expect(validateFlightParams).toHaveBeenCalledWith(mockRequest.query);
      expect(flightController.createOfferRequest).toHaveBeenCalledWith(mockRequest.query);
      expect(sendSuccess).toHaveBeenCalledWith(
        mockResponse,
        "Created request successfully",
        { request_id: mockRequestId }
      );
    });

    //First Test: Return error is validation fails
    it("Should return an error if validation fails", async () => {
      const mockRequest = {
        query: {
          origin: "LHR",
          destination: "JFK",
          departureDate: "2025-04-01",
          cabinClass: "economy",
        },
      };
      const mockResponse = {};
      validateFlightParams.mockImplementation(() => {
        throw new Error("Invalid cabin class");
      });

      // Act
      await createRequest(mockRequest, mockResponse);

      // Assert
      expect(validateFlightParams).toHaveBeenCalledWith(mockRequest.query);
      expect(sendError).toHaveBeenCalledWith(mockResponse, "Failed to create offer request", 500);
    });

    //Second Test: Return error is the create offer request fails
    it("Should return an error if createOfferRequest fails", async () => {
      const mockRequest = {
        query: {
          origin: "LHR",
          destination: "JFK",
          departureDate: "2025-04-01",
          cabinClass: "economy",
        },
      };
      const mockResponse = {};
      flightController.createOfferRequest.mockRejectedValue(new Error("Request creation failed"));
      validateFlightParams.mockImplementation(() => {});

      // Act
      await createRequest(mockRequest, mockResponse);

      // Assert
      expect(validateFlightParams).toHaveBeenCalledWith(mockRequest.query);
      expect(flightController.createOfferRequest).toHaveBeenCalledWith(mockRequest.query);
      expect(sendError).toHaveBeenCalledWith(mockResponse, "Failed to create offer request", 500);
    });
  });

  describe("getOffers", () => {
    //Third Test: Fetch the offers sucessfully
    it("Should fetch offers successfully", async () => {
      const mockRequest = {
        query: {
          offer_request_id: "mockOfferRequestId",
          limit: 10,
        },
      };
      const mockResponse = {};
      const mockOffers = [
        { id: "offer1", price: 100 },
        { id: "offer2", price: 200 },
      ];
      flightController.fetchOffers.mockResolvedValue(mockOffers);

      // Act
      await getOffers(mockRequest, mockResponse);

      // Assert
      expect(flightController.fetchOffers).toHaveBeenCalledWith({
        offerRequestId: "mockOfferRequestId",
        limit: 10,
        after: undefined,
        before: undefined,
      });
      expect(sendSuccess).toHaveBeenCalledWith(
        mockResponse,
        "Offers fetched successfully",
        { offers: mockOffers }
      );
    });

    //Fifth Test: Return error if offer request id isn't there
    it("should return an error if offer_request_id is missing", async () => {
      const mockRequest = {
        query: {
          limit: 10,
        },
      };
      const mockResponse = {};

      // Act
      await getOffers(mockRequest, mockResponse);

      // Assert
      expect(sendError).toHaveBeenCalledWith(
        mockResponse,
        "Missing required parameter: offer_request_id",
        400
      );
    });

    //Sixth Test: Return an error if the limit isn't valid
    it("should return an error if limit is invalid", async () => {
      const mockRequest = {
        query: {
          offer_request_id: "mockOfferRequestId",
          limit: "invalid",
        },
      };
      const mockResponse = {};

      // Act
      await getOffers(mockRequest, mockResponse);

      // Assert
      expect(sendError).toHaveBeenCalledWith(mockResponse, "Invalid limit parameter", 400);
    });

    //Eighth Test: Return an error is fetch offers doesn't work
    it("should return an error if fetchOffers fails", async () => {
      const mockRequest = {
        query: {
          offer_request_id: "mockOfferRequestId",
          limit: 10,
        },
      };
      const mockResponse = {};
      flightController.fetchOffers.mockRejectedValue(new Error("Failed to fetch offers"));

      // Act
      await getOffers(mockRequest, mockResponse);

      // Assert
      expect(sendError).toHaveBeenCalledWith(
        mockResponse,
        "Failed to fetch offers",
        500
      );
    });
  });
});
