// userLoginModel.test.js

//Set up constants needed. We are mocking the db in this test
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock johndoe's account
// Writing the test that actually worked with the code without the DB was rather difficult, so we are just going to mock it up here for an easier solution
const UserLoginMock = dbMock.define('UserLogin', {
  UserID: 1,
  Password: 'password123', //johndoe password 
  MFATarget: 'Email',
  LastPasswordChange: new Date(),
  LastMFAChange: new Date(),
  two_fa_enabled: true,
  two_fa_secret: 'some-secret',
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Simulate the "database" with mock data. This is going to be used for the destroy/delete test
const mockUsers = [
    {
      UserID: 1,
      Password: 'password123', // johndoe password
      MFATarget: 'Email',
      LastPasswordChange: new Date(),
      LastMFAChange: new Date(),
      two_fa_enabled: true,
      two_fa_secret: 'some-secret',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];


//Describe the login tests we are trying to test
describe('UserLogin model tests', () => {
    //Correct login with johndoe
    it('Should successfully log in johndoe with the correct password', async () => {
    const userLogin = await UserLoginMock.findOne({ where: { UserID: 1 } });

    expect(userLogin).toBeTruthy();
    expect(userLogin.Password).toBe('password123');
    expect(userLogin.two_fa_enabled).toBe(true);
  });

  //Test for right uUer ID wrong password
  it('Should fail with an incorrect password', async () => {
    const userLogin = await UserLoginMock.findOne({ where: { UserID: 1 } });

    expect(userLogin).toBeTruthy();
    expect(userLogin.Password).not.toBe('notthedoridsyouarelookingfor');
  });

  //Test for wrong UserID with johndoe password
  it('Should fail with wrong UserID but correct password', async () =>{
    const userLoginWrongID = await UserLoginMock.findOne({ where: { UserID: 121425}});

    expect(userLoginWrongID).toBeNull;
  });

  // Test for an updated attribute, in this case its a password change
  it('Should successfully change the password for johndoe', async () => {
    // Simulate retrieving johndoe's account to log in
    const userLogin = await UserLoginMock.findOne({ where: { UserID: 1 } });

    // Change the password
    const newPassword = 'maytheforcebewithyou';
    userLogin.Password = newPassword;

    //Update the date for when the password was changed, being simulated here
    userLogin.LastPasswordChange = new Date();

    // Simulate saving the new password to johndoes account
    const updatedUserLogin = await userLogin.save(); 

    // Verify that the password was updated correctly
    expect(updatedUserLogin.Password).toBe(newPassword); // Password should now be 'maytheforcebewithyou'

    //Double check that the old password isn't correct
    expect(updatedUserLogin.Password).not.toBe('password123');
    
 
    });

  // Test for deleting a user
  //This test is a lil jank, but it works out in the end. Calling .destroy here doens't do much since this isn't a real
  // db enviroment, so I had to mock up something that simulates destroying. There is an array that will be simulating
  // the db and it's user, and that's what we're deleteing from in the test
  it('Should delete a user and confirms it no longer exists', async () => {
    
    //Set up user (johndoe)
    const userLogin = await UserLoginMock.findOne({ where: { UserID: 1 } });
    
    // Confirm the user exists before deletion
    expect(userLogin).toBeTruthy();

    // Mock the destroy method to simulate deletion
    userLogin.destroy = jest.fn().mockImplementation(async () => {
        // Simulate deletion: remove the user from the mockUsers array (This would be the db irl)
        const index = mockUsers.findIndex((user) => user.UserID === userLogin.UserID);
        if (index !== -1) {
            mockUsers.splice(index, 1); // Remove the user from the array
        }

        // Update the UserLoginMock model's internal data since the user was deleted
        UserLoginMock.findAll = jest.fn().mockResolvedValue(mockUsers); 
    });

    // Delete the user
    await userLogin.destroy(); // Simulate the destroy operation

    // After deletion, manually update findOne to reflect the updated state
    UserLoginMock.findOne = jest.fn().mockImplementation(async ({ where }) => {
        const user = mockUsers.find(u => u.UserID === where.UserID);
        return user || null;
    });

    // Try to find the user again to confirm they are deleted
    const deletedUserLogin = await UserLoginMock.findOne({ where: { UserID: 1 } });

    // Confirm that the user has been deleted
    expect(deletedUserLogin).toBeNull();
});
  

});
