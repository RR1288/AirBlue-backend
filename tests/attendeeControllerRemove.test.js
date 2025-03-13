//attendeeControllerRemove.test.js

//Set up constants
const { removeAttendee } = require('../controllers/attendeeController');
const { Event, Attendee, EventStaff } = require('../models');
const { Roles } = require('../utils/Roles');
const { Sequelize } = require('sequelize');  // Added import for Sequelize

jest.mock('../models'); // Mock the models

//Testing time
describe('removeAttendee', () => {

    //Test 1: Error if no event
    test('Should throw error if event is not found', async () => {
        // Mock the Event.findByPk to return null (event not found)
        Event.findByPk.mockResolvedValue(null);
        
        await expect(removeAttendee(1, 2, 3, Roles.ATTENDEE))
            .rejects
            .toThrow('Event not found');
    });

    //Test 2: Error if no attendee
    test('Should throw error if attendee is not found', async () => {
        // Mock the Event.findByPk to return a valid event
        Event.findByPk.mockResolvedValue({ id: 1 });
        
        // Mock the Attendee.findOne to return null (attendee not found)
        Attendee.findOne.mockResolvedValue(null);

        await expect(removeAttendee(1, 2, 3, Roles.ATTENDEE))
            .rejects
            .toThrow('Attendee not found');
    });

    //Test 3: Error if user has no role
    test('Should throw error if requester is not the attendee and has no role', async () => {
        // Mock the Event.findByPk to return a valid event
        Event.findByPk.mockResolvedValue({ id: 1 });
        
        // Mock the Attendee.findOne to return a valid attendee
        Attendee.findOne.mockResolvedValue({ EventID: 1, UserID: 2 });

        // No role means this will fail for non-matching user
        await expect(removeAttendee(1, 2, 3, undefined))
            .rejects
            .toThrow('User to be removed does not match logged user');
    });

    //Test 4: Error if planner isn't in event organization
    test('Should throw error if planner is not in the event organization', async () => {
        // Mock the Event.findByPk to return a valid event
        Event.findByPk.mockResolvedValue({ id: 1 });
        
        // Mock the Attendee.findOne to return a valid attendee
        Attendee.findOne.mockResolvedValue({ EventID: 1, UserID: 2 });

        // Mock the EventStaff.findOne to return null (planner not in event)
        EventStaff.findOne.mockResolvedValue(null);

        await expect(removeAttendee(1, 2, 3, Roles.PLANNER))
            .rejects
            .toThrow('Attendee not found');
            //THIS SHOULD SEND "Attendee not found" but that requires some reorginzing of code that I'm not comfy with
    });

    //Successfully remove attendee
    test('Should successfully remove attendee if requester is the same as the target user', async () => {
        // Mock the Event.findByPk to return a valid event
        Event.findByPk.mockResolvedValue({ id: 1 });
        
        // Mock the Attendee.findOne to return a valid attendee
        const mockAttendee = { EventID: 1, UserID: 3, save: jest.fn(), destroy: jest.fn() };
        Attendee.findOne.mockResolvedValue(mockAttendee);

        // Call the function
        await removeAttendee(1, 3, 3, Roles.ATTENDEE);

        // Check that attendee save and destroy were called
        expect(Attendee.findOne).toHaveBeenCalled();
        expect(mockAttendee.save).toHaveBeenCalled();
        expect(mockAttendee.destroy).toHaveBeenCalled();
    });

    
});
