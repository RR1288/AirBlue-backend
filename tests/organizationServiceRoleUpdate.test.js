//organizationServiceRoleUpdate.test.js

//Constatns
const { addRoleUserOrganization } = require('../services/organizationService');
const organizationControllor = require('../controllers/organizationControllor');
const { sendError, sendSuccess } = require('../utils/responseHelpers');
const { validateUserID } = require('../utils/UserSanitizations');

// Mocks
jest.mock('../controllers/organizationControllor');
jest.mock('../utils/responseHelpers');
jest.mock('../utils/UserSanitizations');

//Testing Time
describe('addRoleUserOrganization', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                userId: 1,
                role: 'A'
            },
            user: {
                id: 1, 
                OrganizationID: 123
            }
        };

        
        jest.clearAllMocks();
    });

    //Test 1: Error if userId is invalis
    it('Should return error if userId is invalid', async () => {

        validateUserID.mockResolvedValue(false);

        await addRoleUserOrganization(req, { sendError });

        expect(sendError).toHaveBeenCalledWith(expect.anything(), 'Invalid userId', 400);
    });

    //Test 2: Error if role is invalid
    it('Should return error if role is invalid', async () => {

        validateUserID.mockResolvedValue(true);
        req.body.role = 'Z';

        await addRoleUserOrganization(req, { sendError });

        expect(sendError).toHaveBeenCalledWith(expect.anything(), 'Invalid role. Allowed roles are A, F, or E', 400);
    });

    //Test 3: Success if all works out
    it('Should return success if userId and role are valid', async () => {
    
        validateUserID.mockResolvedValue(true);

        organizationControllor.appendRoleUserOrganization.mockResolvedValue(true);

        await addRoleUserOrganization(req, { sendSuccess });

        expect(sendSuccess).toHaveBeenCalledWith(expect.anything(), 'Successfully added role to user organization');
    });

    //Test 4: Error if role adding fails
    it('Should return error if organizationControllor fails to add role', async () => {

        validateUserID.mockResolvedValue(true);

        organizationControllor.appendRoleUserOrganization.mockResolvedValue(false);

        await addRoleUserOrganization(req, { sendError });

        expect(sendError).toHaveBeenCalledWith(expect.anything(), 'Failed to append role to user organization', 400);
    });

    //Test 5: General error handling
    it('Should handle unexpected errors gracefully', async () => {
  
        validateUserID.mockRejectedValue(new Error('Something went wrong'));

        await addRoleUserOrganization(req, { sendError });

        expect(sendError).toHaveBeenCalledWith(expect.anything(), 'Failed to add role to user organization', 500);
    });
});
