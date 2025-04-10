//organizationControllerRoleUpdate

//Constatns
const { appendRoleUserOrganization } = require('../controllers/organizationControllor');
const { UserOrganization, sequelize } = require('../models');

// Mocks
jest.mock('../models', () => ({
    ...jest.requireActual('../models'),
    UserOrganization: {
        findOne: jest.fn(),
        save: jest.fn(),
    },
    sequelize: {
        transaction: jest.fn(),
    }
}));

//Testing time
describe('appendRoleUserOrganization', () => {
    let userId;
    let role;
    let userOrganization;

    beforeEach(() => {
        userId = 1;
        role = 'B'; 
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    //Test 1: Return true when success
    it('Should successfully append the role to the user', async () => {
      
        userOrganization = {
            UserID: userId,
            Roles: 'A',
            StillActive: true,
            save: jest.fn(),
        };

        UserOrganization.findOne.mockResolvedValue(userOrganization);
        sequelize.transaction.mockImplementation((callback) => {
            const transaction = {}; 
            return callback({ transaction });
        });

        const result = await appendRoleUserOrganization(userId, role);

        expect(UserOrganization.findOne).toHaveBeenCalledWith({
            where: { UserID: userId, StillActive: true },
            transaction: expect.any(Object),  
        });
        expect(userOrganization.Roles).toBe('AB'); 
        expect(userOrganization.save).toHaveBeenCalled();
        expect(result).toEqual(true);
    });

    //Test 2: Error if not associated
    it('Should throw an error if the user is not associated with an active organization', async () => {
      
        UserOrganization.findOne.mockResolvedValue(null); // No active user organization

        await expect(appendRoleUserOrganization(userId, role))
            .rejects
            .toThrow('Failed to append role to user organization');
    });

    //Test 3: Error if user has role
    it('Should throw an error if the user already has the role', async () => {

        userOrganization = {
            UserID: userId,
            Roles: 'AB', 
            StillActive: true,
            save: jest.fn(),
        };

        UserOrganization.findOne.mockResolvedValue(userOrganization);
        sequelize.transaction.mockImplementation((cb) => cb()); 

        await expect(appendRoleUserOrganization(userId, 'B'))
            .rejects
            .toThrow('Failed to append role to user organization');
    });

    //Test 4: Handle transaction error
    it('Should handle transaction failures', async () => {
     
        userOrganization = {
            UserID: userId,
            Roles: 'A',
            StillActive: true,
            save: jest.fn(),
        };

        UserOrganization.findOne.mockResolvedValue(userOrganization);
        sequelize.transaction.mockImplementation((cb) => { throw new Error('Transaction failed'); });

        await expect(appendRoleUserOrganization(userId, role))
            .rejects
            .toThrow('Failed to append role to user organization');
    });

    //Test 5: Throw error if findOne fails
    it('Should throw an error if the findOne method fails', async () => {
        
        UserOrganization.findOne.mockRejectedValue(new Error('Database error'));

        await expect(appendRoleUserOrganization(userId, role))
            .rejects
            .toThrow('Failed to append role to user organization');
    });
});
