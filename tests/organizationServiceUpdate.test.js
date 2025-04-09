//organizationServiceUpdate.test.js

//Constants
const { updateOrganization } = require('../services/organizationService');
const { sendSuccess, sendError } = require("../utils/responseHelpers");
const organizationControllor = require('../controllers/organizationControllor');
const { sanitizeOrganizationName, sanitizeOrganizationDescription } = require('../utils/OrganizationSanitization');

// Mocks
jest.mock('../controllers/organizationControllor');
jest.mock('../utils/responseHelpers');
jest.mock('../utils/OrganizationSanitization');

//Testing Time
describe('updateOrganization Service', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        // Setup the mock request and response objects
        mockRequest = {
            user: { id: 1 },  // Simulate the logged-in user
            body: { name: 'New Org Name', description: 'New Org Description' },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });

    //Test 1: Success for update
    it('should successfully update the organization', async () => {
       
        const mockUpdatedOrganization = {
            OrganizationName: 'New Org Name',
            Description: 'New Org Description',
        };
        organizationControllor.updateOrganization.mockResolvedValue(mockUpdatedOrganization);

        await updateOrganization(mockRequest, mockResponse);

        expect(sendSuccess).toHaveBeenCalledWith(mockResponse, 'Successfully updated organization', mockUpdatedOrganization);
    });

    //Test 2: Error on org name
    it('should return an error if the organization name is invalid', async () => {

        sanitizeOrganizationName.mockReturnValue(null);

        await updateOrganization(mockRequest, mockResponse);

        expect(sendError).toHaveBeenCalledWith(mockResponse, "Invalid organization name", 400);
    });

    //Test 3 Error on org description
    it('should return an error if the organization description is invalid', async () => {

        sanitizeOrganizationName.mockReturnValue(true);
        sanitizeOrganizationDescription.mockReturnValue(null);

        await updateOrganization(mockRequest, mockResponse);

        expect(sendError).toHaveBeenCalledWith(mockResponse, "Invalid description", 400);
    });

    //Test 4: Error on user
    it('Should return an error if the user is not found in any active organization', async () => {

        sanitizeOrganizationName.mockReturnValue(true);
        sanitizeOrganizationDescription.mockReturnValue(true);
        organizationControllor.updateOrganization.mockRejectedValue(new Error('User is not associated with any active organization'));

        await updateOrganization(mockRequest, mockResponse);

        expect(sendError).toHaveBeenCalledWith(mockResponse, 'Failed to update organization', 500);
    });

    //Test 5: General errors
    it('Should handle server errors correctly', async () => {

        organizationControllor.updateOrganization.mockRejectedValue(new Error('Some unexpected error'));

        await updateOrganization(mockRequest, mockResponse);

        expect(sendError).toHaveBeenCalledWith(mockResponse, 'Failed to update organization', 500);
    });
});
