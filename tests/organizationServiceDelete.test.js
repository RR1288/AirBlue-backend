// organizationService.test.js

//Constants
const { deleteOrganization } = require('../services/organizationService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const organizationControllor = require('../controllers/organizationControllor');

//Mocks
jest.mock('../utils/responseHelpers');
jest.mock('../controllers/organizationControllor');

//Testing time
describe('deleteOrganization', () => {
    let req, res;

    beforeEach(() => {
        req = { user: { id: 1 } };
        res = { send: jest.fn() };  
    });

    //Test 1: Deelte org successfully
    it('Should delete the organization successfully when controller returns true', async () => {
       
        organizationControllor.deleteOrganization.mockResolvedValue(true);

        await deleteOrganization(req, res);

        expect(sendSuccess).toHaveBeenCalledWith(res, 'Organization successfully deleted');
    });

    //Test 2: Handle fail from controller
    it('Should handle failure if controller returns false', async () => {
       
        organizationControllor.deleteOrganization.mockResolvedValue(false);

        await deleteOrganization(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'Failed to delete organization', 400);
    });

    //Test 3: handle general errors 
    it('Should handle errors thrown by the controller', async () => {
 
        organizationControllor.deleteOrganization.mockRejectedValue(new Error('Some error'));

        await deleteOrganization(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'Failed to delete organization', 500);
    });
});
