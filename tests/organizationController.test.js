//organizationController.test.js

//Constatnts
const { Organization, UserOrganization, sequelize } = require("../models");
const organizationController = require("../controllers/organizationControllor");

//Mock it up
jest.mock("../models", () => ({
  Organization: {
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  UserOrganization: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

//Testing time
describe("organizationController", () => {

  //Tests for createOrganization function
  describe("createOrganization", () => {

    //Test 1: Successfully create an org
    it("Should successfully create an organization and return true", async () => {
 
      const name = "Test Organization";
      const description = "Test Description";
      const ownerId = 1;

      const mockOrganization = { OrganizationID: 1 };
      const mockUserOrganization = {};

      Organization.create.mockResolvedValue(mockOrganization);
      UserOrganization.create.mockResolvedValue(mockUserOrganization);
      sequelize.transaction.mockImplementation((callback) => callback());

      const result = await organizationController.createOrganization(name, description, ownerId);

      // Assert
      expect(result).toBe(true);
      expect(Organization.create).toHaveBeenCalledWith(
        expect.objectContaining({
          OrganizationName: name,
          Description: description,
          Owner: ownerId,
          IsActive: true,
        }),
        expect.any(Object)
      );
      expect(UserOrganization.create).toHaveBeenCalledWith(
        expect.objectContaining({
          UserID: ownerId,
          OrganizationID: mockOrganization.OrganizationID,
          Roles: "A",
          StillActive: true,
        }),
        expect.any(Object)
      );
    });

    //Test 2: Error if org creation fails
    it("Should throw an error if the organization creation fails", async () => {
      
      const name = "Test Organization";
      const description = "Test Description";
      const ownerId = 1;

      Organization.create.mockResolvedValue(null); // Simulate organization creation failure

      
      await expect(
        organizationController.createOrganization(name, description, ownerId)
      ).rejects.toThrow("failed to create organization");
    });
  });

  //Tests for getOrgannization function
  describe("getOrganization", () => {

    //Test 3: Return org when found
    it("Should return an organization when found by primary key", async () => {
      
      const organizationID = 1;
      const mockOrganization = { OrganizationID: 1, OrganizationName: "Test Org" };

      Organization.findByPk.mockResolvedValue(mockOrganization);

      
      const result = await organizationController.getOrganization(organizationID);

      // Assert
      expect(result).toEqual(mockOrganization);
      expect(Organization.findByPk).toHaveBeenCalledWith(organizationID);
    });

    //Test 4: Retrun null if org isn't found
    it("Should return null if the organization is not found", async () => {
      
      const organizationID = 999; // Non-existing ID

      Organization.findByPk.mockResolvedValue(null);

      
      const result = await organizationController.getOrganization(organizationID);

      // Assert
      expect(result).toBeNull();
      expect(Organization.findByPk).toHaveBeenCalledWith(organizationID);
    });
  });

  //Tests for getUserOrganizationnByUserID function
  describe("getUserOrganizationByUserID", () => {

    //Test 5: Return user org when found by userID
    it("Should return a user organization when found by userID", async () => {
      
      const userID = 1;
      const mockUserOrganization = { UserID: 1, OrganizationID: 1, Roles: "A" };

      UserOrganization.findOne.mockResolvedValue(mockUserOrganization);

      const result = await organizationController.getUserOrganizationByUserID(userID);

      // Assert
      expect(result).toEqual(mockUserOrganization);
      expect(UserOrganization.findOne).toHaveBeenCalledWith({
        where: { UserID: userID },
      });
    });

    //Test 6: Null if no user org is found
    it("should return null if no user organization is found", async () => {
   
      const userID = 1;

      UserOrganization.findOne.mockResolvedValue(null);

  
      const result = await organizationController.getUserOrganizationByUserID(userID);

      // Assert
      expect(result).toBeNull();
      expect(UserOrganization.findOne).toHaveBeenCalledWith({
        where: { UserID: userID },
      });
    });
  });
});
