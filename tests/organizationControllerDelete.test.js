//organizationControllerDelete.test.js

//Constants
const { deleteOrganization } = require('../controllers/organizationControllor');
const { UserOrganization, Organization, sequelize } = require('../models');

//Mocks
jest.mock('../models', () => {
    const mockUserOrganization = {
        findOne: jest.fn(),
        update: jest.fn(),
        associate: jest.fn(), 
    };

    const mockOrganization = {
        findByPk: jest.fn(),
        update: jest.fn(),
        associate: jest.fn(), 
    };

    const mockSequelize = {
        transaction: jest.fn().mockImplementation((cb) => cb({ commit: jest.fn(), rollback: jest.fn() })),
    };

    return {
        UserOrganization: mockUserOrganization,
        Organization: mockOrganization,
        sequelize: mockSequelize,
    };
});
jest.mock('sequelize'); 

//Testing time
describe('deleteOrganization', () => {

    let userId;
    let organization;
    let userOrg;

    beforeEach(() => {
        userId = 1;
        organization = {
            OrganizationID: 1,
            Owner: userId,
            IsActive: true,
            update: jest.fn(),
        };
        userOrg = {
            UserID: userId,
            OrganizationID: organization.OrganizationID,
            StillActive: true,
            save: jest.fn(),
        };


        UserOrganization.findOne = jest.fn().mockResolvedValue(userOrg);
        Organization.findByPk = jest.fn().mockResolvedValue(organization);
        UserOrganization.update = jest.fn().mockResolvedValue([1]);  
    });

    //Test 1: Successfully delete an org
    it('Should successfully delete an organization', async () => {
       
        organization.update.mockResolvedValue(true);
        UserOrganization.update.mockResolvedValue(true);

        const result = await deleteOrganization(userId);

        expect(result).toBe(true);
        expect(organization.update).toHaveBeenCalledWith({ IsActive: false }, { transaction: expect.anything() });
        expect(UserOrganization.update).toHaveBeenCalledWith(
            { StillActive: false },
            { where: { OrganizationID: organization.OrganizationID }, transaction: expect.anything() }
        );
    });

    //Test 2: Throw error is user isn't assocaited with org
    it('Should throw an error if the user is not associated with any active organization', async () => {
       
        UserOrganization.findOne.mockResolvedValue(null);

        await expect(deleteOrganization(userId)).rejects.toThrow('User is not associated with any active organization');
    });

    //Test 3: Error if org not found
    it('Should throw an error if the organization is not found', async () => {
 
        Organization.findByPk.mockResolvedValue(null);

        await expect(deleteOrganization(userId)).rejects.toThrow('Organization not found');
    });

    //Test 4: Error if user isn't org owner
    it('Should throw an error if the user is not the owner of the organization', async () => {
     
        organization.Owner = 2;

        await expect(deleteOrganization(userId)).rejects.toThrow('You are not authorized to delete this organization');
    });

    //Test 5: Error if transaction fails
    it('Should throw an error if the transaction fails', async () => {

        sequelize.transaction = jest.fn().mockImplementationOnce((cb) => cb({ commit: jest.fn(), rollback: jest.fn() }));

        UserOrganization.findOne.mockRejectedValue(new Error('Transaction error'));

        await expect(deleteOrganization(userId)).rejects.toThrow('Transaction error');
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });
});
