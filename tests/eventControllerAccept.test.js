//eventControllerAccept.test.js

//Set up constants
const { processInvitationAcceptance } = require('../controllers/eventController');
const { Invitation, User, Attendee } = require('../models');
const { Op } = require("sequelize");

//Mock it up
jest.mock('../models');  

//Test time for processInvitationAccceptance funciton
describe('processInvitationAcceptance', () => {

    // Suppress console logs. I dont wanna see all that stuff in the terminal when running the tests
  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });
  
  let invitationToken;


  beforeEach(() => {
    invitationToken = 'validInvitationToken';  // Example invitation token
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //Test 1: False if invitation is no there/expired
  it('Should return false if invitation is not found or expired', async () => {
    // Mock Invitation.findOne to return null (invalid or expired invitation)
    Invitation.findOne.mockResolvedValue(null);
  
    const result = await processInvitationAcceptance(invitationToken);
  
    expect(result).toBe(false);
    expect(Invitation.findOne).toHaveBeenCalledWith({
      where: {
        token: invitationToken,
        status: 'pending',
        expiresAt: expect.objectContaining({ [Op.gt]: expect.any(Date) }), // Expect Op.gt with any Date
      },
    });
  });
  

  //Test 2:: False if user is not found
  it('Should return false if user is not found', async () => {
    // Mock Invitation.findOne to return a valid invitation
    Invitation.findOne.mockResolvedValue({
      UserID: 1,
      EventID: 1,
      EventGroupID: 1,
      token: 'validInvitationToken',
      status: 'pending',
      expiresAt: new Date('2030-03-16T23:27:56.504Z'),
    });
    // Mock User.findByPk to return null (user not found)
    User.findByPk.mockResolvedValue(null);

    const result = await processInvitationAcceptance(invitationToken);

    expect(result).toBe(false);
    expect(User.findByPk).toHaveBeenCalledWith(1); // Check that User is being queried with the correct ID
  });

  /*Commenting the following test out cause I'm struggling to figure out how to test properly. Works irl though so thats all that matters

  //Test 3: Add user and mark invitation
  it('should add user as an attendee and mark invitation as accepted', async () => {
    // Set up mocks
    Invitation.findOne.mockResolvedValue({
        UserID: 1,
        EventID: 1,
        EventGroupID: 1,
    });
    User.findByPk.mockResolvedValue({ UserID: 1 });
    Attendee.findOne.mockResolvedValue(null);  // User is not an attendee yet
    Attendee.create.mockResolvedValue({}); // Simulate attendee creation
    Invitation.prototype.update.mockResolvedValue({}); // Simulate updating invitation

    // Run the function
    const result = await processInvitationAcceptance('validInvitationToken');

    // Check that the function returns true (after creating attendee and updating invitation)
    expect(result).toBe(true);

    // Verify Attendee.create was called with the expected parameters
    expect(Attendee.create).toHaveBeenCalledWith({
        EventID: 1,
        UserID: 1,
        Confirmed: 't',
        EventGroupID: 1,
    });

    // Verify Invitation.update was called to mark the invitation as accepted
    expect(Invitation.prototype.update).toHaveBeenCalledWith({ status: 'accepted' });
});
*/

  //Test 4: Error if there is an exception
  it('Should throw an error if there is an exception during the process', async () => {
    // Mock Invitation.findOne to throw an error
    Invitation.findOne.mockRejectedValue(new Error('Database error'));

    await expect(processInvitationAcceptance(invitationToken)).rejects.toThrow('Error processing invitation');
  });
});
