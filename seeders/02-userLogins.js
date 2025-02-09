const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('UserLogins', [
      {
        UserID: 1,
        Password: await bcrypt.hash('password123', 10),
        MFATarget: '123-456-7890',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 2,
        Password: await bcrypt.hash('securepass456', 10),
        MFATarget: '987-654-3210',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 3,
        Password: await bcrypt.hash('mypassword789', 10),
        MFATarget: '112-233-4455',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 4,
        Password: await bcrypt.hash('mypassword123', 10),
        MFATarget: '223-344-5566',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 5,
        Password: await bcrypt.hash('adminpass456', 10),
        MFATarget: '334-455-6677',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 6,
        Password: await bcrypt.hash('emilypassword', 10),
        MFATarget: '445-566-7788',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 7,
        Password: await bcrypt.hash('danielpassword789', 10),
        MFATarget: '556-677-8899',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 8,
        Password: await bcrypt.hash('sarahpassword321', 10),
        MFATarget: '667-788-9900',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 9,
        Password: await bcrypt.hash('michaelpassword567', 10),
        MFATarget: '778-899-0011',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 10,
        Password: await bcrypt.hash('oliviapassword999', 10),
        MFATarget: '889-900-1122',
        LastPasswordChange: new Date(),
        LastMFAChange: new Date(),
        two_fa_enabled: false,
        two_fa_secret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('UserLogins', null, {});
  }
};
