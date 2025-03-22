//eventConntrollerAccept.test.js

//Constatns
const { processInvitationAcceptance } = require('../controllers/eventController');
const { User, Invitation, Attendee } = require('../models');

//Mocks
jest.mock('../models', () => ({
  User: {
    findByPk: jest.fn(),
  },
  Invitation: {
    findOne: jest.fn(),
    update: jest.fn(),
  },
  Attendee: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Sequelize: {
    Op: { gt: jest.fn() }
  }
}));

//Testing Time
describe('processInvitationAcceptance', () => {
  beforeEach(async () => {
    // Reset mocks before each test
    await jest.clearAllMocks();
  });

  /*
  //Test 1: False if invitation is no good
  it('Should return false if invitation does not exist', async () => {
    // Mock Invitation.findOne to return null (invitation not found)
    Invitation.findOne.mockResolvedValue(null);
  
    const result = await processInvitationAcceptance('invalidToken');
    expect(result).toBe(false);
  
    // Adjust the test to allow matching the Symbol operator correctly
    expect(Invitation.findOne).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        token: 'invalidToken',
        status: 'pending',
        expiresAt: expect.any(Object),  // Match any object for expiresAt (including the operator)
      }),
    }));
  });
  
  //Test 2: False if user not there
  it('Should return false if user does not exist', async () => {
    // Mock Invitation.findOne to return an invitation
    Invitation.findOne.mockResolvedValue({
      UserID: 1,
      EventID: 1,
      EventGroupID: 1,
    });

    // Mock User.findByPk to return null (user does not exist)
    User.findByPk.mockResolvedValue(null);

    const result = await processInvitationAcceptance('validToken');
    expect(result).toBe(false);
    expect(User.findByPk).toHaveBeenCalledWith(1);
  });
  */

  //Test 3: True if user is already attendee
  it('Should return true if user is already an attendee', async () => {
    // Mock Invitation.findOne to return an invitation
    Invitation.findOne.mockResolvedValue({
      UserID: 1,
      EventID: 1,
      EventGroupID: 1,
    });

    // Mock User.findByPk to return a user
    User.findByPk.mockResolvedValue({ UserID: 1 });

    // Mock Attendee.findOne to return an existing attendee
    Attendee.findOne.mockResolvedValue({
      EventID: 1,
      UserID: 1,
      EventGroupID: 1,
    });

    const result = await processInvitationAcceptance('validToken');
    expect(result).toBe(true);
    expect(Attendee.findOne).toHaveBeenCalledWith({
      where: { EventID: 1, UserID: 1, EventGroupID: 1 },
    });
  });

  
  //Test 4: General error catch
  it('Should return false if there is an error during the process', async () => {
    // Simulate an error by making the User.findByPk throw an error
    User.findByPk.mockRejectedValue(new Error('Database error'));

    try {
      const result = await processInvitationAcceptance('validToken');
      expect(result).toBe(false); // Ensure false is returned
    } catch (error) {
      expect(error.message).toBe('Error processing invitation');
    }
  });
});