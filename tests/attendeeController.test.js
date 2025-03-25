// attendeeController.test.js

// Set up constants
const { inviteAttendee, getAttendees } = require('../controllers/attendeeController');
const { User, Invitation, Attendee, Event } = require('../models');
const { sendInvitation, sendAccountSetupEmail } = require('../utils/emailSender');
const crypto = require('crypto');
const { Op } = require('sequelize');

// Mock the dependencies
jest.mock('../models');
jest.mock('../utils/emailSender');
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from('mockToken', 'hex')),
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('mockHash'),
  }),
}));

// Mocking other dependencies
jest.mock('object-hash', () => ({
  default: jest.fn().mockReturnValue('mocked-hash'),
}));

// Mocking winston-daily-rotate-file
// Mocking winston-daily-rotate-file
jest.mock('winston-daily-rotate-file', () => {
  return jest.fn().mockImplementation(() => {
    return {
      log: jest.fn(), // Simulating the log method
    };
  });
});

// Mocking winston
jest.mock('winston', () => ({
  createLogger: jest.fn().mockReturnValue({
    add: jest.fn(), // Mock the add method
    transports: [], // Transport array (to avoid issues)
  }),
  transports: {
    Console: jest.fn().mockImplementation(() => ({ log: jest.fn() })), // Mock the Console transport
  },
  format: {
    combine: jest.fn().mockReturnValue('mocked-combined-format'), // Mock combine to return a placeholder value
    timestamp: jest.fn().mockReturnValue('mocked-timestamp'), // Mock timestamp
    printf: jest.fn().mockReturnValue('mocked-printf'), // Mock printf
  },
}));




// Mock nodemailer to avoid actual email sending (so we don't get blacklisted early lol)
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue('Email sent'), // Mock sending emails successfully
  }),
}));

// Mock crypto.randomBytes to return a predictable token


// Testing time
describe('attendeeController', () => {

  // Tests for inviteAttendee function
  describe('inviteAttendee', () => {

    // Test 1: Invite existing user 
    it('Should invite an existing user and create an invitation', async () => {
      // Arrange
      const eventId = 1;
      const email = 'testuser@example.com';
      const mockUser = { UserID: 1, Email: email };
      const mockInvitation = { InvitationID: 1, invitedEmail: email, status: 'pending' };

      User.findOne.mockResolvedValue(mockUser); // Simulate user found in DB
      Invitation.create.mockResolvedValue(mockInvitation); // Simulate successful invitation creation
      sendInvitation.mockResolvedValue(undefined); // Simulate successful email sending

      const expectedResult = {
        invitationId: mockInvitation.InvitationID,
        invitedEmail: mockInvitation.invitedEmail,
        status: mockInvitation.status,
      };

      // Act
      const result = await inviteAttendee(eventId, email);

      // Assert
      expect(result).toEqual(expectedResult);
      await expect(User.findOne).toHaveBeenCalledWith({
        where: { Email: { [Op.iLike]: email } },
      });
      await expect(Invitation.create).toHaveBeenCalledWith(expect.objectContaining({
        EventID: eventId,
        invitedEmail: email,
        status: 'pending',
      }));
      expect(sendInvitation).toHaveBeenCalledWith(email, expect.any(String));
    });

    // Test 2: Return attendee and pending invitations for event
    it('Should return attendees and pending invitations for an event', async () => {
      // Arrange
      const eventId = 1;
    
      // Mocked Attendee Data
      const mockAttendees = [
        { 
          InvitationID: 1, 
          invitedEmail: 'testuser@example.com', 
          status: 'pending' 
        },
      ];
    
      // Mocked Pending Invitation Data
      const mockPendingInvitations = [
        { 
          InvitationID: 1, 
          invitedEmail: 'testuser@example.com', 
          status: 'pending' 
        },
      ];
    
      // Mock the database calls for attendees and invitations
      Attendee.findAll.mockResolvedValue(mockAttendees); // Simulate finding attendees
      Invitation.findAll.mockResolvedValue(mockPendingInvitations); // Simulate finding pending invitations
    
      const expectedResult = {
        attendees: mockAttendees, // Expected attendees with invitation data (based on your function behavior)
        pendingInvitations: mockPendingInvitations, // Expected pending invitations
      };
    
      // Act
      const result = await getAttendees(eventId);
    
      // Assert
      expect(result).toEqual(expectedResult); // Check if the result matches the expected structure
      await expect(Attendee.findAll).toHaveBeenCalledWith({
        where: { EventID: eventId },
        include: [
          { model: User, attributes: ['UserID', 'FName', 'LName', 'Email'] },
          { model: Event, attributes: ['EventID', 'EventName'] },
        ],
      });
      await expect(Invitation.findAll).toHaveBeenCalledWith({
        where: { EventID: eventId, status: 'pending' },
        attributes: ['InvitationID', 'invitedEmail', 'status'],
      });
    });
  });

  // Tests for getAttendees function
  describe('getAttendees', () => {

    // Test 1: Should retrieve attendees for a given event
    it('Should retrieve attendees for a given event', async () => {
      // Arrange
      const eventId = 1;
      const mockAttendees = [
        {
          UserID: 1,
          FName: 'John',
          LName: 'Doe',
          Email: 'john.doe@example.com',
        },
        {
          UserID: 2,
          FName: 'Jane',
          LName: 'Smith',
          Email: 'jane.smith@example.com',
        },
      ];

      // Mock the database call
      Attendee.findAll.mockResolvedValue(mockAttendees);

      // Act
      const result = await getAttendees(eventId);

      // Assert
      expect(result.attendees).toEqual(mockAttendees);
      await expect(Attendee.findAll).toHaveBeenCalledWith({
        where: { EventID: eventId },
        include: [
          { model: User, attributes: ['UserID', 'FName', 'LName', 'Email'] },
          { model: Event, attributes: ['EventID', 'EventName'] },
        ],
      });
    });

    // Test 2: Should return empty array if no attendees exist
    it('Should return empty array if no attendees exist for a given event', async () => {
      // Arrange
      const eventId = 1;

      // Mock the database call to return no attendees
      Attendee.findAll.mockResolvedValue([]);

      // Act
      const result = await getAttendees(eventId);

      // Assert
      expect(result.attendees).toEqual([]); // Expect empty array for attendees
      await expect(Attendee.findAll).toHaveBeenCalledWith({
        where: { EventID: eventId },
        include: [
          { model: User, attributes: ['UserID', 'FName', 'LName', 'Email'] },
          { model: Event, attributes: ['EventID', 'EventName'] },
        ],
      });
    });
  });
});
