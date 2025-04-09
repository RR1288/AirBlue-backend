//eventControllerDelete.test.js

//Constants
const { sequelize, Event, Attendee, EventStaff, EventGroup, Invitation } = require('../models');
const eventController = require('../controllers/eventController');

//Mock
jest.mock('../models', () => ({
    Event: {
        findByPk: jest.fn(),
        destroy: jest.fn()
    },
    Attendee: {
        destroy: jest.fn()
    },
    EventStaff: {
        destroy: jest.fn()
    },
    EventGroup: {
        destroy: jest.fn()
    },
    Invitation: {
        destroy: jest.fn()
    },
    sequelize: {
        transaction: jest.fn()
    }
}));

//Testing Time
describe('deleteEvent', () => {
    const eventID = 1;
    const mockEvent = { EventID: eventID, destroy: jest.fn() };
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //Test 1: Successfully delete event
    test('Should delete event and related data successfully', async () => {

        Event.findByPk.mockResolvedValue(mockEvent);
        sequelize.transaction.mockImplementation(async (callback) => callback({
            Attendee: { destroy: jest.fn() },
            EventStaff: { destroy: jest.fn() },
            EventGroup: { destroy: jest.fn() },
            Invitation: { destroy: jest.fn() }
        }));

        const result = await eventController.deleteEvent(eventID);
     
        expect(Event.findByPk).toHaveBeenCalledWith(eventID);

        expect(sequelize.transaction).toHaveBeenCalled();

        expect(Attendee.destroy).toHaveBeenCalledWith({ where: { EventID: eventID }, transaction: expect.anything() });
        expect(EventStaff.destroy).toHaveBeenCalledWith({ where: { EventID: eventID }, transaction: expect.anything() });
        expect(EventGroup.destroy).toHaveBeenCalledWith({ where: { EventID: eventID }, transaction: expect.anything() });
        expect(Invitation.destroy).toHaveBeenCalledWith({ where: { EventID: eventID }, transaction: expect.anything() });

        expect(mockEvent.destroy).toHaveBeenCalledWith({ transaction: expect.anything() });

        expect(result).toBe(true);
    });

    //Test 2: Error if something goes wrong
    test('Should throw error if event is not found', async () => {

        Event.findByPk.mockResolvedValue(null);

        await expect(eventController.deleteEvent(eventID)).rejects.toThrow('Failed to delete event');

        expect(sequelize.transaction).not.toHaveBeenCalled();
        expect(Attendee.destroy).not.toHaveBeenCalled();
        expect(EventStaff.destroy).not.toHaveBeenCalled();
        expect(EventGroup.destroy).not.toHaveBeenCalled();
        expect(Invitation.destroy).not.toHaveBeenCalled();
    });
});
