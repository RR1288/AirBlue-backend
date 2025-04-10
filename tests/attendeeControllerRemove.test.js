//attendeeControllerRemove.test.js

//Set up constants
const nodemailer = require('nodemailer');
const { inviteAttendee, getAttendees, revokeInvitations, cancelOwnParticipation, removeConfirmedAttendees, checkPlannerAuthorization } = require('../controllers/attendeeController');
const { Attendee, Invitation, User, Event, EventStaff } = require('../models');
const { sendInvitation, sendAccountSetupEmail } = require('../utils/emailSender');
const { Roles } = require('../utils/Roles');
const { Op } = require('sequelize');
const crypto = require('crypto');

// Mock nodemailer
jest.mock('nodemailer');
const mockTransporter = {
  sendMail: jest.fn().mockResolvedValue(true), // Mocked response for sending emails
};
nodemailer.createTransport.mockReturnValue(mockTransporter);

// Mock external modules like database models and email sending
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

//Testing time
describe('attendeeController', () => {
  afterEach(async () => {
    await jest.clearAllMocks();
  });

  //Tests for inviteAttendee
  describe('inviteAttendee', () => {
    
    //Test 1: Send invitation to attendee
    it('Should send an invitation for a new attendee', async () => {
      const eventId = 1;
      const email = 'test@example.com';
      const eventGroupId = 2;
      
      const userMock = null; // Simulating no user found
      const invitationData = {
        EventID: eventId,
        invitedEmail: email,
        status: 'pending',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        token: 'fakeToken',
        EventGroupID: eventGroupId,
      };

      User.findOne.mockResolvedValue(userMock);
      Invitation.create.mockResolvedValue({
        InvitationID: 1,
        invitedEmail: email,
        EventGroupID: eventGroupId,
        status: 'pending',
      });
      sendAccountSetupEmail.mockResolvedValue(true);
      sendInvitation.mockResolvedValue(true);
      crypto.randomBytes.mockReturnValue({ toString: () => 'fakeToken' });

      const result = await inviteAttendee(eventId, email, eventGroupId);

      expect(User.findOne).toHaveBeenCalledWith({ where: { Email: { [Op.iLike]: email } } });
      expect(Invitation.create).toHaveBeenCalledWith(expect.objectContaining({ invitedEmail: email }));
      expect(sendAccountSetupEmail).toHaveBeenCalledWith(email, expect.stringContaining('register'));
      expect(sendInvitation).toHaveBeenCalledWith(email, expect.stringContaining('register'));
      expect(result).toEqual({
        invitationId: 1,
        invitedEmail: email,
        eventGroupId: eventGroupId,
        status: 'pending',
      });
    });

    //Test 2: Send invitation to exisiting attendee
    it('Should send an invitation for an existing attendee', async () => {
      const eventId = 1;
      const email = 'test@example.com';
      const eventGroupId = 2;

      const userMock = { UserID: 1 }; // Simulating an existing user
      const invitationData = {
        EventID: eventId,
        invitedEmail: email,
        status: 'pending',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        token: 'fakeToken',
        EventGroupID: eventGroupId,
        UserID: 1,
      };

      User.findOne.mockResolvedValue(userMock);
      Invitation.create.mockResolvedValue({
        InvitationID: 1,
        invitedEmail: email,
        EventGroupID: eventGroupId,
        status: 'pending',
      });
      sendInvitation.mockResolvedValue(true);
      crypto.randomBytes.mockReturnValue({ toString: () => 'fakeToken' });

      const result = await inviteAttendee(eventId, email, eventGroupId);

      expect(User.findOne).toHaveBeenCalledWith({ where: { Email: { [Op.iLike]: email } } });
      expect(Invitation.create).toHaveBeenCalledWith(expect.objectContaining({ invitedEmail: email }));
      expect(sendInvitation).toHaveBeenCalledWith(email, expect.stringContaining('accept-invite'));
      expect(result).toEqual({
        invitationId: 1,
        invitedEmail: email,
        eventGroupId: eventGroupId,
        status: 'pending',
      });
    });
  });

  //Tests for getAttendees
  describe('getAttendees', () => {

    //Test 3: Return attendeees and invitations
    it('Should return attendees and pending invitations for a given event', async () => {
      const eventId = 1;
  
      const attendeesMock = [
        {
          InvitationID: 1,
          invitedEmail: 'test@example.com',
          status: 'pending',
        },
      ];
  
      const invitationsMock = [
        {
          InvitationID: 1,
          invitedEmail: 'test@example.com',
          status: 'pending',
        },
      ];
  
      // Mocking the Sequelize model methods
      Attendee.findAll.mockResolvedValue(attendeesMock);
      Invitation.findAll.mockResolvedValue(invitationsMock);
  
      const result = await getAttendees(eventId);
  
      // Update the expected result format to match the actual structure
      expect(result).toEqual({
        attendees: attendeesMock,
        pendingInvitations: invitationsMock,
      });
  
      // Check that the models were called correctly
      expect(Attendee.findAll).toHaveBeenCalledWith({
        where: { EventID: eventId },
        include: [
          { model: User, attributes: ['UserID', 'FName', 'LName', 'Email'] },
          { model: Event, attributes: ['EventID', 'EventName'] },
        ],
      });
      expect(Invitation.findAll).toHaveBeenCalledWith({
        where: { EventID: eventId, status: 'pending' },
        attributes: ['InvitationID', 'invitedEmail', 'status'],
      });
    });
  });
  
  

  //Tests for cancelOwnParticipation function
  describe('cancelOwnParticipation', () => {
    
    //Test 4: Cancel own invitation
    it('Should cancel own invitation', async () => {
      const eventId = 1;
      const requesterId = 1;
      const invitationMock = { InvitationID: 1, status: 'pending', save: jest.fn(), destroy: jest.fn() };

      Invitation.findOne.mockResolvedValue(invitationMock);

      const result = await cancelOwnParticipation(eventId, requesterId);

      expect(Invitation.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: { EventID: eventId, UserID: requesterId } }));
      expect(invitationMock.destroy).toHaveBeenCalled();
      expect(result).toEqual({ canceled: true, method: 'invitation', id: undefined });
    });

    //Test 5: Cancel if no invitation 
    it('Should cancel own attendance if no invitation found', async () => {
      const eventId = 1;
      const requesterId = 1;
      const attendeeMock = { AttendeeID: 1, save: jest.fn(), destroy: jest.fn() };

      Invitation.findOne.mockResolvedValue(null);
      Attendee.findOne.mockResolvedValue(attendeeMock);

      const result = await cancelOwnParticipation(eventId, requesterId);

      expect(Attendee.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: { EventID: eventId, UserID: requesterId } }));
      expect(attendeeMock.destroy).toHaveBeenCalled();
      expect(result).toEqual({ canceled: true, method: 'invitation', id: undefined });
    });

    //Test 6: Error if no invitation
    it('Should throw an error if no invitation or attendance found', async () => {
      const eventId = 1;
      const requesterId = 1;

      Invitation.findOne.mockResolvedValue(null);
      Attendee.findOne.mockResolvedValue(null);

      await expect(cancelOwnParticipation(eventId, requesterId)).rejects.toThrow('No invitation or attendance record found for cancellation.');
    });
  });
});
