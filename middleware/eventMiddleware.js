const { sendError } = require('../utils/responseHelpers');
const jwt = require('jsonwebtoken');
const {getEventStaffByRole} = require("../controllers/eventController");

exports.InEventStaffFinance = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const eventID = req.body;
        if (!eventID) return sendError(res, "no event ID provided, failed to check eventStaff", 400);
        const staff = getEventStaffByRole(eventID, 'F');
        let isPresent = false;
        for(let i = 0; i < staff.length; i++){
            if(parseInt(staff[i].dataValues.UserID) === parseInt(decoded.ID)) { 
                isPresent = true;
                break;
            }
        }
        if (!isPresent) return sendError(res, "user is not present in EventStaff", 404);
        next();
    } catch (err) {
        console.error(err);
        return sendError(res, "EventStaff is not present", 401);
    }
};

exports.InEventStaffPlanner = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const eventID = req.body;
        if (!eventID) return sendError(res, "no event ID provided, failed to check eventStaff", 400);
        const staff = getEventStaffByRole(eventID, 'E');
        let isPresent = false;
        for(let i = 0; i < staff.length; i++){
            if(parseInt(staff[i].dataValues.UserID) === parseInt(decoded.ID)) { 
                isPresent = true;
                break;
            }
        }
        if (!isPresent) return sendError(res, "user is not present in EventStaff", 404);
        next();
    } catch (err) {
        console.error(err);
        return sendError(res, "EventStaff is not present", 401);
    }
};
