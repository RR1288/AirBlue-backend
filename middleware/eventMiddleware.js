const { sendError } = require('../utils/responseHelpers');
const jwt = require('jsonwebtoken');
const {EventStaff, Event, Sequelize} = require("../models");
const {getEventByID} = require("../controllers/eventController");


exports.InEventStaffFinance = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { eventID } = req.body;
        if (!eventID) return sendError(res, "no event ID provided, failed to check eventStaff", 400);
        const staff = await EventStaff.findAll({
            where: { EventID: eventID, RoleID: { [Sequelize.Op.like]: `%F%` } },
        });
        let isPresent = false;
        for(let i = 0; i < staff.length; i++){
            if(parseInt(staff[i].dataValues.UserID) === parseInt(decoded.id)) { 
                isPresent = true;
                break;
            }
        }
        if (!isPresent) return sendError(res, "user is not present in EventStaff", 404);
        return next();
    } catch (err) {
        console.error(err);
        return sendError(res, "EventStaff is not present", 401);
    }
};

exports.InEventStaffPlanner = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { eventID } = req.body;
        if (!eventID) return sendError(res, "no event ID provided, failed to check eventStaff", 400);
        const staff = await EventStaff.findAll({
            where: { EventID: eventID, RoleID: { [Sequelize.Op.like]: `%E%` } },
        });
        let isPresent = false;
        for(let i = 0; i < staff.length; i++){

            if(parseInt(staff[i].dataValues.UserID) === parseInt(decoded.id)) { 
                isPresent = true;
                break;
            }
        }
        if (!isPresent) return sendError(res, "user is not present in EventStaff", 404);
        next();
    } catch (err) {
        return sendError(res, "EventStaff is not present", 401);
    }
};

//makes sure that the users organization is the event organization
exports.checkEventOrganization = async (req, res, next) => {
    try {
        const {eventID} = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const event = await Event.findByPk(eventID);
        if (!event) return sendError(res, "event does not exist", 400);
        if(parseInt(event.OrganizationID) !== parseInt(decoded.OrganizationID)) return sendError(res, "user is not in organization", 400)

        return next();
    } catch (error) {
        return sendError(res, "failed check");
    }
};

exports.hasFinancePlanner = async (req, res, next) =>{
    try {
        const {user, eventID} = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const financeUsers =  await EventStaff.findAll({
            where: { EventID: eventID, RoleID: { [Sequelize.Op.like]: `%F%` } },
        });
        if (financeUsers.length != 0) return sendError(res, "there is already a finance user in this event");

        return next();
    } catch (error) {
        return sendError(res, "failed check");
    }
};

exports.hasBudget = async (req, res, next) => {
    try {
        const {eventID} = req.body;
        const event = await getEventByID(eventID);
        console.log(typeof(event.dataValues.EventFlightBudget));
        console.log(event.dataValues.EventFlightBudget);
        
        //make sure that there are value in the events budget
        if (!(event.dataValues.EventFlightBudget > 0) || !(event.dataValues.EventTotalBudget > 0)) return sendError(res, "no budget set for event", 400);
        return next();
    } catch (error) {
        console.log(error);
        return sendError(res, "failed budget check");
    }
};