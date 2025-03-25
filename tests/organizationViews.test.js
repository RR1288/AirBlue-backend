//organizationViews.test.js

//Constants
const organizationViews = require('../views/organizationViews');
const { UserOrganization, User, Organization } = require('../models');

//Mocks
jest.mock('../models');  // Mocking Sequelize models

//Testing time
describe('Organization Views', () => {

    //Tests for getOrganizationUsers function
    describe('getOrganizationUsers', () => {

        //Test 1: Return list of users and roles for an org
        it('Should return a list of users with their roles for an organization', async () => {
            
            const mockUsers = [
                {
                    User: {
                        dataValues: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
                    },
                    dataValues: { roles: 'Admin' }
                },
                {
                    User: {
                        dataValues: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
                    },
                    dataValues: { roles: 'Member' }
                }
            ];

            
            UserOrganization.findAll.mockResolvedValue(mockUsers);

            const result = await organizationViews.getOrganizationUsers(1);

            expect(result).toEqual([
                { Name: 'JohnDoe', email: 'john@example.com', roles: 'Admin' },
                { Name: 'JaneSmith', email: 'jane@example.com', roles: 'Member' }
            ]);
        });

        //Test 2: Handle empty list of users
        it('Should handle an empty list of users', async () => {
            UserOrganization.findAll.mockResolvedValue([]);
            
            const result = await organizationViews.getOrganizationUsers(1);

            expect(result).toEqual([]);  // Empty list of users
        });

        //Test 3: Throw error when needed
        it('Should throw an error if there is an issue retrieving organization users', async () => {
            UserOrganization.findAll.mockRejectedValue(new Error('Database error'));

            await expect(organizationViews.getOrganizationUsers(1)).rejects.toThrow('failed to get info');
        });
    });

    //Tests for getOrganizationInfo function
    describe('getOrganizationInfo', () => {

        //Test 4: Return org info 
        it('Should return organization information including owner details', async () => {
            
            const mockOrganization = {
                dataValues: {
                    name: 'Test Organization',
                    description: 'A test organization',
                },
                User: {
                    dataValues: {
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@example.com',
                    },
                },
            };
            
            Organization.findByPk.mockResolvedValue(mockOrganization);
            console.log('Mock Organization:', mockOrganization);

            const result = await organizationViews.getOrganizationInfo(1);
            console.log('Result from getOrganizationInfo:', result);


            expect(result).toEqual({
                Name: 'Test Organization',
                Description: 'A test organization',
                OwnerName: 'JohnDoe',
                OwnerEmail: 'john@example.com',
            });
        });

        //Test 5: Throw error if issue 
        it('Should throw an error if there is an issue retrieving organization info', async () => {
            Organization.findByPk.mockRejectedValue(new Error('Database error'));

            await expect(organizationViews.getOrganizationInfo(1)).rejects.toThrow('failed to get organization information');
        });
    });
});

