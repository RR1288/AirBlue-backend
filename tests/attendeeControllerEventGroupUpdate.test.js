//attendeeControllerEventGroupUpdate.test.js

//Constatns
const { Attendee } = require("../models");
const attendeeController = require("../controllers/attendeeController");

//Mocks
jest.mock("../models"); 

//Testing time
describe('attendeeController.updateAttendeeEventGroup', () => {
  let attendee;

  beforeEach(() => {
    Attendee.findByPk.mockReset();
    Attendee.prototype.save.mockReset();
  });

  //Test 1: Update attendeeEventGroupId successfully
  test('Should update the attendee event group successfully', async () => {
    const mockAttendeeData = {
      AttendeeID: 1,
      UserID: 1,
      EventID: 100,
      EventGroupID: 1, 
      Confirmed: true,
      save: jest.fn().mockResolvedValue(true),
    };

    Attendee.findByPk.mockResolvedValue(mockAttendeeData);

    const attendeeId = 1;
    const eventGroupId = 2;  

    const result = await attendeeController.updateAttendeeEventGroup(attendeeId, eventGroupId);

    expect(Attendee.findByPk).toHaveBeenCalledWith(attendeeId);
    expect(result.EventGroupID).toBe(eventGroupId);
    expect(result.save).toHaveBeenCalled();  
  });


  //Test 2: General error testing
  test('Should throw an error if there is a problem saving the attendee', async () => {
    const mockAttendeeData = {
      AttendeeID: 1,
      UserID: 1,
      EventID: 100,
      EventGroupID: 1, 
      Confirmed: true,
      save: jest.fn().mockRejectedValue(new Error("Database error")),
    };

    Attendee.findByPk.mockResolvedValue(mockAttendeeData);

    const attendeeId = 1;
    const eventGroupId = 2;  

    await expect(attendeeController.updateAttendeeEventGroup(attendeeId, eventGroupId))
      .rejects
      .toThrow("Failed to update attendee's event group");

    expect(mockAttendeeData.save).toHaveBeenCalled();
  });
});
