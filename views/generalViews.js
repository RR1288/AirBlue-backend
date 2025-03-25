const {User} = require('../models');

exports.getUserInfo = async (userID) => {
    try {
        let user = await User.findByPk(userID, {
            attributes: [
                ['UserName', 'Username/Email'],
                ['FName', 'Firstname'],
                ['LName', 'Lastname'],
                ['City', 'City'],
                ['State', 'State'],
                ['Country', 'Country'],
                ['KTN', 'KTN'], //consider removing this from this query later
            ],
        });

        return user;
    } catch (error) {
        throw new Error('could not get user information');
    }
}