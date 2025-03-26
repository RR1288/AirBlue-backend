//generalViews.test.js

//Constatns
const { getUserInfo } = require('../views/generalViews');
const { User } = require('../models');

// Mocks
jest.mock('../models', () => ({
    User: {
        findByPk: jest.fn(),
    },
}));

//Testing time getUserInfo
describe('getUserInfo', () => {

    //Test 1: Return user info with valid userID
    it('Should return user information for a valid userID', async () => {
       
        const mockUser = {
            dataValues: {
                UsernameEmail: 'john@example.com',
                Firstname: 'John',
                Lastname: 'Doe',
                City: 'CityName',
                State: 'StateName',
                Country: 'CountryName',
                KTN: '1234567890',
            },
        };

        User.findByPk.mockResolvedValue(mockUser); 

        
        const result = await getUserInfo(1);

        expect(result).toEqual(mockUser);
        expect(User.findByPk).toHaveBeenCalledWith(1, {
            attributes: [
                ['UserName', 'Username/Email'],
                ['FName', 'Firstname'],
                ['LName', 'Lastname'],
                ['City', 'City'],
                ['State', 'State'],
                ['Country', 'Country'],
                ['KTN', 'KTN']
            ]
        });
         
    });

    //Test 2: Throe error if db error
    it('Should throw an error if there is an issue with the database query', async () => {
        
        User.findByPk.mockRejectedValue(new Error('Database error'));

        
        await expect(getUserInfo(1)).rejects.toThrow('could not get user information');
    });
});
