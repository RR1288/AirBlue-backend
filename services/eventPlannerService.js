const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { getAllEventPlanners } = require('../controllers/userController');


exports.getAllEventPlanners = async (req, res) => {
    try {
        const eventPlanners = await getAllEventPlanners();
        if (!eventPlanners || eventPlanners.length === 0) {
            return sendError(res, 'No event planners found', 404);
        }
        return sendSuccess(res, 'All event planners retrieved successfully', eventPlanners);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching event planners');
    }
};