const { Sequelize, Attendee, Itinerary, Invititation, User } = require('../models');

//simple call to get all attendees for a specific event. This will also include their status from itinerary if they are pending approval
exports.getAttendees = async (eventID) => {
    try {
        let attendees = await Attendee.findAll({
            attributes: [
                ['UserID', 'userID'],
            ],
            includes: [
                {
                    model: User,
                    attributes: [
                        ['Email', 'email'],
                        ['FName', 'firstName'],
                        ['LName', 'lastName']
                    ],
                    required: true
                },
                {
                    model: Itinerary,
                    attributes: [['ApprovalStatus', 'status'], ['TotalCost', 'cost']],
                    required: true,
                    where: { ApprovalStatus: 'pending' }//could be a sticking point keep in mind for manual test
                }

            ],
            where: { EventID: eventID }
        });
        let results = [];
        //making it so that I am only returning the information that I want
        for (let i = 0; i < attendees.length; i++) {
            let combinedName = attendees[i].dataValues.User.firstName + attendees[i].dataValues.User.lastName;
            results.push(
                {
                    'Name': combinedName,
                    'email': attendees[i].dataValues.User.email,
                    'status': attendees[i].dataValues.Itinerary.status,
                    'bookingCost': attendees[i].dataValues.Itinerary.cost
                });
        }
        return results;
    } catch (error) {
        throw new Error('failed to get attendees for event');
    }
};