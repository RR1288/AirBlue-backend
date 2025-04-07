const { User, Organization, Event, EventGroup, EventStaff, Attendee, EventTypes, OrganizationEventType, DefaultEventType, sequelize, Sequelize, Invitation, EventBudgetAuditLog } = require("../models");
const { Op } = require("sequelize");

/*
CREATE EVENT
this function
*/
exports.createEvent = async (userId, name, startDate, endDate, description, typeID, organizationID, location, maxAttendees) => {
    try {
        let event;
        await sequelize.transaction(async () => {
            //create the event
            event = await Event.create({
                EventName: name,
                EventStartDate: startDate,
                EventEndDate: endDate,
                EventDescription: description,
                TypeID: typeID,
                OrganizationID: organizationID,
                Location: location,
                MaxAttendees: maxAttendees
            });
            //add the creating user to the event staff as an eventplanner
            await this.addToEventStaff(userId, event.EventID, 'E');
        });
        //returns the event Id on success
        return event.EventID;
    } catch (error) {
        console.log(error);
        throw new Error("Event creation failed");
    }
}

exports.createEventGroup = async (eventID, name, budget) => {
    try {
        const eventGroup = await EventGroup.create({
            Name: name,
            EventID: eventID,
            FlightBudget: budget
        });
        return
    } catch (error) {
        throw new Error("failed to make event group");
    }
};

exports.getEventGroup = async (eventId, groupId) => {
    return await EventGroup.findOne({where: {EventID: eventId, EventGroupID: groupId}});
}

//gets eventByID
exports.getEventByID = async (eventID) => {
    return await Event.findByPk(eventID);
}


/*
get event Types:
returns a list of event types that the user can assign to an event
*/
exports.getEventTypes = async (organizationID) => {
    try {
        let typeList = [];
        await sequelize.transaction(async () => {
            //get a list of all default eventTypes
            let defaultEventTypes = await DefaultEventType.findAll({
                attributes: ['TypeID', 'Name'],
            });
            // get a list of all organization eventTypes that belong to the current organization and append it to the prior list
            let organizationEventTypes = await OrganizationEventType.findAll({
                attributes: ['TypeID', 'Name'],
                where: { OrganizationID: organizationID },
            });
            //combine the results of each query into one list
            for (let i = 0; i < defaultEventTypes.length; i++) {
                typeList.push({ TypeID: defaultEventTypes[i].dataValues.TypeID, Name: defaultEventTypes[i].dataValues.Name });
            }
            for (let i = 0; i < organizationEventTypes.length; i++) {
                typeList.push({ TypeID: organizationEventTypes[i].dataValues.TypeID, Name: organizationEventTypes[i].dataValues.Name });
            }
        });
        //return the list generated
        return typeList;
    } catch (error) {
        console.log(error);
    }
}

exports.getAttendees = async (eventId) => {
    try {
        return await Attendee.findAll({
            where: { EventID: eventId },
            include: [
                { model: User, attributes: ["UserID", "FName", "LName", "Email"] },
                { model: Event, attributes: ["EventID", "EventName"] },
            ],
        });
    } catch (error) {
        throw new Error('failed to run query')
    }
};

/**
 * Get event staff based on event ID and role.
 * The role to filter by ('E' for Event Planner, 'F' for Finance).
 */
exports.getEventStaffByRole = async (eventId, role) => {
    try {
        return await EventStaff.findAll({
            where: { EventID: eventId, RoleID: { [Sequelize.Op.like]: `%${role}%` } },
            include: [
                { model: User, attributes: ["UserID", "FName", "LName", "Email"] },
                { model: Event, attributes: ["EventID", "EventName"] },
            ],
        });
    } catch (error) {
        throw new Error('failed to run query')
    }
};

exports.processInvitationAcceptance = async (invitationToken) => {
    try {
        // Find the invitation using the token
        const invitation = await Invitation.findOne({
            where: {
                token: invitationToken,
                status: "pending",
                expiresAt: { [Op.gt]: new Date() }, // Ensure it's not expired
            },
        });

        if (!invitation) {
            console.error("Invitation not found");
            throw new Error("Invitation not found");
        }

        // Find the user
        let user = await User.findByPk(invitation.UserID);

        if (!user) {
            console.error("User not found");
            throw new Error("User not found"); // User should have created an account before accepting
        }

        // Check if user is already an attendee
        const existingAttendee = await Attendee.findOne({
            where: { EventID: invitation.EventID, UserID: user.UserID, EventGroupID: invitation.EventGroupID },
        });

        if (existingAttendee) {
            console.error("User is already an attendee");
            return true; // User is already an attendee
        }

        // Add user to Attendees table
        await Attendee.create({
            EventID: invitation.EventID,
            UserID: user.UserID,
            Confirmed: true,
            EventGroupID: invitation.EventGroupID,
        });

        // Mark invitation as accepted
        await invitation.update({ status: "accepted" });
        return true;

    } catch (error) {
        throw new Error("Error processing invitation");
    }
};
exports.getEventStaff = async (userID, eventID) => {
    try {
        return await EventStaff.findAll({ where: { EventID: eventID, UserID: userID } });
    } catch (error) {
        console.error("Error processing invitation acceptance:", error);
        throw new Error("failed to find entry in event staff");
    }
};
exports.getEventByOrganization = async (organizationId) => {
    try {
        return await Event.findAll({ where: { OrganizationID: organizationId } });
    } catch (error) {
        throw new Error('failed to run query')
    }
}

exports.setEventBudget = async (eventID, userID, totalBudget, flightBudget, thresholdVal) => {
    try {
        await sequelize.transaction(async (t) => {
        let event = await Event.findByPk(eventID, {transaction: t});
        //getting initial values
        let OriginalTotalBudget = Event.EventTotalBudget;
        let OriginalEventFlightBudget = Event.EventTotalBudget;
        let OriginalFlightBudgetThreshold = Event.EventTotalBudget;
        if (!event) {
            throw new Error("event does not exist");
        }

        await event.update({
            EventTotalBudget: totalBudget,
            EventFlightBudget: flightBudget, 
            FlightBudgetThreshold: thresholdVal
        },
        {transaction: t}
        );

        //creating audit logs
        //TODO: work this section into a trigger function
        //adding audit log for Total budget
        await EventBudgetAuditLog.create({
            UserID: userID,
            EventID: eventID,
            ColumnName: 'EventTotalBudget',
            CurrentValue: totalBudget,
            PreviousValue: OriginalTotalBudget
        },
        {transaction: t}
        );
        //adding audit log for flight budget
        await EventBudgetAuditLog.create({
            UserID: userID,
            EventID: eventID,
            ColumnName: 'EventFlightBudget',
            CurrentValue: flightBudget,
            PreviousValue: OriginalEventFlightBudget
        },
        {transaction: t}
        );
        //adding audit log for threshold
        await EventBudgetAuditLog.create({
            UserID: userID,
            EventID: eventID,
            ColumnName: 'FlightBudgetThreshold',
            CurrentValue: thresholdVal,
            PreviousValue: OriginalFlightBudgetThreshold,
        },
        {transaction: t}
        );
        });
        return true;
    } catch (error) {
        console.log(error);
        throw new Error("failed to add budget");
    }

};

exports.appendRoleToEventStaff = async (userID, eventID, role) => {
    try {
        //get the users entry for event staff
        let staff = await EventStaff.findOne({
            where: { EventID: eventID, UserID: userID },
        });
        //create a new value for the roleID in event staff
        let newRole = staff.RoleID + role;
        //update event staff with the new value for RoleID
        await staff.update({ RoleID: newRole });
        //return true on success
        return true;
    } catch (error) {
        console.log(error);
        throw new Error("failed to append role to eventstaff entry for user");
    }
};

exports.addToEventStaff = async (userID, eventID, role) => {
    try {
        const eventStaff = await EventStaff.create({
            UserID: userID,
            EventID: eventID,
            RoleID: role
        });
        return true;
    } catch (error) {
        throw new Error("failed to add user to event staff");
    }

};

exports.updateEvent = async (eventID, updates) => {
    try {
        // Find the event to update
        const event = await Event.findByPk(eventID);
        if (!event) {
            throw new Error("Event not found");
        }

        // Update the event with the provided attributes
        await event.update(updates);

        return event; // Return the updated event
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update event");
    }
};

exports.updateEventGroup = async (eventGroupID, updates) => {
    try {
        // Find the event group to update
        const eventGroup = await EventGroup.findByPk(eventGroupID);
        if (!eventGroup) {
            throw new Error("Event Group not found");
        }

        // Update the event group with the provided attributes
        await eventGroup.update(updates);

        return eventGroup; // Return the updated event group
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update event group");
    }
};

exports.deleteEvent = async (eventID) => {
    try {
        // Check if the event exists
        const event = await Event.findByPk(eventID);
        if (!event) {
            throw new Error("Event not found");
        }

        // Use a transaction to ensure that all related deletions happen atomically
        await sequelize.transaction(async (t) => {
            // Delete related attendees
            await Attendee.destroy({
                where: { EventID: eventID },
                transaction: t
            });

            // Delete related event staff
            await EventStaff.destroy({
                where: { EventID: eventID },
                transaction: t
            });

            // Delete related event groups
            await EventGroup.destroy({
                where: { EventID: eventID },
                transaction: t
            });

            // Delete related invitations
            await Invitation.destroy({
                where: { EventID: eventID },
                transaction: t
            });

            // Finally, delete the event
            await event.destroy({ transaction: t });
        });

        return true; // Return true if deletion was successful
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete event");
    }
};
