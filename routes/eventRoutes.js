const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const { Roles } = require('../utils/Roles.js');
const { authorizedRoles, checkUserAuthorizedRoles} = require("../middleware/roleMiddleware.js");
const { checkOrganizationUser, checkUserInOrganization} = require("../middleware/organizationMiddleware.js");
const {  createEvent, getAvailableEventTypes, } = require("../services/eventService.js");
const EventService = require("../services/eventService");
const EventPlannerService = require("../services/eventPlannerService.js");
const { setEventBudget, getAllEventsFinance, getEventBudgetLogs, getEventBudgetReport} = require("../services/financeService.js");
const { InEventStaffFinance,  InEventStaffPlanner, checkEventOrganization , hasFinancePlanner, hasBudget} = require("../middleware/eventMiddleware.js");

/**
 * @swagger
 * /events/create-event:
 *   post:
 *     summary: create a new event for your organization
 *     description: endpoint to create new event in your organization
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *               - endDate
 *               - typeID
 *               - location
 *               - maxAttendees
 *             properties:
 *               name:
 *                 type: string
 *                 example: board of directors meeting
 *               startDate:
 *                 type: string
 *                 example: 2025-05-23
 *               endDate:
 *                 type: string
 *                 example: 2025-05-26
 *               typeID:
 *                 type: integer
 *                 example: 2
 *               description:
 *                 type: string
 *                 example: meeting to discuss current finances with the board of directors
 *               location:
 *                 type: string
 *                 example: Rochester, NY
 *               maxAttendees:
 *                 type: integer
 *                 example: 200
 * 
 *               
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post('/create-event', protect, authorizedRoles(Roles.PLANNER), checkOrganizationUser,  createEvent);


/**
 * @swagger
 * /events/set-budget:
 *   post:
 *     summary: updates the event budget
 *     description: endpoint to update the event budget
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventID
 *               - totalBudget
 *               - flightBudget
 *             properties:
 *               eventID:
 *                 type: integer
 *                 example: 1
 *               totalBudget:
 *                 type: number
 *                 example: 400000.12
 *               flightBudget:
 *                 type: number
 *                 example: 50000.99
 *               thresholdVal:
 *                 type: number
 *                 example: 0.10
 *               
 *     responses:
 *       200:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post("/set-budget", protect, authorizedRoles(Roles.FINANCE), InEventStaffFinance, checkOrganizationUser, setEventBudget);

/**
 * @swagger
 * /events/join-eventstaff-finance:
 *   post:
 *     summary: updates the event budget
 *     description: endpoint to update the event budget
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventID
 *             properties:
 *               eventID:
 *                 type: integer
 *                 example: 1
 *               
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post("/join-eventstaff-finance", protect, authorizedRoles(Roles.FINANCE), checkOrganizationUser, checkEventOrganization , hasFinancePlanner, EventService.joinEventFinance);

/**
 * @swagger
 * /events/add-eventstaff-finance:
 *   post:
 *     summary: adds a user as an event staff finance user
 *     description: endpoint to add a user as an event staff finance user
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventID
 *               - userID
 *             properties:
 *               eventID:
 *                 type: integer
 *                 example: 1
 *               userID:
 *                 type: integer
 *                 example: 1
 *               
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post("/add-eventstaff-finance", protect, authorizedRoles(Roles.FINANCE), checkOrganizationUser, checkUserInOrganization, InEventStaffFinance, checkEventOrganization, checkUserAuthorizedRoles(Roles.FINANCE), EventService.addEventFinance);

/**
 * @swagger
 * /events/add-eventstaff-planner:
 *   post:
 *     summary: allows eventstaff users in an events staff table to add new event planners
 *     description: endpoint that allows eventstaff users in an events staff table to add new event planners
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventID
 *               - userID
 *             properties:
 *               eventID:
 *                 type: integer
 *                 example: 1
 *               userID:
 *                 type: integer
 *                 example: 1
 *               
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post("/add-eventstaff-planner", protect, authorizedRoles(Roles.FINANCE), checkOrganizationUser, checkUserInOrganization, InEventStaffPlanner, checkEventOrganization, checkUserAuthorizedRoles(Roles.PLANNER), EventService.addEventPlanner);

/**
 * @swagger
 * /events/create-event-group:
 *   post:
 *     summary: function for event planners users to create eventGroups to assign to attendees
 *     description: endpoint that allows event planners to create eventGroups to assign to attendees
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventID
 *               - name
 *               - budget
 *             properties:
 *               eventID:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: standard
 *               budget:
 *                 type: number
 *                 example: 200.45
 *    
 *               
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post("/create-event-group", protect,authorizedRoles(Roles.PLANNER), checkOrganizationUser, InEventStaffPlanner, checkEventOrganization, hasBudget, EventService.createEventGroup);
//get methods

/**
 * @swagger
 * /events/event-types:
 *   get:
 *     summary: Retrieve a list of event types avaiable to you
 *     description: Fetch all event planners from the database.
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Successfully retrieved event types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       404:
 *         description: No event planners found
 *       500:
 *         description: Internal server error
 */
router.get("/event-types", protect, authorizedRoles(Roles.PLANNER), checkOrganizationUser, getAvailableEventTypes);

/**
 * @swagger
 * /events/event-planners/{eventId}:
 *   get:
 *     summary: Get event planners for a given event.
 *     description: Retrieve a list of event planners (Role 'E') for the specified event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event planners fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event planners fetched successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "usr_001"
 *                       name:
 *                         type: string
 *                         example: "Alice Johnson"
 *                       email:
 *                         type: string
 *                         example: "alice@example.com"
 *                       event:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "evt_001"
 *                           title:
 *                             type: string
 *                             example: "Annual Conference 2025"
 *       400:
 *         description: Bad request – Event ID is required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/event-planners/:eventId",
    protect,
    authorizedRoles(Roles.ADMIN),
    EventService.getEventPlanners
);

/**
 * @swagger
 * /events/finance-users/{eventId}:
 *   get:
 *     summary: Get finance users for a given event.
 *     description: Retrieve a list of finance users (Role 'F') for the specified event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: events have been successfully collected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Finance users fetched successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "usr_002"
 *                       name:
 *                         type: string
 *                         example: "Bob Smith"
 *                       email:
 *                         type: string
 *                         example: "bob@example.com"
 *                       event:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "evt_001"
 *                           title:
 *                             type: string
 *                             example: "Annual Conference 2025"
 *       400:
 *         description: Bad request – Event ID is required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/finance-users/:eventId",
    protect,
    authorizedRoles(Roles.ADMIN),
    EventService.getFinanceUsers
);

/**
 * @swagger
 * /events/getAllEventsFinanceView:
 *   get:
 *     summary: gets all events a finance user is in or can join
 *     description: uses the users organizationID from token and userID to query the event and eventstaff table for all events where they are either in the event or can join the event
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: a list of events from a given organization that a finance user is either assigned to or can join
 * 
 *       400:
 *         description: userID or organizationID are invalid.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/getAllEventsFinanceView",
    protect,
    authorizedRoles(Roles.FINANCE),
    getAllEventsFinance
);


/**
 * @swagger
 * /events/getAllEventsPlannerView:
 *   get:
 *     summary: gets all events an event planner user is in
 *     description: uses the users organizationID from token and userID to query the event and eventstaff table for all events where they are either in the event
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: a list of events from a given organization that an event planner user is either assigned to
 * 
 *       400:
 *         description: userID or organizationID are invalid.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/getAllEventsPlannerView",
    protect,
    authorizedRoles(Roles.PLANNER),
    EventPlannerService.getAllEventsPlanner
);

/**
 * @swagger
 * /events/getAllAttendees:
 *   get:
 *     summary: Get all Attendees in an event.
 *     description: takes an eventId and returns a list of all attendees in the event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendees have been successfully returned
 *       400:
 *         description: Bad request – Event ID is required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/getAllAttendees",
    protect,
    authorizedRoles(Roles.PLANNER),
    EventPlannerService.getAttendees
);

/**
 * @swagger
 * /events/getAllAttendeesForApproval:
 *   get:
 *     summary: Get all Attendees in an event that are pending approval on flights.
 *     description: takes the requesters ID and queries an event for all attendees with Itineraries that have a value of 'pending'.
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Attendees up for approval have been successfully returned
 *       400:
 *         description: Bad request – Event ID is required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/getAllAttendeesForApproval",
    protect,
    authorizedRoles(Roles.PLANNER),
    EventPlannerService.getAttendeesForApproval
);


/**
 * @swagger
 * /events/getAllInvitees:
 *   get:
 *     summary: gets all events invitees for an event that an event planner is in
 *     description: uses a passed in event ID to get a list of all invited individuals
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: integer 
 *     responses:
 *       200:
 *         description: a list of Invitees in your event
 * 
 *       400:
 *         description: userID, eventID, or organizationID are invalid.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/getAllInvitees",
    protect,
    authorizedRoles(Roles.PLANNER),
    EventPlannerService.getInvitees
);

/**
 * @swagger
 * /events/financeAuditLogs/{eventID}:
 *   get:
 *     summary: get all of the audit logs to track changes made to event budget
 *     description: |
 *       Returns a list of all the 
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventID
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: a list of changes made to the event budget.
 *       400:
 *         description: Bad request – missing event ID.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/financeAuditLogs/:eventID",
    protect,
    authorizedRoles(Roles.FINANCE),
    getEventBudgetLogs
);
/**
 * @swagger
 * /events/invitations/accept:
 *   post:
 *     summary: Accept an event invitation
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: invitation
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation Token received in the invitation link
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       400:
 *         description: Invalid or expired invitation token
 *       500:
 *         description: Internal server error
 */
router.post("/invitations/accept", protect, EventService.acceptInvitation);

//REPORTS:
/**
 * @swagger
 * /events/EventReportPlanner/{eventID}:
 *   get:
 *     summary: Gets a report made up of the total event budget, amount spent, total attendees, and approved attendees
 *     description: Gets a report made up of the total event budget, amount spent, total attendees, and approved attendees
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventID
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: report has successfully been returned
 *       400:
 *         description: Bad request – Event ID is required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/EventReportPlanner/:eventID",
    protect,
    authorizedRoles(Roles.PLANNER),
    EventPlannerService.getEventReportPlanner
);

/**
 * @swagger
 * /events/EventReportFinance/{eventID}:
 *   get:
 *     summary: Get detailed financial info for an event
 *     description: returns a list where the first index is the amount spent, and the second index is the event and all of the realted finance records of flights
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventID
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: report has successfully been returned
 *       400:
 *         description: Bad request – Event ID is required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/EventReportFinance/:eventID",
    protect,
    authorizedRoles(Roles.FINANCE),
    getEventBudgetReport
);


/**
 * @swagger
 * /events/update-event:
 *   patch:
 *     summary: Update an existing event
 *     description: Endpoint to update specific fields of an event based on the event ID.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventID:
 *                 type: integer
 *                 example: 1
 *               EventName:
 *                 type: string
 *                 example: "Updated Event Name"
 *               startDate:
 *                 type: string
 *                 example: "2025-05-23"
 *               endDate:
 *                 type: string
 *                 example: "2025-05-26"
 *               location:
 *                 type: string
 *                 example: "Rochester, NY"
 *               maxAttendees:
 *                 type: integer
 *                 example: 150
 *               description:
 *                 type: string
 *                 example: "Updated description for the event."
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       400:
 *         description: Invalid input or event ID.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal server error.
 */
router.patch("/update-event", 
  protect, 
  authorizedRoles(Roles.PLANNER), 
  checkOrganizationUser, 
  EventService.updateEvent);

/**
 * @swagger
 * /events/update-event-group:
 *   patch:
 *     summary: Update an existing event group
 *     description: Endpoint to update name and budget of an event group based on the event group ID.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventGroupID
 *             properties:
 *               eventGroupID:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Updated Event Group Name"
 *               budget:
 *                 type: number
 *                 format: float
 *                 example: 6000.50
 *     responses:
 *       200:
 *         description: Event group updated successfully.
 *       400:
 *         description: Invalid input or missing event group ID.
 *       404:
 *         description: Event group not found.
 *       500:
 *         description: Internal server error.
 */
router.patch("/update-event-group", 
  protect, 
  authorizedRoles(Roles.PLANNER), 
  EventService.updateEventGroup
);

/**
 * @swagger
 * /events/delete-event:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event along with its associated attendees, staff, groups, and invitations. Event ID is provided in the body.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       400:
 *         description: Bad request – Invalid event ID.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/delete-event", 
  protect, 
  authorizedRoles(Roles.PLANNER), 
  checkOrganizationUser, 
  EventService.deleteEvent);

module.exports = router;
