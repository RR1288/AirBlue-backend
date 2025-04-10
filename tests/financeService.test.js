//financeService.test.js

//Constants
const { setEventBudget, getAllEventsFinance, getEventBudgetLogs } = require('../services/financeService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { setEventBudget: setEventBudgetController } = require('../controllers/eventController');
const FinanceViews = require('../views/financeViews');
const { validateUserID } = require("../utils/UserSanitizations");
const { validateOrganizationID } = require("../utils/OrganizationSanitization");
const { sanitizeFlightBudget, sanitizeTotalBudget, validateEventID, sanitizeThresholdValuePercent } = require("../utils/eventSanitization");
const jwt = require("jsonwebtoken");

//Mocks
jest.mock('../utils/responseHelpers', () => ({
  sendSuccess: jest.fn(),
  sendError: jest.fn(),
}));

jest.mock('../controllers/eventController', () => ({
  setEventBudget: jest.fn(),
}));

jest.mock('../views/financeViews', () => ({
  getEventsFinance: jest.fn(),
  getJoinableEventsFinance: jest.fn(),
  getBudgetLogs: jest.fn(),
}));

jest.mock('../utils/UserSanitizations', () => ({
  validateUserID: jest.fn(),
}));

jest.mock('../utils/OrganizationSanitization', () => ({
  validateOrganizationID: jest.fn(),
}));

jest.mock('../utils/eventSanitization', () => ({
  sanitizeFlightBudget: jest.fn(),
  sanitizeTotalBudget: jest.fn(),
  validateEventID: jest.fn(),
  sanitizeThresholdValuePercent: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

//Testing time
describe('Finance Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Test for setEventBudget
  describe('setEventBudget', () => {

    //Test 1: Error if missing inputs
    it('Should return error if missing inputs', async () => {
      const req = { body: {}, user: { id: '1' } };
      const res = {};

      await setEventBudget(req, res);

      expect(sendError).toHaveBeenCalledWith(res, 'missing inputs', 400);
    });

    //Test 2: Error if invalid userID
    it('Should return error if invalid userID', async () => {
      const req = { body: { eventID: '1', totalBudget: 1000, flightBudget: 500 }, user: { id: '1' } };
      const res = {};

      validateUserID.mockResolvedValue(false); // Simulate invalid user

      await setEventBudget(req, res);

      expect(sendError).toHaveBeenCalledWith(res, 'invalid userId', 400);
    });

    //Test 3: Error if invalid eventID
    it('Should return error if invalid eventID', async () => {
      const req = { body: { eventID: '1', totalBudget: 1000, flightBudget: 500 }, user: { id: '1' } };
      const res = {};

      validateUserID.mockResolvedValue(true);
      validateEventID.mockReturnValue(false); // Simulate invalid eventID

      await setEventBudget(req, res);

      expect(sendError).toHaveBeenCalledWith(res, 'invalid EventID', 400);
    });

    //Test 4: Successfully update budget
    it('Should successfully update event budget', async () => {
      const req = { body: { eventID: '1', totalBudget: 1000, flightBudget: 500, thresholdVal: 10 }, user: { id: '1' } };
      const res = {};

      validateUserID.mockResolvedValue(true);
      validateEventID.mockReturnValue(true);
      sanitizeTotalBudget.mockReturnValue(1000);
      sanitizeFlightBudget.mockReturnValue(500);
      sanitizeThresholdValuePercent.mockReturnValue(10);
      setEventBudgetController.mockResolvedValue(true); // Simulate successful budget update

      await setEventBudget(req, res);

      expect(sendSuccess).toHaveBeenCalledWith(res, 'successfully updated event budget');
    });

    //Test 5: Error if fail to set budget
    it('Should return error if failed to set budget', async () => {
      const req = { body: { eventID: '1', totalBudget: 1000, flightBudget: 500, thresholdVal: 10 }, user: { id: '1' } };
      const res = {};

      validateUserID.mockResolvedValue(true);
      validateEventID.mockReturnValue(true);
      sanitizeTotalBudget.mockReturnValue(1000);
      sanitizeFlightBudget.mockReturnValue(500);
      sanitizeThresholdValuePercent.mockReturnValue(10);
      setEventBudgetController.mockResolvedValue(false); // Simulate failed budget update

      await setEventBudget(req, res);

      expect(sendError).toHaveBeenCalledWith(res, 'failed to set budget', 400);
    });
  });

  //Tests for getAllEventsFinance function
  describe('getAllEventsFinance', () => {

    //Test 6: Error is user not found
    it('Should return error if user not found', async () => {
        const req = { headers: { authorization: 'Bearer token' } };
        const res = {};
      
        // Mock JWT verification
        jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
      
        // Mock validation functions
        validateUserID.mockResolvedValue(false); // Simulate user not found
        validateOrganizationID.mockResolvedValue(true); // Simulate organization valid
      
        // Call the function
        await getAllEventsFinance(req, res);
      
        // Assert that the error is due to the user not being found
        expect(sendError).toHaveBeenCalledWith(res, "failed to get events the user is in", 400);
        expect(sendError).toHaveBeenCalledTimes(1); // Ensure the function didn't continue after the error
    });
      
    //Test 7: Error if org not found
    it('Should return error if organization not found', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = {};

      jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
      validateUserID.mockResolvedValue(true);
      validateOrganizationID.mockReturnValue(false); // Simulate organization not found

      await getAllEventsFinance(req, res);

      expect(sendError).toHaveBeenCalledWith(res, "Organization does not exist", 404);
    });

    //Test 8: Return events
    it('Should return combined events if successfully retrieved', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = {};

      jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
      validateUserID.mockResolvedValue(true);
      validateOrganizationID.mockReturnValue(true);
      FinanceViews.getEventsFinance.mockResolvedValue([{ eventId: 1 }]);
      FinanceViews.getJoinableEventsFinance.mockResolvedValue([{ eventId: 2 }]);

      await getAllEventsFinance(req, res);

      expect(sendSuccess).toHaveBeenCalledWith(res, "successfully got events", [{ eventId: 1 }, { eventId: 2 }]);
    });

    //Test 9: Error if events cnat get got
    it('Should return error if failed to get events', async () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = {};

      jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
      validateUserID.mockResolvedValue(true);
      validateOrganizationID.mockReturnValue(true);
      FinanceViews.getEventsFinance.mockResolvedValue(null); // Simulate failure

      await getAllEventsFinance(req, res);

      expect(sendError).toHaveBeenCalledWith(res, 'failed to get events the user is in', 400);
    });
  });

  //Tests for getEventBudgetLogs function
  describe('getEventBudgetLogs', () => {

    //Test 10: Error if eventID is invalid
    it('Should return error if eventID is invalid', async () => {
      const req = { params: { eventID: '1' } };
      const res = {};

      validateEventID.mockResolvedValue(false); // Simulate invalid eventID

      await getEventBudgetLogs(req, res);

      expect(sendError).toHaveBeenCalledWith(res, 'event does not exist', 400);
    });

    //Test 11: Return budget logs
    it('Should return event budget logs if successfully retrieved', async () => {
      const req = { params: { eventID: '1' } };
      const res = {};

      validateEventID.mockResolvedValue(true);
      FinanceViews.getBudgetLogs.mockResolvedValue([{ logId: 1 }]);

      await getEventBudgetLogs(req, res);

      expect(sendSuccess).toHaveBeenCalledWith(res, 'successfully got event budget logs', [{ logId: 1 }]);
    });

    //Test 12: Error if no budget logs
    it('Should return error if failed to get event budget logs', async () => {
      const req = { params: { eventID: '1' } };
      const res = {};

      validateEventID.mockResolvedValue(true);
      FinanceViews.getBudgetLogs.mockResolvedValue(null); // Simulate failure

      await getEventBudgetLogs(req, res);

      expect(sendError).toHaveBeenCalledWith('failed to pull event budget logs', 400);
    });
  });
});
