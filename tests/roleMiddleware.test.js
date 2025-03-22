//Set up our constants needed for tests. We're using the role middleware, the response helper, and the actual roles 
const { authorizedRoles } = require('../middleware/roleMiddleware');
const { sendError } = require('../utils/responseHelpers');
const { Roles } = require('../utils/Roles');

// Mocking sendError to confirm if it's being called, this will be used a lot in these tests so its good to test it here
jest.mock('../utils/responseHelpers', () => ({
  sendError: jest.fn(),
}));

describe('Role Authorization Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Set up mocks for req, res, and next
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(async () => {
    await jest.clearAllMocks();
  });

  //First test is seeing if a user with the Event Planner, Administrator and Finance role has access with those roles
  test('Should allow access if user has the correct role', () => {
    // Mock the user with roles
    req.user = { roles: 'AEF' }; // Event Planner, Administrator, Finance

    // Test user with the Event Planner role
    authorizedRoles(Roles.PLANNER)(req, res, next);
    expect(next).toHaveBeenCalledTimes(1); // Ensure next() is called, meaning access is granted

    // Test user with the Finance role
    authorizedRoles(Roles.FINANCE)(req, res, next);
    expect(next).toHaveBeenCalledTimes(2); // Ensure next() is called

    // Test with the Administrator role
    authorizedRoles(Roles.ADMIN)(req, res, next);
    expect(next).toHaveBeenCalledTimes(3); // Ensure next() is called
  });

  //Second test is denying a user based on not having the Finance role
  test('Should deny access if user does not have the correct role', () => {
    // Mock the user with E and A
    req.user = { roles: 'AE' }; // Event Planner, Administrator

    // Test when the user doesn't have the Finance role
    authorizedRoles(Roles.FINANCE)(req, res, next);
    expect(sendError).toHaveBeenCalledWith(
      res,
      'Forbidden: Insufficient permissions',
      401
    ); // Ensure sendError is called, meaning access is denied
    expect(next).not.toHaveBeenCalled(); // Ensure next() is not called
  });

  //Thrid test is when a user has no roles and making sure they don't have access to any of the role info
  test('Should deny access if user has no roles', () => {
    // Mock the user without any roles (Most likely just an antendee in this scenario)
    req.user = {}; // No roles

    authorizedRoles(Roles.PLANNER)(req, res, next);
    expect(sendError).toHaveBeenCalledWith(
      res,
      'Forbidden: Insufficient permissions',
      401
    ); // Ensure sendError is called
    expect(next).not.toHaveBeenCalled(); // Ensure next() is not called
  });

  //Fourth test is denying user who doesn't have enough roles
  test('Should deny access if user has insufficient roles', () => {
    // Mock the user with roles
    req.user = { roles: 'F' }; // Finance

    // Test when the user doesn't have Event Planner or Administrator roles
    authorizedRoles(Roles.PLANNER, Roles.ADMIN)(req, res, next);
    expect(sendError).toHaveBeenCalledWith(
      res,
      'Forbidden: Insufficient permissions',
      401
    ); // Ensure sendError is called
    expect(next).not.toHaveBeenCalled(); // Ensure next() is not called
  });
});
