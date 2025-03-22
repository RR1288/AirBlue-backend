module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Itineraries', [
      {
        UserID: 1,  // John Doe - Tech Conference 2025
        EventID: 1,
        DuffelOrderID: "ord_001",
        DuffelPassID: "pas_001",
        DuffelOfferID: "off_001",
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
        UserID: 2,  // Jane Doe - Annual Music Festival
        EventID: 2,
        DuffelOrderID: "ord_002",
        DuffelPassID: "pas_002",
        DuffelOfferID: "off_002",
        BookingReference: "DEF456",
        TotalCost: 550.00,
        BaseCost: 500.00,
        TaxCost: 50.00,
        ApprovalStatus: 'pending',
        heldAt: new Date("2025-03-15"),
        approvedAt: null,
        expiresAt: new Date("2025-03-17"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 3,
        EventID: 1,
        DuffelOrderID: "ord_006",
        DuffelPassID: "pas_006",
        DuffelOfferID: "off_006",
        BookingReference: "PQR678",
        TotalCost: 650.00,
        BaseCost: 600.00,
        TaxCost: 50.00,
        ApprovalStatus: 'approved',
        heldAt: new Date("2025-03-16"),
        approvedAt: new Date("2025-03-17"),
        expiresAt: new Date("2025-03-18"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 4,
        EventID: 3,
        DuffelOrderID: "ord_007",
        DuffelPassID: "pas_007",
        DuffelOfferID: "off_007",
        BookingReference: "STU901",
        TotalCost: 500.00,
        BaseCost: 450.00,
        TaxCost: 50.00,
        ApprovalStatus: 'pending',
        heldAt: new Date("2025-03-16"),
        expiresAt: new Date("2025-03-18"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Itineraries', null, {});
  }
};
