//flightViews.test.js

//Constants
const { getFlightInfo } = require('../views/flightViews');
const { Itinerary, Slice, Segment } = require('../models');

// Mocking
jest.mock('../models', () => ({
    Itinerary: {
        findAll: jest.fn(),
    },
    Slice: {},
    Segment: {},
}));

//Tests for getFlightInfo function
describe('getFlightInfo', () => {

    //Test 1: Return flight info when found
    it('Should return flight info when data is found', async () => {
        
        const mockData = [
            {
                AttendeeID: 1,
                Slices: [
                    {
                        id: 1,
                        Segments: [{ id: 1, name: 'Segment 1' }, { id: 2, name: 'Segment 2' }],
                    },
                ],
            },
        ];

        
        Itinerary.findAll.mockResolvedValue(mockData);

        
        const result = await getFlightInfo(1);

        
        expect(Itinerary.findAll).toHaveBeenCalledWith(expect.objectContaining({
            include: [
                {
                    model: Slice,
                    include: [
                        {
                            model: Segment,
                            required: true,
                        },
                    ],
                    required: true,
                },
            ],
            where: { AttendeeID: 1 }, 
        }));
        expect(result).toEqual(mockData);
    });

    //Test 2: Empty objext when no data
    it('Should return an empty object when no data is found', async () => {
        
        Itinerary.findAll.mockResolvedValue([]);

        
        const result = await getFlightInfo(1);

        
        expect(Itinerary.findAll).toHaveBeenCalledWith(expect.objectContaining({
            include: [
                {
                    model: Slice,
                    include: [
                        {
                            model: Segment,
                            required: true,
                        },
                    ],
                    required: true,
                },
            ],
            where: { AttendeeID: 1 },  
        }));
        expect(result).toEqual([]);
    });

    //Test 3: Throw error when db error
    it('Should throw an error when there is a database error', async () => {
        
        Itinerary.findAll.mockRejectedValue(new Error('Database error'));

        
        await expect(getFlightInfo(1)).rejects.toThrow('failed to get flight information');
    });
});
