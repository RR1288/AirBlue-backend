//organnizationService.test.js

//Constants
const { createOrganization, getOrganizationUsers, getOrganizationInfo } = require('../services/organizationService');
const { sendSuccess, sendError } = require("../utils/responseHelpers");
const organizationControllor = require('../controllers/organizationControllor');
const { validateOrganizationID, sanitizeOrganizationName, sanitizeOrganizationDescription } = require('../utils/OrganizationSanitization');
const { validateUserID } = require('../utils/UserSanitizations');
const OrganizationViews = require('../views/organizationViews');

// Mocks
jest.mock('../utils/responseHelpers', () => ({
    sendSuccess: jest.fn(),
    sendError: jest.fn(),
}));

jest.mock('../controllers/organizationControllor', () => ({
    createOrganization: jest.fn(),
}));

jest.mock('../utils/OrganizationSanitization', () => ({
    validateOrganizationID: jest.fn(),
    sanitizeOrganizationName: jest.fn(),
    sanitizeOrganizationDescription: jest.fn(),
}));

jest.mock('../utils/UserSanitizations', () => ({
    validateUserID: jest.fn(),
}));

jest.mock('../views/organizationViews', () => ({
    getOrganizationUsers: jest.fn(),
    getOrganizationInfo: jest.fn(),
}));

//Testing time
describe('Organization Service', () => {

    beforeEach(() => {
        jest.clearAllMocks(); 
    });
      
    //Tests for createOrganiztion function
    describe('createOrganization', () => {

        //Test 1: Create organization successfully
        it('Should create an organization successfully', async () => {
            const req = { user: { id: 1 }, body: { name: 'Test Organization', description: 'Test description' } };
            const res = {};
            
            validateUserID.mockResolvedValue(true);
            sanitizeOrganizationName.mockReturnValue('Test Organization');
            sanitizeOrganizationDescription.mockReturnValue('Test description');
            organizationControllor.createOrganization.mockResolvedValue(true);
            
            await createOrganization(req, res);

            expect(sendSuccess).toHaveBeenCalledWith(res, 'successfully create organization');
            expect(sendError).not.toHaveBeenCalled();
        });

        //Test 2: Error if user validaitonn fails
        it('Should return an error if user validation fails', async () => {
            const req = { user: { id: 1 }, body: { name: 'Test Organization', description: 'Test description' } };
            const res = {};
            
            validateUserID.mockResolvedValue(false);  // Simulating validation failure
            

            await createOrganization(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'invalid user', 400);
            expect(sendSuccess).not.toHaveBeenCalled();
        });

        //Test 3: Error if name fails
        it('Should return an error if name sanitization fails', async () => {
            const req = { user: { id: 1 }, body: { name: null, description: 'Test description' } };
            const res = {};
            
            validateUserID.mockResolvedValue(true);
            sanitizeOrganizationName.mockReturnValue(null);  // Simulating sanitization failure

            await createOrganization(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'invalid name', 400);
            expect(sendSuccess).not.toHaveBeenCalled();
        });

        //Test 4: Error if description fails
        it('Should return an error if description sanitization fails', async () => {
            const req = { user: { id: 1 }, body: { name: 'Test Organization', description: null } };
            const res = {};
            
            validateUserID.mockResolvedValue(true);
            sanitizeOrganizationName.mockReturnValue(true); 
            sanitizeOrganizationDescription.mockReturnValue(null);  // Simulating sanitization failure

            await createOrganization(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'invalid description', 400);
            expect(sendSuccess).not.toHaveBeenCalled();
        });

        //Test 5: Error if creation fails
        it('Should return an error if organization creation fails', async () => {
            const req = { user: { id: 1 }, body: { name: 'Test Organization', description: 'Test description' } };
            const res = {};

            validateUserID.mockResolvedValue(true);
            sanitizeOrganizationName.mockReturnValue('Test Organization');
            sanitizeOrganizationDescription.mockReturnValue('Test description');
            organizationControllor.createOrganization.mockResolvedValue(false);  // Simulating failure

            await createOrganization(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'failed to create organization', 400);
            expect(sendSuccess).not.toHaveBeenCalled();
        });
    });

    //Tests for getOrgannizationnUsers
    describe('getOrganizationUsers', () => {

        //Test 6: Return users sucessfully
        it('Should return organization users successfully', async () => {
            const req = { user: { OrganizationID: '1' } };
            const res = {};
            
            validateOrganizationID.mockResolvedValue(true);
            OrganizationViews.getOrganizationUsers.mockResolvedValue(['user1', 'user2']);
            
            await getOrganizationUsers(req, res);

            expect(sendSuccess).toHaveBeenCalledWith(res, 'successfully retrieved organization users', ['user1', 'user2']);
            expect(sendError).not.toHaveBeenCalled();
        });

        //Test 7: Retrun error for orgID
        it('Should return an error if organization ID is invalid', async () => {
            const req = { user: { OrganizationID: '1' } };
            const res = {};
            
            validateOrganizationID.mockResolvedValue(false);  // Simulating invalid ID

            await getOrganizationUsers(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'invalid organizationId', 400);
            expect(sendSuccess).not.toHaveBeenCalled();
        });

        //Test 8: Error if org users fail
        it('Should return an error if getting organization users fails', async () => {
            const req = { user: { OrganizationID: '1' } };
            const res = {};

            validateOrganizationID.mockResolvedValue(true);
            OrganizationViews.getOrganizationUsers.mockResolvedValue(null);  // Simulating failure

            await getOrganizationUsers(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'failed to get organization Users', 400);
            expect(sendSuccess).not.toHaveBeenCalled();
        });
    });

    //Tests for getOrganizationInfo
    describe('getOrganizationInfo', () => {

        //Test 9: Return organnization sucessfully
        it('Should return organization info successfully', async () => {
            const req = { user: { OrganizationID: '1' } };
            const res = {};
            
            validateOrganizationID.mockResolvedValue(true);
            OrganizationViews.getOrganizationInfo.mockResolvedValue({ name: 'Test Organization', description: 'Test description' });
            
            await getOrganizationInfo(req, res);

            expect(sendSuccess).toHaveBeenCalledWith(res, 'successfully retrieved organization info', { name: 'Test Organization', description: 'Test description' });
            expect(sendError).not.toHaveBeenCalled();
        });

        //Test: Error if getting info fails
        it('Should return an error if getting organization info fails', async () => {
            const req = { user: { OrganizationID: '1' } };
            const res = {};

            validateOrganizationID.mockResolvedValue(true);
            OrganizationViews.getOrganizationInfo.mockResolvedValue(null);  // Simulating failure

            await getOrganizationInfo(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'failed to get organization info', 400);
            expect(sendSuccess).not.toHaveBeenCalled();
        });
    });
});
