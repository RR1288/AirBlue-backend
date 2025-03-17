const DUFFEL_API_KEY = process.env.DUFFEL_API_KEY;
const {Itinerary, Slice, Segment, sequelize} = require("../models");
const {parseDuration} = require("../utils/flightUtils")

exports.createOfferRequest = async ({
    origin,
    destination,
    departureDate,
    returnDate,
    cabinClass,
}) => {
    try {
        const response = await fetch(
            // set return_offers to false
            "https://api.duffel.com/air/offer_requests?return_offers=false",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${DUFFEL_API_KEY}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Duffel-Version": "v1",
                },
                body: JSON.stringify({
                    data: {
                        slices: [
                            // Origin
                            {
                                origin: origin,
                                destination: destination,
                                departure_date: departureDate,
                            },
                            // Return
                            {
                                origin: destination,
                                destination: origin,
                                departure_date: returnDate,
                            },
                        ],
                        passengers: [{type: "adult"}],
                        cabin_class: cabinClass || "economy",
                    },
                }),
            }
        );

        if (response.ok) {
            const data = await response.json();
            // return offer request id
            return data.data.id;
        } else {
            throw new Error("Error creating an offer request");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error creating an offer request");
    }
};

exports.fetchOffers = async ({offerRequestId, limit, after, before}) => {
    try {
        let url = `https://api.duffel.com/air/offers?offer_request_id=${offerRequestId}&limit=${limit}`;

        if (after) url += `&after=${after}`;
        if (before) url += `&before=${before}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${DUFFEL_API_KEY}`,
                Accept: "application/json",
                "Duffel-Version": "v1",
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("Error fetching offers");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching offers");
    }
};

exports.fetchFlight = async (offer_id) => {
    try {
        // Fetch flight details from Duffel API
        const response = await fetch(
            `https://api.duffel.com/air/offers/${offer_id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${DUFFEL_API_KEY}`,
                    Accept: "application/json",
                    "Duffel-Version": "v1",
                },
            }
        );

        if (response.ok) {
            const offer = await response.json();
            // Check expires_at
            // Check live_mode
            // Check total_amount unchanged
            // Check available_services
            // const now = new Date();
            // const expiresAt = new Date(offer.expires_at);
            // if (
            //     offer.live_mode === true &&
            //     expiresAt > now &&
            //     offer.available_services.length > 0
            // ) {
            //     return offer.data;
            // }
            return offer.data;
            // throw new Error("Flight no longer available");
        } else {
            throw new Error("Error fetching offer. Response not OK");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching offer");
    }
};

exports.holdOffer = async (user_id, event_id, offer_id, passengers) => {
    const transaction = await sequelize.transaction();

    try {
        let body = {
            data: {
                type: "hold",
                selected_offers: [offer_id],
                passengers: passengers,
            },
        };
        body = JSON.stringify(body);

        // Fetch flight details from Duffel API
        const response = await fetch("https://api.duffel.com/air/orders", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${DUFFEL_API_KEY}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "Duffel-Version": "v1",
            },
            body: body,
        });

        if (!response.ok) {
            console.error(await response.json());
            throw new Error("Error holding flight. Response not OK");
        }

        const order = await response.json();
        const data = order.data;
        console.log(data);
        

        // Save itinerary
        const itinerary = await Itinerary.create(
            {
                UserID: user_id,
                EventID: event_id,
                DuffelOrderID: data.id,
                DuffelPassID: data?.passengers?.[0]?.id || null, // Safe access to passenger ID
                DuffelOfferID: offer_id,
                BookingReference: data.booking_reference,
                TotalCost: data.total_amount,
                BaseCost: data.base_amount,
                TaxCost: data.tax_amount,
                ApprovalStatus: "pending",
                heldAt: new Date(),
                expiresAt: new Date(data.payment_status.payment_required_by),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {transaction}
        );

        if (!itinerary) {
            throw new Error("Could not save Itinerary");
        }

        // Save slices
        for (const slice of data.slices) {
            console.log("SLICE: ", slice);            
            
            const sliceRecord = await Slice.create(
                {
                    ItineraryID: itinerary.ItineraryID,
                    OriginAirport: slice?.origin?.name || "", // using airport name if available
                    OriginCity: slice?.origin?.city_name || "",
                    OriginIATA: slice?.origin?.iata_code,
                    
                    DestinationAirport: slice?.destination?.name || "",
                    DestinationCity:
                        slice?.destination?.city_name || "",
                    DestinationIATA:
                        slice?.destination?.iata_code,
                    Duration: parseDuration(slice.duration), // Duffel returns duration in minutes
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {transaction}
            );
            console.log(sliceRecord);
            
            if (!sliceRecord) {
                throw new Error("Could not save Slice");
            }

            // Loop through each segment of the current slice
            for (const segment of slice.segments) {
                console.log("SEGMENT: ", segment);
                
                const segmentRecord = await Segment.create(
                    {
                        SliceID: sliceRecord.SliceID,

                        OriginAirport: segment?.origin?.name,
                        OriginCity: segment?.origin?.city_name || "",
                        OriginIATA: segment?.origin?.iata_code,

                        DestinationAirport: segment?.destination?.name,
                        DestinationCity: segment?.destination?.city_name || "",
                        DestinationIATA: segment?.destination?.iata_code,

                        OriginTime: segment.departing_at,
                        DestinationTime: segment.arriving_at,

                        Duration: parseDuration(segment.duration),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {transaction}
                );

                if (!segmentRecord) {
                    throw new Error("Could not save Segment");
                }
            }
        }

        // Commit transaction if everything is successful
        await transaction.commit();
        return data;
    } catch (error) {
        // Rollback transaction in case of any error
        await transaction.rollback();
        console.error(error);
        throw new Error("Error holding flight");
    }
};

exports.bookFlight = async (orderID) => {
    try {
        // Fetch the itinerary from the database
        const itinerary = await Itinerary.findOne({
            where: {DuffelOrderID: orderID},
        });

        if (!itinerary) {
            throw new Error("Itinerary not found for the given order ID.");
        }

        // Use the itinerary's total cost as the amount
        const amount = itinerary.TotalCost;

        // Request payment using Duffel API
        const response = await fetch("https://api.duffel.com/air/payments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${DUFFEL_API_KEY}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "Duffel-Version": "v1",
            },
            body: JSON.stringify({
                data: {
                    order_id: orderID,
                    payment: {
                        type: "balance",
                        amount: amount,
                        currency: "USD",
                    },
                },
            }),
        });

        if (!response.ok) {
            throw new Error("Error booking flight. Response not OK.");
        }

        const data = await response.json();
        console.log("Payment Response:", data);

        // Update itinerary: approved and paid
        itinerary.ApprovalStatus = "approved";
        itinerary.approvedAt = new Date();
        itinerary.updatedAt = new Date();

        await itinerary.save();

        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error booking flight");
    }
};
