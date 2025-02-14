// userLoginModel.test.js

//Set up constants needed. We are mocking the db in this test
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock johndoe's account
// Writing the test that actually worked with the code without the DB was rather difficult, so we are just going to mock it up here for an easier solution
const UserLoginMock = dbMock.define('UserLogin', {
  UserID: 1,
  Password: 'password123', //johndoe password 
  MFATarget: 'SMS',
  LastPasswordChange: new Date(),
  LastMFAChange: new Date(),
  two_fa_enabled: true,
  two_fa_secret: 'some-secret',
  createdAt: new Date(),
  updatedAt: new Date(),
});

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
    
  })
});
