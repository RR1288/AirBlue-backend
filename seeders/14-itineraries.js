module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Itineraries', [
      {
        UserID: 1,  // John Doe
        EventID: 1,

        DuffelOrderID: "ord_sample",
        DuffelPassID: "pas_sample",
        DuffelOfferID: "off_sample",

        BookingReference: "ABC123",
        TotalCost: 500.00,
        BaseCost: 450.00,
        TaxCost: 50.00,

        ApprovalStatus: 'approved',

        heldAt: new Date("2025-03-15"),
        approvedAt: new Date("2025-03-16"),
        expiresAt: new Date("2025-03-17"),

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 2,  // Jane Doe
        EventID: 2,

        DuffelOrderID: "ord_sample",
        DuffelPassID: "pas_sample",
        DuffelOfferID: "off_sample",

        BookingReference: "ABC123",
        TotalCost: 500.00,
        BaseCost: 450.00,
        TaxCost: 50.00,

        ApprovalStatus: 'pending',

        heldAt: new Date("2025-03-15"),
        approvedAt: new Date("2025-03-16"),
        expiresAt: new Date("2025-03-17"),

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 3,
        EventID: 1,

        DuffelOrderID: "ord_sample",
        DuffelPassID: "pas_sample",
        DuffelOfferID: "off_sample",

        BookingReference: "ABC123",
        TotalCost: 700.00,
        BaseCost: 650.00,
        TaxCost: 50.00,

        ApprovalStatus: 'denied',

        heldAt: new Date("2025-03-15"),
        expiresAt: new Date("2025-03-17"),
        cancelledAt: new Date("2025-03-17"),

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 4,
        EventID: 3,

        DuffelOrderID: "ord_sample",
        DuffelPassID: "pas_sample",
        DuffelOfferID: "off_sample",

        BookingReference: "ABC123",
        TotalCost: 700.00,
        BaseCost: 650.00,
        TaxCost: 50.00,

        ApprovalStatus: 'pending',

        heldAt: new Date("2025-03-15"),
        expiresAt: new Date("2025-03-17"),

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 5,
        EventID: 1,

        DuffelOrderID: "ord_sample",
        DuffelPassID: "pas_sample",
        DuffelOfferID: "off_sample",

        BookingReference: "ABC123",
        TotalCost: 700.00,
        BaseCost: 650.00,
        TaxCost: 50.00,

        ApprovalStatus: 'approved',

        heldAt: new Date("2025-03-15"),
        expiresAt: new Date("2025-03-17"),
        approvedAt: new Date("2025-03-17"),

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 6,
        EventID: 1,

        DuffelOrderID: "ord_sample",
        DuffelPassID: "pas_sample",
        DuffelOfferID: "off_sample",

        BookingReference: "ABC123",
        TotalCost: 600.00,
        BaseCost: 550.00,
        TaxCost: 50.00,

        ApprovalStatus: 'approved',

        heldAt: new Date("2025-03-16"),
        expiresAt: new Date("2025-03-18"),
        approvedAt: new Date("2025-03-17"),

        createdAt: new Date(),
        updatedAt: new Date()
      }]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Itineraries', null, {});
  }
};
