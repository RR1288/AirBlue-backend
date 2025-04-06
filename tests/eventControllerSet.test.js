//eventControllerSet.test.js

//Constants
const { setEventBudget } = require('../controllers/eventController');  
const { Event, EventBudgetAuditLog, sequelize } = require('../models'); 

//mock
jest.mock('../models');  

//Testing time
describe('setEventBudget', () => {
  let event;
  let userID;
  let eventID;
  let totalBudget;
  let flightBudget;
  let thresholdVal;

  beforeEach(() => {
    userID = 1;
    eventID = 1;
    totalBudget = 10000;
    flightBudget = 5000;
    thresholdVal = 1000;

    // Mock event find by PK
    event = {
      EventID: eventID,
      EventTotalBudget: 5000,  
      EventFlightBudget: 2500,
      FlightBudgetThreshold: 500, 
      update: jest.fn(),
    };

    Event.findByPk.mockResolvedValue(event);
    EventBudgetAuditLog.create.mockResolvedValue(true);
    
    sequelize.transaction.mockImplementation((callback) => {
      return callback({
        commit: jest.fn(),
        rollback: jest.fn(),
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //Test 1: Update budget and make audit logs
  it('Should update the event budget and create audit logs', async () => {
    
    const result = await setEventBudget(eventID, userID, totalBudget, flightBudget, thresholdVal);

    expect(event.update).toHaveBeenCalledWith(
      {
        EventTotalBudget: totalBudget,
        EventFlightBudget: flightBudget,
        FlightBudgetThreshold: thresholdVal,
      },
      { transaction: expect.any(Object) }  
    );

    expect(EventBudgetAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        UserID: userID,
        EventID: eventID,
        ColumnName: 'EventTotalBudget',
        CurrentValue: totalBudget,
        PreviousValue: undefined,  //No previous value so undefined it is
      }),
      expect.objectContaining({
        transaction: {
          commit: expect.any(Function),
          rollback: expect.any(Function),
        },
      })
    );

    expect(EventBudgetAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        UserID: userID,
        EventID: eventID,
        ColumnName: 'EventFlightBudget',
        CurrentValue: flightBudget,
        PreviousValue: undefined,
      }),
      expect.objectContaining({
        transaction: {
          commit: expect.any(Function),
          rollback: expect.any(Function),
        },
      })
    );

    expect(EventBudgetAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        UserID: userID,
        EventID: eventID,
        ColumnName: 'FlightBudgetThreshold',
        CurrentValue: thresholdVal,
        PreviousValue: undefined, 
      }),
      expect.objectContaining({
        transaction: {
          commit: expect.any(Function),
          rollback: expect.any(Function),
        },
      })
    );

    expect(result).toBe(true);
  });

  //Test 2: Error if no event
  it('Should throw an error if the event does not exist', async () => {
   
    Event.findByPk.mockResolvedValue(null);

    await expect(setEventBudget(eventID, userID, totalBudget, flightBudget, thresholdVal)).rejects.toThrow(
      'failed to add budget'  
    );
  });

  //Test 3: Error during tansaction or rollback
  it('Should handle errors during transaction and rollback', async () => {
    
    event.update.mockRejectedValue(new Error('Update failed'));

    await expect(setEventBudget(eventID, userID, totalBudget, flightBudget, thresholdVal)).rejects.toThrow(
      'failed to add budget' 
    );
  });

  //Test 4: Error handling in log creation
  it('Should handle errors during audit log creation', async () => {

    EventBudgetAuditLog.create.mockRejectedValue(new Error('Audit log creation failed'));

    await expect(setEventBudget(eventID, userID, totalBudget, flightBudget, thresholdVal)).rejects.toThrow(
      'failed to add budget' 
    );
  });
});
