//organizationControllerUpdate.test.js

//Constatns
const organizationController = require('../controllers/organizationControllor'); 
const { UserOrganization, Organization } = require('../models'); 

//Mock
jest.mock('../models');

//Testing time
describe('updateOrganization Controller', () => {

    let mockUserId;
    let mockUpdates;
    let mockOrganization;
    let mockUserOrganization;

    beforeEach(() => {
        mockUserId = 1; // Example userId
        mockUpdates = { OrganizationName: 'Updated Org Name', Description: 'Updated Description' };

        // Mocking the UserOrganization model to simulate an active user belonging to an organization
        mockUserOrganization = {
            UserID: mockUserId,
            OrganizationID: 123, // Example organizationId
            StillActive: true
        };

        // Mocking the Organization model to simulate a found organization
        mockOrganization = {
            OrganizationID: 123,
            OrganizationName: 'Test Org',
            Description: 'Test Description',
            update: jest.fn().mockResolvedValue(true) // Mock the update method to resolve as true
        };

        // Reset mock calls before each test
        UserOrganization.findOne.mockReset();
        Organization.findByPk.mockReset();
    });

    //Test 1: Update organnization successfully
    it('Should successfully update the organization if user is associated with an active organization', async () => {
        
        UserOrganization.findOne.mockResolvedValue(mockUserOrganization);
        Organization.findByPk.mockResolvedValue(mockOrganization);

        const updatedOrg = await organizationController.updateOrganization(mockUserId, mockUpdates);

        expect(Organization.findByPk).toHaveBeenCalledWith(mockUserOrganization.OrganizationID);
        expect(mockOrganization.update).toHaveBeenCalledWith(mockUpdates);
        expect(updatedOrg).toEqual(mockOrganization);
    });

    //Test 2: General error catching
    it('Should throw an error if the update fails', async () => {
    
        UserOrganization.findOne.mockResolvedValue(mockUserOrganization);
        Organization.findByPk.mockResolvedValue(mockOrganization);
        mockOrganization.update.mockRejectedValue(new Error('Database error'));

        await expect(organizationController.updateOrganization(mockUserId, mockUpdates))
            .rejects
            .toThrowError('Failed to update organization');
    });

});
